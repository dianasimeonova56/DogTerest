import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { getUserData } from '../util.js';

// Dashboard template
export const homeTemplate = (userData) => html`
<section id="home">
        <div class="home-page">
                <img src="./frontend/imgs/dog.png" alt="Cute dog image">
                <p>Welcome to DogTerest!</p>
                <div class="button-group">
                ${userData ? html`<p><a href="/dashboard">Dashboard</a></p>
                <p><a href="/favourites">Favourites</a></p>`
                :
                html`<p><a href="/login">Login</a></p>
                <p><a href="/signup">Register</a></p>`}
                
                </div>
        </div>
</section>
`;

export async function homePage() {
        const userData = await getUserData();
        render(homeTemplate(userData), main);
}
