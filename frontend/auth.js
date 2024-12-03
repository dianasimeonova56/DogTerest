// auth.js
import { setUserData, clearUserData } from './util.js';
import { post, get, patch } from './api.js';

const endpoints = {
    login: '/signin',
    register: '/signup',
    logout: '/logout',
    catalog: '/dashboard',
    getUsers: '/get_users',
    updateUser: '/update_user'
};

export async function login({ email, password }) {
    const userData = await post(endpoints.login, { email, password });
    setUserData(userData.data);
}

export async function register(user) {
    const userData = await post(endpoints.register, user);
    setUserData(userData.data);
}

export async function logout() {
    clearUserData();
}

export async function getUsers() {
    const userData = await get(endpoints.getUsers);
    return userData.users;
}

export async function updateUser(data) {
    return await patch(endpoints.updateUser, data);
}
