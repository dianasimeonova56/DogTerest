const itemName = "userData";

export function getUserData() {
    return JSON.parse(localStorage.getItem(itemName))
}

export function setUserData(data) {
    console.log(data);
    return localStorage.setItem(itemName, JSON.stringify(data))
}


export function clearUserData() {
    localStorage.removeItem(itemName)
}

export function createSubmitHandler(callback) {
    debugger
    return function (event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        callback(data, form);
    }
}

const toast = document.querySelector('.toast');
export function showToast(message, type = "success") { // ako nqma podaden tip -> da e success
    toast.style.display = 'block';
    toast.classList.add('show');

    toast.textContent = message;
  
    if (type === "error") toast.style.background = "#f44336";
  
    setTimeout(() => {
    toast.classList.remove('show');
    toast.style.display = 'none'; // Hide it completely after the animation
  }, 4000); // 4000ms to match the animation duration
}
