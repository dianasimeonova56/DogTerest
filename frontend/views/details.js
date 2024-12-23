import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { addToFavourites, deletePicture, editPicture, getLikes, getPictureById, getUser, getUserFavPictures, getUserLikes, likePicture, removeFromFavourites, unlikePicture } from '../functions.js';
import { getUserData } from '../util.js';
import page from '../../node_modules/page/page.mjs';
import { likeTemplate } from '../constants/likesTemplate.js';

const detailsTemplate = (image, onEdit, onDelete, onLike, addToFavs, onUnlike, removeFromFavs, owner, userData, likes, onLikesClick) => html`
   <section id="details">
    <div class="form-container">
        <div class="item">
            <div class="content-details">
                <img src="/${image.uploaded_image_url}" alt="Post Image" />
            </div>
        </div>
        
        ${image.canEdit ? html`<form>
            <input id="description" name="description" .value=${image.description}>
        </form>` : html`<p>Added by <a href="/profile/${owner.user_id}">${owner.first_name} ${owner.last_name}</a></p>
                <p id="description" name="description">${image.description}</p>`}
        
        <div id="likes" @click=${onLikesClick}>Likes: ${image.likes}</div>
        <div class="button-group">
            ${image.canEdit || userData.is_admin === 1
        ? html`
                    <button type="button" @click=${onEdit}>Edit</button>
                    <button type="button" @click=${onDelete}>Delete</button>`
        : html`
                    ${image.hasLiked == true || userData.is_admin === 1
                ? html`<button type="button" @click=${onUnlike}>Unlike</button>`
                : html`<button type="button" @click=${onLike}>Like</button>`
            } 
                    ${image.hasBeenAdded == true || userData.is_admin === 1
                ? html`<button type="button" @click=${removeFromFavs}>Remove from favourites</button>`
                : html`<button type="button" @click=${addToFavs}>Add to favourites</button>`
            }`
    }
        </div>
    </div>
    <div id="overlay-likes" class="overlay-form">
        <div class="modal">
            <span id="closeModal" class="close" role="button" tabindex="0">&times;</span>
            <h1>Likes</h1>
            <div>
                ${likes.map(like => likeTemplate(like))}
            </div>
        </div>
    </div>
</section>
`;

export async function detailsPage(ctx) {
    debugger
    const id = ctx.params.id;
    const item = await getPictureById(id);

    const userData = await getUserData();
    const owner = await getUser(item.image.user_id)
    let likes = await getLikes(id);


    let userLiked = await getUserLikes(id, userData.user_id);
    let hasLiked = false;
    let userAdded = await getUserFavPictures(id, userData.user_id);

    let hasBeenAdded = false;
    if (userLiked.result != 0) {
        hasLiked = true;
    }
    if (userAdded.result != 0) {
        hasBeenAdded = true;
    }

    if (userData) {
        item.image.canEdit = userData.user_id === item.image.user_id;
        item.image.hasLiked = hasLiked;
        item.image.hasBeenAdded = hasBeenAdded;
        item.image.likes = likes.likes_count;
    }
    console.log(item.image.canEdit);
    
    function update() {
        render(detailsTemplate(item.image, onEdit, onDelete, onLike, addToFavs, onUnlike,
            removeFromFavs, owner.user, userData, likes.likes, onLikesClick), main);
    }

    update();

    async function onEdit() {
        const toEdit = document.getElementById("description").value;
        const data = { toEdit };
        try {
            await editPicture(id, data);
            console.log('Updated picture');
            page.redirect('/dashboard');
        } catch (e) {
            alert(e.message);
            console.log('Error updating item:', e);
        }
    }

    async function onDelete() {
        const choice = confirm('Are you sure you want to delete?');
        if (choice) {
            await deletePicture(id);
            page.redirect('/dashboard');
        }
    }

    async function onLike() {
        try {
            await likePicture(id, userData.user_id);
            console.log('Liked picture');

            item.image.hasLiked = true;
            const likesData = await getLikes(id);
            console.log(likesData);

            item.image.likes = likesData.likes_count;
            update();
        } catch (e) {
            alert(e);
            console.log('Error liking picture:', e);
        }
    }

    async function onUnlike() {
        try {
            await unlikePicture(id, userData.user_id);
            console.log('Unliked picture');

            item.image.hasLiked = false;
            const likesData = await getLikes(id);
            console.log(likesData);

            item.image.likes = likesData.likes_count;
            update();
        } catch (e) {
            alert(e);
            console.log('Error unliking picture:', e);
        }
    }

    async function addToFavs() {
        try {
            await addToFavourites(id, userData.user_id);
            console.log('Added picture to favourites');

            item.image.hasBeenAdded = true;
            update();
        } catch (e) {
            alert(e);
            console.log('Error adding picture to favourites:', e);
        }
    }

    async function removeFromFavs() {
        try {
            await removeFromFavourites(id, userData.user_id);
            console.log('Removed picture from favourites');

            item.image.hasBeenAdded = false;
            update();
        } catch (e) {
            alert(e);
            console.log('Error removing picture from favourites:', e);
        }
    }

    async function onLikesClick() {
        document.getElementById('overlay-likes').style.display = 'flex';
        console.log('Form overlay is displayed.');

        document.getElementById('closeModal').onclick = function (e) {
            e.stopPropagation();
            document.getElementById('overlay-likes').style.display = 'none';
        };

    }
}
