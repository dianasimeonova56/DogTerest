import { html } from '../../node_modules/lit-html/lit-html.js'

export const imageTemplate = (image) => html`
<div class="item">
            <div class="content">
                <img src="${image.url}" alt="Post Image" />
                <div class="overlay">${image.description}</div>
            </div>
        </div>`