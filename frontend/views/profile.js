import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { getFavPictures, getUser, getUserPictures } from '../functions.js';
import page from '../../node_modules/page/page.mjs';
import { imageTemplate } from '../constants/imageTemplate.js';

const profileTemplate = (user, userImages, favPics) => html`
   <section id="profile">
   <h1> ${user.first_name} ${user.last_name}'s Profile</h1>
   <div class="pictures-container">
    <div class="form-container">
            <h3> ${user.first_name}'s Pictures</h3>
            ${userImages.length>0
                ? userImages.map(userImg => imageTemplate(userImg))
                : html`<p>${userData.first_name} doesn't have any pictures :(`
            } 
        </div>
            <div class="form-container">
            <h3> ${user.first_name}'s Favourite Pictures</h3>
            ${favPics.length>0
                ? favPics.map(fav => imageTemplate(fav))
                : html`<p>${userData.first_name} doesn't have any favourite pictures :(`
            } 
        </div> 
</section>
`;

export async function profilePage(ctx) {
    const user = await getUser(ctx.params.id);
    
    const pictures = await getFavPictures(user.user.user_id);
    const userPics = await getUserPictures(user.user.user_id);
    
    render(profileTemplate(user.user,userPics.images, pictures.favs), main);
}
