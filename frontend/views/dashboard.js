import { html, render } from '../../node_modules/lit-html/lit-html.js';
import { main } from '../app.js';
import { getPictures, uploadPicture } from '../functions.js';
import { imageTemplate } from '../constants/imageTemplate.js';
import { getUserData, showToast } from '../util.js';

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
    let userData = await getUserData();
    
    let pictures = [];
    try {
        pictures = await getPictures();
    } catch (e) {
        console.error(e);
        alert(e);
    }
    console.log(pictures);
    
    render(dashboardTemplate(pictures, onClick, onUpload, userData), main);
    
    function onClick(e) {
        document.getElementById('overlay-form').style.display = 'flex';
        console.log('Form overlay is displayed.');

        document.getElementById('closeModal').onclick = function (e) {
            e.stopPropagation(); 
            document.getElementById('overlay-form').style.display = 'none';
        };
    }

    async function onUpload(e) {
        e.preventDefault();
        // const user = getUserData();

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
        formData.append('user_id', userData.user_id);
        

        try {
            await uploadPicture(formData);
            let lastPic = await getPictures();	
            let image_id = lastPic[lastPic.length - 1].image_id;
            
            const newImageItem = document.createElement('div');
            newImageItem.className = 'item';
            newImageItem.innerHTML = `
                <div class="content">
                    <img src="${URL.createObjectURL(file)}" alt="${file.name}" />
                    <div class="overlay">${description}
                    <a href="/details/${image_id}">See more...</a></div>
                    
                </div>
            `;

            document.querySelector('#dashboard').insertBefore(
                newImageItem,
                document.getElementById('add').parentNode
            );

            document.getElementById('overlay-form').style.display = 'none';
            fileInput.value = '';
            description = '';

            showToast("Picture added successfully", "success");
        } catch (error) {
            showToast("Picture wasn't added successfully", "error");
            console.error('Upload failed:', error);
            //alert(error);
        }
    }
}
