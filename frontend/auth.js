// auth.js
import { setUserData, clearUserData } from './util.js';
import { post } from './api.js';

const endpoints = {
    login: '/signin',
    register: '/signup',
    logout: '/logout',
    catalog: '/dashboard',
};

export async function login({ email, password }) { // Destructure data parameter
    const userData = await post(endpoints.login, { email, password });
    setUserData(userData.data); // Store user data returned from API
}

export async function register({ email, password }) { // Destructure data parameter
    const userData = await post(endpoints.register, { email, password });
    setUserData(userData.data); // Store user data returned from API
}

export async function logout() {
    //await get(endpoints.logout); // Assuming you have a get function to handle logout
    clearUserData(); // Clear user data from local storage or wherever it's stored
}
