import { createSubmitHandler, setUserData } from '../util.js';
import { main } from '../app.js';
import { login } from '../auth.js'
import page from '../../node_modules/page/page.mjs';
import { html, render } from '../../node_modules/lit-html/lit-html.js'

const loginTemplate = (onLogin) => html`
    <section>
        <div class="form-container">
            <h1>Login</h1>
            <form @submit=${onLogin}>
                <input type="text" placeholder="Username" required id="email">
                <input type="password" placeholder="Password" required id="password">
                <button type="submit">Log In</button>
            </form>
            <p>Don't have an account? <a href="./signup">Sign up</a></p>
        </div>
    </section>
`;

export function loginPage() {
    render(loginTemplate(createSubmitHandler(onLogin)), main);
    //e.preventDefault;

    async function onLogin(event) {
        // event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        if (email === "" || password === "") {
            return alert("All fields are required");
        }
        try {
            await login({ email, password });
            page.redirect("/dashboard");
        } catch (error) {
            alert(error.message);
            console.log("Login error:", error);
        }
    }
}

