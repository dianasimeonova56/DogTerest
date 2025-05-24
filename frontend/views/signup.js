import page from '../../node_modules/page/page.mjs';
import { html, render } from '../../node_modules/lit-html/lit-html.js'
import { createSubmitHandler, showToast } from '../util.js';
import { main } from '../app.js';
import { register } from '../auth.js';

const signupTemplate = (signup) => html`
    <section>
        <div class="form-container">
            <h1>Sign up</h1>
            <form @submit=${onSignup}>
                <input type="text" name="firstName" placeholder="First Name" required id="firstName">
                <input type="text" name="lastName" placeholder="Last Name" required id="lastName">
                <input type="text" name="email" placeholder="Email" required id="email">
                <input type="password" name="password" placeholder="Password" required id="password">
                <input type="password" name="rePass" placeholder="Repeat Password" required id="confirm_password">
                <div><input type="checkbox" name="pop" required id="privacy">I agree with the privacy policy</div>
                <div><input type="checkbox" name="tac" required id="terms">I agree with the terms and conditions</div>
                <button type="submit" value="Sign Up">Submit</button>
            </form>
            <div>If you already have an account, <a href="./login">sign in</a>.</div>
        </div>
    </section>
`
export function signupPage() {
    render(signupTemplate(createSubmitHandler(onSignup)), main)

    async function onSignup({firstName, lastName, email, password, rePass, pop, tac}) {
        if (password == "" || (password != rePass)) {
            return alert("passwords are different");
        }
        if (!tac) {
            return alert("terms policies must be agreed upon");
        }
        if (!pop) {
            return alert("privacy policies must be agreed upon");
        }
        const user = { "email": email, "password": password, "firstname": firstName, "lastname": lastName}
        
        try {
            await register(user);
            showToast("Registration successful", "success");
            page.redirect("/login");
        } catch (error) {
            showToast(error.message, "error");
            console.log("Login error:", error);
        }
    }
}