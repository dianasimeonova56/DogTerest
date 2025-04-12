import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { getFavPictures, getUserLikes, updateUser } from '../functions.js';
import { clearUserData, getUserData } from '../util.js';
import page from '../../node_modules/page/page.mjs';
import { imageTemplate } from '../constants/imageTemplate.js';

const currUserProfileTemplate = (userData, pictures, onEdit, onDelete) => html`
   <section id="profile">
    <div class="form-container">
        <h1> ${userData.first_name} ${userData.last_name}'s Profile</h1>
        <h3> ${userData.first_name}'s Favourite Pictures</h3>
        ${pictures.length>0
            ? pictures.map(imgs => imageTemplate(imgs))
            : html`<p>${userData.first_name} doesn't have any favourite pictures :(`
        } </div> 
        
        <div class="form-container">
            <h3>Edit your profile</h3>
        <form>
            <input id="first_name" name="first_name" .value=${userData.first_name}>
            <input id="last_name" name="last_name" .value=${userData.last_name}>
            <input id="email" name="email" .value=${userData.email}>
        </form>
        
        <div class="button-group">
                    <button type="button" @click=${onEdit}>Edit</button>
                    <button type="button" @click=${onDelete}>Delete</button>
        </div>
    </div>
</section>
`;

export async function currUserProfilePage() {
    const userData = await getUserData();
    
    const pictures = await getFavPictures(userData.user_id);
    
    function update() {
        render(currUserProfileTemplate(userData, pictures.favs, onEdit, onDelete), main);
    }

    update();
    
    async function onEdit() {
        debugger
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;
        const userData = await getUserData()
        const toEdit = {
            user_id: userData.user_id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            is_admin: userData.is_admin
        }
        try {
            await updateUser(toEdit);
            alert('User updated successfully')
            update();
        } catch (e) {
            alert(e.message);
            console.log("Error: " + e.message);
        }
    }

     async function onDelete() {
        if(confirm('Are you sure you want to delete your profile?')) {
            try {
                await deleteUser({"user_id": userData.user_id});
                alert('User deleted successfully!');
                clearUserData();
                page.redirect('/home');
            } catch(e) {
                alert(e.message);
                console.log("Error: " + e.message);
            }
        }

    }
}
