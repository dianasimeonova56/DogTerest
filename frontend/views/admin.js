import page from '../../node_modules/page/page.mjs';
import { html, render } from '../../node_modules/lit-html/lit-html.js'
import { main } from '../app.js';
import { deleteUser, getUsers, updateUser } from '../functions.js';

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
                <input type="text" name="first_name" placeholder="First Name" id="first_name">
                <input type="text" name="last_name" placeholder="Last Name" id="last_name">
                <input type="text" name="email" placeholder="Email" id="email">
                <label for="cars">Role:</label>
                <select id="role" name="roles" size="2" >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                </select>
            </form>
                <div class="button-group">
                    <button type="button" @click=${onEdit}>Edit</button>
                    <button type="button" @click=${onDelete}>Delete</button>
                </div>
        </div>
    </section>
`

export async function adminPage() {
    const users = await getUsers();
    console.log(users);

    render(adminTemplate(onUserClick, onDelete, onEdit, users), main)

    function onUserClick(user) {
        document.getElementById('user_id').value = user.user_id;
        document.getElementById('first_name').value = user.first_name || '';
        document.getElementById('last_name').value = user.last_name || '';
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.is_admin ? 'admin' : 'user';
    }

    async function onEdit(e) {
        debugger
        e.preventDefault();
        let is_admin = document.getElementById('role').value;
        is_admin = is_admin === 'user' ? 0 : 1;

        const user_id = document.getElementById('user_id').value
        const first_name = document.getElementById('first_name').value;
        const last_name = document.getElementById('last_name').value;
        const email = document.getElementById('email').value;

        const user = {
            user_id: user_id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            is_admin: is_admin 
        };

        try {
            await updateUser(user);
            alert('User updated successfully')
            
           // page.reload
        } catch (error) {
            alert(error.message);
            console.log("Login error:", error);
        }
    }

    async function onDelete() {
        const user_id = document.getElementById("user_id").value;
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser({"user_id": user_id});
                alert('User deleted successfully')
                page.reload();
            } catch (error) {
                alert(error.message);
                console.log("Login error:", error);
            }
        }
    }
}
