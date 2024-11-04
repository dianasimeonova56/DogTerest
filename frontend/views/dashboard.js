import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';

// Dashboard template
export const dashboardTemplate = (onClick) => html`
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
        <div id="add" class="content circle-plus" @click=${onClick}>
        </div>
    </div>

    <div id="overlay-form" class="overlay-form" style="display: none;">
        <div class="modal">
            <span id="closeModal" class="close">&times;</span>
            <h2 class="login-cointainer">Add a Picture</h2>
            <form id="uploadForm" class="login-container">
                <input type="file" accept="image/*" required>
                <label>Add a Description</label>
                <input type="text" required name="description">
                <button type="submit">Upload</button>
            </form>
        </div>
    </div>
</section>
`;

export function dashboardPage() {
    render(dashboardTemplate(onClick), main);

    function onClick() {
        document.getElementById('overlay-form').style.display = 'flex';
        
        document.getElementById('closeModal').onclick = function() {
            document.getElementById('overlay-form').style.display = 'none';
        };

        document.getElementById('uploadForm').onsubmit = function(event) {
            event.preventDefault();
            debugger;
            const form = event.target;
            const fileInput = form.querySelector('input[type="file"]');
            const file = fileInput.files[0];
            const description = form.querySelector('input[name="description"]');

            if (file) {
                alert(`Picture uploaded: ${file.name}`);
                
                const newImageItem = document.createElement('div');
                newImageItem.className = 'item';
                newImageItem.innerHTML = `
                    <div class="content">
                        <img src="${URL.createObjectURL(file)}" alt="${file.name}" />
                        <div class="overlay">${description.value}</div>
                    </div>
                `;
                
                document.querySelector('#dashboard').insertBefore(newImageItem, document.getElementById('add').parentNode);
                
                document.getElementById('overlay-form').style.display = 'none';
                fileInput.value = null;
                description.value = null;
            }
        };
    }
}
