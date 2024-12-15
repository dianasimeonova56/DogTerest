import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { deletePicture, editPicture, getLikes, getPictureById, getUserLikes, likePicture, unlikePicture } from '../functions.js';
import { getUserData } from '../util.js';
import page from '../../node_modules/page/page.mjs';

const detailsTemplate = (image, onEdit, onDelete, onLike, addToFavs, onUnlike) => html`
   <section id="details">
    <div class="form-container">
        <div class="item">
            <div class="content-details">
                <img src="${image.uploaded_image_url}" alt="Post Image" />
            </div>
        </div>
        ${image.canEdit ? html`<form>
            <input id="description" name="description" .value=${image.description}>
        </form>` : html`<p id="description" name="description">${image.description}</p>`}
        
        <div id="likes">Likes: ${image.likes}</div>
        <div class="button-group">
            ${image.canEdit 
                ? html`
                    <button type="button" @click=${onEdit}>Edit</button>
                    <button type="button" @click=${onDelete}>Delete</button>`
                : html`
                    ${image.hasLiked == true
                        ? html`<button type="button" @click=${onUnlike}>Unlike</button>`
                        : html`<button type="button" @click=${onLike}>Like</button>`
                    }
                    <button type="button" @click=${addToFavs}>Add to Favourites</button>`
            }
        </div>
    </div>
</section>
`;

export async function detailsPage(ctx) {
    debugger
    const id = ctx.params.id;
    const item = await getPictureById(id);
    
    const userData = await getUserData();

    let likes = await getLikes(id); // Retrieve likes data
    console.log(likes);
    let userLiked = await getUserLikes(id, userData.id);
    let hasLiked = false;
    if (userLiked.result != 0) {
        hasLiked = true;
    }
    
    if (userData) {
        debugger
        item.image.canEdit = userData.id === item.image.user_id;
        item.image.hasLiked = hasLiked;
        item.image.likes = likes.likes_count;
    }
    console.log(item.image.hasLiked);
    
    function update() {
        render(detailsTemplate(item.image, onEdit, onDelete, onLike, addToFavs, onUnlike), main);
    }

    update();  // Initial render with current state

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
            await likePicture(id, userData.id);  // Add like
            console.log('Liked picture');
            
            item.image.hasLiked = true;  // Set `hasLiked` to true
            const likesData = await getLikes(id);  // Fetch updated likes data
            console.log(likesData);
            
            item.image.likes = likesData.likes_count;  // Update likes count
            update();  // Re-render the UI with the updated state
        } catch (e) {
            alert(e);
            console.log('Error liking picture:', e);
        }
    }

    async function onUnlike() {
        try {
            await unlikePicture(id, userData.id);  // Remove like
            console.log('Unliked picture');
            
            item.image.hasLiked = false;  // Set `hasLiked` to false
            const likesData = await getLikes(id);  // Fetch updated likes data
            console.log(likesData);
            
            item.image.likes = likesData.likes_count;  // Update likes count
            update();  // Re-render the UI with the updated state
        } catch (e) {
            alert(e);
            console.log('Error unliking picture:', e);
        }
    }

    function addToFavs() {
        // Implement logic for adding to favorites, if needed
    }
}
