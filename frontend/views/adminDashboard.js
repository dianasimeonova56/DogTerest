import page from '../../node_modules/page/page.mjs';
import { html, render } from '../../node_modules/lit-html/lit-html.js'
import { main } from '../app.js';
import { getAdminDashboardData } from '../functions.js';
import { imageTemplate } from '../constants/imageTemplate.js';

export const adminDashboradTemplate = (imageCount, userCount, images, users, events) => html`
<section class="dashboard-page">
    <h1>Admin Dashboard</h1>
    <div class="dashboard-stats-container">
        <div class="stat-box">
            <h2>Total Images</h2>
            <p id="image-count">${imageCount}</p>
        </div>
        <div class="stat-box">
            <h2>Total Users</h2>
            <p id="user-count">${userCount}</p>
        </div>
    </div>

    <div class="dashboard-content">
        <div class="last-pictures">
            <h2>Last Pictures Added</h2>
            <div class="image-list">
            ${images.length > 0 
                ? images.map(imgs => imageTemplate(imgs)) 
                : html`<p>No pictures found.</p>`}
            </div>
        </div>

        <div class="users-wrapper">
            <div class="last-users">
                <h2>Last Events Registered</h2>
                ${events.length > 0 
                    ? events.map(e => html`<p>${e.user_first_name} ${e.user_last_name} (${e.user_id}) ${e.event_name} on ${e.created_at}</p>`) 
                    : html`<p>No events found.</p>`}
            </div>
            <div class="last-users">
                <h2>Last Users Created</h2>
                ${users.length > 0 
                    ? users.map(user => html`<p>${user.first_name} ${user.last_name} registered on ${user.created_at}</p>`) 
                    : html`<p>No users found.</p>`}
            </div>
        </div>
    </div>
</section>
`

export async function adminDashboardPage() {
    let data;
    let imageCount = 0;
    let userCount = 0;
    let images = [];
    let users = [];
    let events = [];
    
    try {
        data = await getAdminDashboardData();
        images = data.last_pictures;
        users = data.last_users;
        events = data.events;
        console.log(events);
        imageCount = data.images_count;
        userCount = data.users_count;
    } catch (e) {
        alert(e.message);
        console.log("Error: " + e.message);
    }
    render(adminDashboradTemplate(imageCount, userCount, images, users, events), main);
}
