import { createSubmitHandler, setUserData } from '../util.js';
import { main } from '../app.js';
import { login } from '../auth.js'
import page from '../../node_modules/page/page.mjs';
import { html, render } from '../../node_modules/lit-html/lit-html.js'

export const USERS = [
    { "email": "a@b.c", "password": "12345796", "role": "user" },
    { "email": "d@e.c", "password": "adafra1", "role": "admin" },
    { "email": "f@a.c", "password": "aVEdzsv0", "role": "user" },
    { "email": "u@n.c", "password": "ihgmndgz4", "role": "admin" }
];

const loginTemplate = (onLogin) => html`
    <section>
        <div class="login-container">
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

export function loginPage(e) {
    render(loginTemplate(createSubmitHandler(onLogin)), main);
    e.preventDefault;

    async function onLogin(event) {
        // event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
    
        if (email === "" || password === "") {
            return alert("All fields are required");
        }
        
        const user = USERS.find(user => user.email === email && user.password === password);
        setUserData(user);
        page.redirect('/dashboard')
    //     try {
    //         await login({ email, password });
    //         page.redirect("/dashboard"); 
    //     } catch (error) {
    //         alert(error.message);
    //         console.log("Login error:", error);
    //     }
    // }
    }
}
