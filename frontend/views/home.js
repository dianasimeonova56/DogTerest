import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { getUserData } from '../util.js';

export const homeTemplate = (userData) => html`
<section id="home">
    <div class="home-page">
        <div class="home-content">
            <h1>Welcome to DogTerest!</h1>
            <p>Your one-stop place for dog lovers. Share, explore, and connect with fellow dog enthusiasts.</p>
            <div class="button-group-home">
                ${userData
                    ? html`
                        <a href="/dashboard">Go to Dashboard</a>
                        <a href="/current_user_profile">My Profile</a>
                      `
                    : html`
                        <a href="/login">Login</a>
                        <a href="/signup">Register</a>
                      `}
            </div>
        </div>

        <div class="home-image">
            <img src="/imgs/hero.png" alt="Cute dog image" />
        </div>
    </div>
</section>
`;

export async function homePage() {
    const userData = await getUserData();
    render(homeTemplate(userData), main);
}
