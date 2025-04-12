// auth.js
import { setUserData, clearUserData } from './util.js';
import { post } from './api.js';

const endpoints = {
    login: '/signin',
    register: '/signup',
    logout: '/logout',
    catalog: '/dashboard',
    // details: (id) => `/catalog/${id}`
};

export async function login({ email, password }) {
    const userData = await post(endpoints.login, { email, password });
    
    setUserData(userData.data);
}

export async function register(user) {
    const userData = await post(endpoints.register, user);
    // setUserData(userData.data);
}

export async function logout() {
    clearUserData();
}

