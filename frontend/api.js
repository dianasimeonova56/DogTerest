// api.js
export async function post(url, data) {
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data), // Convert data to JSON
        });

        const responseData = await response.json(); // Avoid naming conflict

        if (response.ok) {
            // Return response data to the caller
            return responseData;
        } else {
            // Throw an error if the response is not OK
            throw new Error(responseData.error || "Login failed"); // Throw an error with the error message
        }
    } catch (error) {
        console.error("Network error:", error);
        throw new Error("Network error. Please try again later."); // Throw error for handling in the caller
    }
}


// import { getUserData, clearUserData } from "./util.js";

// const host = 'http://localhost:3030'

// async function request(method, url, data) {
//     const options ={
//         method,
//         headers: {}
//     };

//     const userData = getUserData();
//     if (userData) {
//         const token = userData.accessToken;
//         options.headers['X-Authorization'] = token
//     }

//     if(data!==undefined) {
//         options.headers['Content-Type'] = 'application/json';
//         options.body = JSON.stringify(data);
//     }

//     try {
//         const response = await fetch(host+url, options);

//         let result;
//         if(response.status != 204) {
//             result = await response.json();
//         };
//         if (response.ok == false) {
//             if(response.status == 403) {
//                 clearUserData();
//             }
//             const error = result;
//             throw error;
//         }

//         return result;

//     } catch (error) {
//         alert(error.message)
//         throw error;
//     }
// }

// export const get = request.bind(null, "get")
// export const post = request.bind(null, "post")
// export const put = request.bind(null, "put")
// export const del = request.bind(null, "delete")
