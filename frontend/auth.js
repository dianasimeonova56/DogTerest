import { setUserData, clearUserData } from './util.js';
import { post } from './api.js';

const endpoints = {
    login: '/signin',
    register: '/signup',
};

export async function login({ email, password }) {
    const userData = await post(endpoints.login, { email, password });
    
    setUserData(userData.data);
}

export async function register(user) {
    await post(endpoints.register, user);
}

export function logout() {
    clearUserData();
}

