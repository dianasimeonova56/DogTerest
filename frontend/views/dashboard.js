import { html, render } from '../../node_modules/lit-html/lit-html.js'
import { main } from '../app.js';

//TODO replace w/ actual layout
export const dashboardTemplate = () => html`
<!-- Navigation -->
<section id="dashboard">
        <div class="item">
            <div class="content">
                <img src="/frontend/imgs/marki.png" alt="Post Image" />
                <div class="overlay">I am Markie :3</div>
            </div>
        </div>
        <div class="item">
            <div class="content">
                <img src="/frontend/imgs/marki2.png" alt="Post Image" />
                <div class="overlay">I am Markie :3</div>
            </div>
        </div>
        <div class="item">
            <div class="content circle-plus">
                <!-- <img src="./imgs/circlewithplus.png" alt="Post Image" class="add"/> -->
            </div>
        </div>
    </section>
`

export function dashboardPage() {
    render(dashboardTemplate(), main)
}