import { get, post, patch, del } from './api.js'

const endpoints = {
    getPictures: '/get_pictures',
    getUser: '/get_user/',
    getUserPictures: '/get_user_pictures/',
    updateUser: '/update_user',
    deleteUser: '/delete_user',
    uploadPicture: '/upload_picture',
    getUsers: '/get_users',
    getPicturebyId: '/get_picture_by_id/',
    editPicture: '/edit_picture/',
    deletePicture: '/delete_picture/',
    likePicture: '/like_picture/',
    getLikes: '/get_likes/',
    getUserLikes: '/get_user_likes/',
    unlikePicture: '/unlike_picture/',
    addFavourite: '/add_to_favs/',
    removeFromFavs: '/remove_from_favs/',
    getFavPictures: '/get_favs/',
    getUserFavPictures: '/get_user_favs/',
    getAdminDashboardData: '/admin_dashboard_data',
};

export async function getUsers() {
    const userData = await get(endpoints.getUsers);
    return userData.users;
}

export async function getUser(id) {
    return await get(endpoints.getUser + id);
}

export async function getUserPictures(id) {
    return await get(endpoints.getUserPictures + id);
}

export async function getPictures() {
    const pictures = await get(endpoints.getPictures);
    return pictures.images;
}

export async function updateUser(user) {
    const result = await patch(endpoints.updateUser, user);
    return result;
}

export async function deleteUser(id) {
    return await del(endpoints.deleteUser, id);
}

export async function uploadPicture(data) {
    return await post(endpoints.uploadPicture, data)
}

export async function getPictureById(id) {
    return await get(endpoints.getPicturebyId + id);
}

export async function editPicture(id, data) {
    const result = await patch(endpoints.editPicture + id, data);
    return result;
}

export async function deletePicture(id) {
    return await del(endpoints.deletePicture + id);
}

export async function getLikes(id) {
    return get(endpoints.getLikes + id);
}

export async function getUserLikes(id, data) {
    return get(endpoints.getUserLikes + `${id}/${data}`);
}

export async function likePicture(id, userId) {
    const result = await post(endpoints.likePicture + id, {user_id: userId});
    return result;
}

export async function unlikePicture(id, userId) {
    const result = await del(endpoints.unlikePicture + id, {user_id: userId});
    return result;
}

export async function addToFavourites(id, userId) {
    return await post(endpoints.addFavourite + id, {user_id: userId});
}

export async function removeFromFavourites(id, userId) {
    return await del(endpoints.removeFromFavs + id, {user_id: userId});
}

export async function getFavPictures(id) {
    console.log(endpoints.getFavPictures + id);
    
    return get(endpoints.getFavPictures + id);
}

export async function getUserFavPictures(id, data) {
    console.log(id, data);
    return get(endpoints.getUserFavPictures + `${id}/${data}`);
}

export async function getAdminDashboardData() {
    return get(endpoints.getAdminDashboardData);
}
