import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { addToFavourites, deletePicture, editPicture, getLikes, getPictureById, getUser, getUserFavPictures, getUserLikes, likePicture, removeFromFavourites, unlikePicture } from '../functions.js';
import { getUserData, showToast } from '../util.js';
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
        
        ${userData ? html`<div class="button-group">
            ${image.canEdit
        ? html`
                    <button type="button" @click=${onEdit}>Edit</button>
                    <button type="button" @click=${onDelete}>Delete</button>`
        : html`
                    ${image.hasLiked == true
                ? html`<button type="button" @click=${onUnlike}>Unlike</button>`
                : html`<button type="button" @click=${onLike}>Like</button>`
            } 
                    ${image.hasBeenAdded == true
                ? html`<button type="button" @click=${removeFromFavs}>Remove from favourites</button>`
                : html`<button type="button" @click=${addToFavs}>Add to favourites</button>`
            }`
        }
        </div>
        ` : html`<p>If you want to like this picture, <a href="./login">log in</a></p>`}
        
    </div>
    <div id="overlay-likes" class="overlay-form">
        <div class="modal">
                <span id="closeModal" class="close" role="button" tabindex="0">&times;</span>
                    <h1>Likes</h1>
                    <div id="likes-list">
                    </div>
            </div>
        </div>
</section>
`;

export async function detailsPage(ctx) {
    
    const id = ctx.params.id;
    const item = await getPictureById(id);

    const userData = await getUserData();
    
    const owner = await getUser(item.image.user_id)
    let likes = await getLikes(id);
   

    if (userData) {
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
        item.image.canEdit = userData.user_id === item.image.user_id || userData.is_admin === 1;
        item.image.hasLiked = hasLiked;
        item.image.hasBeenAdded = hasBeenAdded;
        item.image.likes = likes.likes_count;
    }
    
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
            showToast("Picture edited successfully", "success");
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
            showToast("Picture deleted successfully", "success");
            page.redirect('/dashboard');
        }
    }

    async function onLike() {
        try {
            await likePicture(id, userData.user_id);

            item.image.hasLiked = true;
            const likesData = await getLikes(id);

            item.image.likes = likesData.likes_count;

            showToast("Picture liked successfully", "success");
            update();
        } catch (e) {
            alert(e);
            console.log('Error liking picture:', e);
        }
    }

    async function onUnlike() {
        try {
            await unlikePicture(id, userData.user_id);

            item.image.hasLiked = false;
            const likesData = await getLikes(id);

            item.image.likes = likesData.likes_count;
            showToast("Picture disliked :(", "success");
            update();
        } catch (e) {
            alert(e);
            console.log('Error unliking picture:', e);
        }
    }

    async function addToFavs() {
        try {
            await addToFavourites(id, userData.user_id);

            item.image.hasBeenAdded = true;
            showToast("Picture added to favs", "success");
            update();
        } catch (e) {
            alert(e);
            console.log('Error adding picture to favourites:', e);
        }
    }

    async function removeFromFavs() {
        try {
            await removeFromFavourites(id, userData.user_id);

            item.image.hasBeenAdded = false;
            showToast("Picture removed from faves", "success");
            update();
        } catch (e) {
            showToast(e.message, "error")
            console.log('Error removing picture from favourites:', e);
        }
    }

    async function onLikesClick() {
        
        likes = await getLikes(id);
        
        document.getElementById('likes-list').innerHTML = likes.likes_count > 0 
        ? likes.likes.map(like => likeTemplate(like)).join('')
        : '<p>No likes found.</p>';

        
        document.getElementById('overlay-likes').style.display = 'flex';
        document.getElementById('closeModal').onclick = function () {
            document.getElementById('overlay-likes').style.display = 'none';
        };

    }
}
