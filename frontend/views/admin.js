import { html, render } from '../../node_modules/lit-html/lit-html.js'
import { main } from '../app.js';
import { getUsers, updateUser } from '../auth.js';
import { createSubmitHandler } from '../util.js';

export const adminTemplate = (onUserClick, onDelete, onEdit, users) => html`
<section>
        <div class="form-container">
            <h1>Admin Panel</h1>
            <div class="users-info">
                <ul>
                ${users.map(user => html`<a class="user-admin-panel" @click=${() => onUserClick(user)}>${user.email}</a>`)}
                </ul>
            </div>
            <form>
                <input type="text" name="id" placeholder="ID" id="user_id" readonly>
                <input type="text" name="fullname" placeholder="First Name" id="firstname">
                <input type="text" name="fullname" placeholder="Last Name" id="lastname">
                <input type="text" name="email" placeholder="Email" id="email">
                <label for="cars">Role:</label>
                <select id="role" name="roles" size="2" >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                </select>
                <div class="button-group">
                    <button type="submit" @submit=${onEdit}>Edit</button>
                    <button type="submit" @submit=${onDelete}>Delete</button>
                </div>
            </form>
        </div>
    </section>
`

export async function adminPage() {
    const users = await getUsers();
    console.log(users);

    render(adminTemplate(onUserClick, onDelete, createSubmitHandler(onEdit), users), main)

    function onUserClick(user) {
        document.getElementById('user_id').value = user.user_id;
        document.getElementById('firstname').value = user.first_name || '';
        document.getElementById('lastname').value = user.last_name || '';
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.is_admin ? 'admin' : 'user';
    }

    async function onEdit(e) {
        debugger
        e.preventDefault();
        let is_admin = document.getElementById('role').value;
    is_admin = is_admin === 'user' ? 0 : 1;

    const first_name = document.getElementById('firstname').value;
    const last_name = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;

    const user = {
        first_name: first_name,
        last_name: last_name,
        email: email,
        is_admin: is_admin
    };

    try {
        await updateUser(user);
        page.redirect("/dashboard");
    } catch (error) {
        alert(error.message);
        console.log("Login error:", error);
    }
    }

    function onDelete(user) {
        //delete request
        //USERS array for now
        // USERS.splice(USERS.indexOf(user), 1);
        // render(adminTemplate(onUserClick, onDelete), main);
    }
}
