import { html } from '../../node_modules/lit-html/lit-html.js'

export const imageTemplatle = (image) => html`
<div class="item">
            <div class="content">
                <img src="/frontend/imgs/marki.png" alt="Post Image" />
                <div class="overlay">I am Markie :3</div>
            </div>
        </div>`


export const resultImageTemplate = (image) => html`
<div class="fruit">
  <img src="${image.imageUrl}" alt="example1" />
  <h3 class="title">${image.name}</h3>
  <p class="description">${image.description}</p>
  <a class="details-btn" href="/details/${image._id}">More Info</a>
    </div>
`