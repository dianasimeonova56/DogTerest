import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';

// Dashboard template
export const homeTemplate = () => html`
<section id="home">
        <div class="home-page">
                <img src="./frontend/imgs/dog.png" alt="Cute dog image">
                <p>Welcome to DogTerest!</p>
                <div class="button-group">
                <p><a href="/login">Login</a></p>
                <p><a href="/signup">Register</a></p>
                </div>
        </div>
</section>
`;

export function homePage() {
    render(homeTemplate(), main);
}
