import { html, render } from '../../node_modules/lit-html/lit-html.js'
import { main } from '../app.js';
import { USERS } from './login.js'


export const adminTemplate = (onUserClick) => html`
<section>
        <div class="login-container">
            <h1>Admin Panel</h1>
            <div class="users-info">
                <ul>
                ${USERS.map(user => html`<a class="user-admin-panel" @click=${() => onUserClick(user)}>${user.email}</a>`)}
                </ul>
            </div>
            <form>
                <input type="text" name="fullname" placeholder="First Name" required id="firstname">
                <input type="text" name="fullname" placeholder="Last Name" required id="lastname">
                <input type="text" name="email" placeholder="Email" required id="email">
                <label for="cars">Role:</label>
                <select id="role" name="roles" size="2" >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                </select>
                <div class="button-group">
                    <button type="submit">Edit</button>
                    <button type="submit">Delete</button>
                </div>
            </form>
        </div>
    </section>
`

export function adminPage() {
    render(adminTemplate(onUserClick), main)

    function onUserClick(user) {
        document.getElementById('firstname').value = user.firstName || '';
        document.getElementById('lastname').value = user.lastName || ''; 
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role; 

    }
}
