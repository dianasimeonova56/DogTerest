import page from '../node_modules/page/page.mjs';
import { render } from '../node_modules/lit-html/lit-html.js'
import { getUserData } from './util.js';
import { layoutTemplate } from './views/layout.js';
import { dashboardPage } from './views/dashboard.js';
import { loginPage } from './views/login.js';
import { signupPage } from './views/signup.js';
import { logout } from './auth.js';
import { adminPage } from './views/admin.js';
import { homePage } from './views/home.js';
import { detailsPage } from './views/details.js';
import { profilePage } from './views/profile.js';
import { currUserProfilePage } from './views/currentUserProfile.js';

export const main = document.querySelector('main')
const root = document.querySelector('header')

page(decorateContext)
page('/dashboard', dashboardPage);
page('/login', loginPage);
page('/signup', signupPage);
page('/logout', logoutAction);
page('/admin', adminPage);
page('/home', homePage);
page('/details/:id', detailsPage)
page('/current_user_profile', currUserProfilePage)
page('/profile/:id', profilePage);

page.start();

function decorateContext(ctx, next) {
    renderView();
    next();
}

function renderView() {
    const userData = getUserData();
    render(layoutTemplate(userData), root)
}

function logoutAction() {
    logout();
    page.redirect('/home');
}