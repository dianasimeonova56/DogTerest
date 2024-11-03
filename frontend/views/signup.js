import page from '../../node_modules/page/page.mjs';
import { html, render } from '../../node_modules/lit-html/lit-html.js'
import { createSubmitHandler, setUserData } from '../util.js';
import { main } from '../app.js';
import { USERS } from './login.js';

const signupTemplate = (signup) => html`
    <section>
        <div class="login-container">
            <h1>Sign up</h1>
            <form @submit=${signup}>
                <input type="text" name="fullname" placeholder="First Name" required id="firstname">
                <input type="text" name="fullname" placeholder="Last Name" required id="lastname">
                <input type="text" name="email" placeholder="Email" required id="email">
                <input type="date" name="dateofbirth" placeholder="Date of Birth" required id="dob">
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
export function signupPage(e) {
    render(signupTemplate(createSubmitHandler(signup)), main)

    function signup({firstName, lastName, email, dob, password, rePass, pop, tac}) {
        
        // let user = window.localStorage.getItem('user');
        // if (!user) {
        //     user = {
        //         "firstName": undefined,
        //         "lastName": undefined,
        //         "email": undefined,
        //         "password": undefined,
        //         "dob": undefined
        //     }
        // } else {
        //     user = JSON.parse(user);
        // }
        
        // const password = document.getElementById('password');
        // const confirmPassword = document.getElementById('confirm_password');
        if (password.value == "" || (password.value != rePass.value)) {
            return alert("passwords are different");
        }
        // if (!tac.checked) {
        //     debugger
        //     return alert("terms policies must be agreed upon");
        // }
        // if (!pop.checked) {
        //     return alert("privacy policies must be agreed upon");
        // }
        const user = { "email": email, "password": password, "role": "user", "dateOfBirth": dob }
        
        // console.log("user" + user.attributes.firstName);
        
        // setUserData(user);
        USERS.push(user);
        page.redirect('/login')
    }
}


// const form = document.querySelector('form');
// const button = document.querySelector('button').addEventListener('click', signup);

// function stopFormDefault(event) {
//     event.preventDefault();
//     // actual logic, e.g. validate the form
//     console.log('Form submission cancelled.');
// }