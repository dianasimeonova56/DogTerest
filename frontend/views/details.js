import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { deletePicture, editPicture, getPictureById } from '../functions.js';
import { getUserData } from '../util.js';
import page from '../../node_modules/page/page.mjs'

const detailsTemplate = (image, onEdit, onDelete, onLike, addToFavs) => html`
   <section id="details">
   
    <div class="form-container">
        <div class="item">
            <div class="content-details">
                <img src="${image.uploaded_image_url}" alt="Post Image" />
            </div>
        </div>
        ${
            image.canEdit ? html`<form>
            <input id="description"
                name="description"
                .value=${image.description} 
                >
            </form>`: html`
            <p id="description"
                name="description"
                >${image.description} </p>`
        }
        
            <div class="button-group">
            ${image.canEdit ? html`
                <button type="button" @click=${onEdit}>Edit</button>
                <button type="button" @click=${onDelete}>Delete</button>
                ` : html`
                <button type="button" @click=${onLike}>Like</button>
                <button type="button" @click=${addToFavs}>Add to Favourites</button>
                `
    }
    </div>
    </div>
</section>
`

export async function detailsPage(ctx) {
    const id = ctx.params.id;
    const item = await getPictureById(id);

    const userData = await getUserData();
    
    if (userData) {
        item.image.canEdit = userData.id === item.image.user_id;
    }
    
    render(detailsTemplate(item.image, onEdit, onDelete, onLike, addToFavs), main);

    async function onEdit() {
        const toEdit = document.getElementById("description").value;
        const data = {
            toEdit: toEdit
        }
        try {
            await editPicture(id, data);
            console.log('updated picture');
            page.redirect('/dashboard')
        }
        catch (e) {
            alert(e.message);
            console.log('Error updating item:', e);
        }
    }

    async function onDelete() {
        debugger
        const choice = confirm('Are you sure you want to delete?');
        if (choice) {
            await deletePicture(id);
            // page.redirect('/catalog')
            window.location.replace('/home')
        }
    }
    
    async function onLike() {
    }

    async function addToFavs() {
    }
}