import { html } from '../../node_modules/lit-html/lit-html.js'
import { USERS } from './login.js'

export const layoutTemplate = (userData) => html`
<nav>
<div class="logo">
    <a href="/dashboard">
        <img src="./imgs/yorkshire-terrier-dog-head-hand-drawn-c0475e.webp" alt="Logo" />
    </a>
</div>

${userData
        ? html`
    <div>
    <a href="/dashboard">Dashboard</a>
</div>
<div class="user">
    <!-- <a href="/create">Add Picture</a> -->
    <a href="/logout">Logout</a>
    
    ${userData.role === "admin" ?
        html`<div class="admin"> <a href="/admin">Admin Panel</a>
        </div>` : null}

    </div>`
        : html`<div class="guest">
    <a href="/login">Login</a>
    <a href="/signup">Register</a>
</div>`
    }
</nav>`