import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { getFavPictures, getUser } from '../functions.js';
import page from '../../node_modules/page/page.mjs';
import { imageTemplate } from '../constants/imageTemplate.js';

const profileTemplate = (user, pictures) => html`
   <section id="profile">
    <div class="form-container">
        <h1> ${user.first_name} ${user.last_name}'s Profile</h1>
        <h3> ${user.first_name}'s Favourite Pictures</h3>
        ${pictures.length>0
            ? pictures.map(imgs => imageTemplate(imgs))
            : html`<p>${user.first_name} doesn't have any favourite pictures :(`
        }   
    </div>
</section>
`;

export async function profilePage(ctx) {
    const user = await getUser(ctx.params.id);
    
    const pictures = await getFavPictures(user.user.user_id);
    console.log(pictures);
    
    render(profileTemplate(user.user, pictures.favs), main);
}
