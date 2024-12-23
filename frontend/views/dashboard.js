import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { getPictures, uploadPicture } from '../functions.js';
import { imageTemplate } from '../constants/imageTemplate.js';
import { getUserData } from '../util.js';

export const dashboardTemplate = (pictures, onClick, onUpload) => html`
<section id="dashboard">
    ${pictures.length > 0 
        ? pictures.map(imgs => imageTemplate(imgs))
        : html`<p>No pictures found. Click the + button to add a new one.</p>`}
   
    <div class="item">
        <div id="add" class="content circle-plus" @click=${onClick}>
        </div>
    </div>

    <div id="overlay-form" class="overlay-form" style="display: none;">
        <div class="modal">
        <span id="closeModal" class="close" role="button" tabindex="0">&times;</span>
            <h2 class="form-cointainer">Add a Picture</h2>
            <form id="uploadForm" class="form-container" onsubmit="return false;" action="javascript:void(0);">
                <input type="file" accept="image/*" required id="fileInput">
                <label>Add a Description</label>
                <input type="text" required name="description" id="description">
                <button type="button" @click=${onUpload}>Upload</button>
            </form>
        </div>
    </div>
</section>
`;

export async function dashboardPage() {
    let pictures = [];
    try {
        pictures = await getPictures();
    } catch (e) {
        console.error(e);
        alert(e);
    }
    console.log(pictures);
    
    render(dashboardTemplate(pictures, onClick, onUpload), main);
    
    function onClick(e) {
        document.getElementById('overlay-form').style.display = 'flex';
        console.log('Form overlay is displayed.');

        document.getElementById('closeModal').onclick = function (e) {
            e.stopPropagation(); 
            document.getElementById('overlay-form').style.display = 'none';
        };
    }

    async function onUpload(e) {
        debugger
        e.preventDefault();
        const user = getUserData();

        const fileInput = document.getElementById("fileInput");
        const file = fileInput.files[0];
        const description = document.getElementById("description").value;

        if (!file) {
            alert('Please select a file before uploading.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('description', description);
        formData.append('user_id', user.user_id);

        try {
            await uploadPicture(formData);
            
            const newImageItem = document.createElement('div');
            newImageItem.className = 'item';
            newImageItem.innerHTML = `
                <div class="content">
                    <img src="${URL.createObjectURL(file)}" alt="${file.name}" />
                    <div class="overlay">${description}</div>
                </div>
            `;

            document.querySelector('#dashboard').insertBefore(
                newImageItem,
                document.getElementById('add').parentNode
            );

            document.getElementById('overlay-form').style.display = 'none';
        } catch (error) {
            console.error('Upload failed:', error);
            alert(error);
        }
    }
}
