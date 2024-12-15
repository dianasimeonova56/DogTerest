import { get, post, patch, del } from './api.js'

const endpoints = {
    getPictures: '/get_pictures',
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
};

export async function getUsers() {
    const userData = await get(endpoints.getUsers);
    return userData.users;
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
    const picture = await get(endpoints.getPicturebyId + id);
    return picture;
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
    console.log(id, data);
    
    return get(endpoints.getUserLikes + `${id}/${data}`);
}

export async function likePicture(id, data) {
    const result = await post(endpoints.likePicture + id, data);
    return result;
}

export async function unlikePicture(id, data) {
    const result = await del(endpoints.unlikePicture + id, data);
    return result;
}