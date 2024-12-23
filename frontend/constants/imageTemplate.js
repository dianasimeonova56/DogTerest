import { html } from '../../node_modules/lit-html/lit-html.js'

export const imageTemplate = (image) => html`
<div class="item">
            <div class="content">
                <img src="/${image.uploaded_image_url}" alt="Post Image" />
                <div class="overlay">${image.description}
                    <a href="/details/${image.image_id}">See more...</a>
                </div>
            </div>
        </div>`