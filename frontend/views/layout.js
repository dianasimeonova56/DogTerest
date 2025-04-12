import { html } from '../../node_modules/lit-html/lit-html.js'
export const layoutTemplate = (userData) => html`
<nav>
<div class="logo">
    ${userData ? html `<a href="/dashboard">
        <img src="/imgs/yorkshire-terrier-dog-head-hand-drawn-c0475e.webp" alt="Logo" />
    </a>` : html`<a href="/home">
        <img src="/imgs/yorkshire-terrier-dog-head-hand-drawn-c0475e.webp" alt="Logo" />`
    }
</div>
<div>
<a href="/home">Home</a>
${userData
        ? html`
    <a href="/dashboard">Dashboard</a>
    <a href="/current_user_profile">Profile</a>
</div>
<div class="user">
    <a href="/logout">Logout</a>
    ${userData.is_admin === 1 ?
        html`<div class="admin"> <a href="/admin">Admin Panel</a>
        </div>
        <div class="admin"> <a href="/admin_dashboard">Admin Dashboard</a>
        </div>` : null}
`
        : html`
        <a href="/login">Login</a>
        <a href="/signup">Register</a>
`
    }
    </div>
</nav>`