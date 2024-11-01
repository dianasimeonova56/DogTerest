let user = window.localStorage.getItem('user');
if (!user) {
    user = {
        firstName: undefined,
        lastName: undefined,
        email: undefined,
        password: undefined,
        dob: undefined
    }
} else {
    user = JSON.parse(user);
}
function signup() {
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirm_password');
    if (password.value == "" || (password.value != confirmPassword.value)) {
        console.log("passwords are different");
        return;
    }

    const terms = document.getElementById('terms');
    if (!terms.checked) {
        console.log("terms policies must be agreed upon");
        return;
    }
    const privacy = document.getElementById('privacy');
    if (!privacy.checked) {
        console.log("privacy policies must be agreed upon");
        return;
    }

    user.firstName = document.getElementById('firstname').value;
    user.lastName = document.getElementById('lastname').value;
    user.email = document.getElementById('email').value;

    const dob = document.getElementById('dob');
    user.dob = dob.value;
    console.log("user" + user);
    window.localStorage.setItem('user', JSON.stringify(user));
    window.location.replace("index.html");
}
const form = document.querySelector('form');
form.addEventListener('submit', stopFormDefault);
debugger
const button = document.querySelector('button').addEventListener('click', signup);

function stopFormDefault(event) {
    event.preventDefault();
    // actual logic, e.g. validate the form
    console.log('Form submission cancelled.');
}