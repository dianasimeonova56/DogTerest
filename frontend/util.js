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

export function showToast(message, type = "success") { // ako nqma podaden tip -> da e success
    const toast = document.querySelector('.toast');
  
    toast.textContent = message;
  
    if (type === "error") toast.style.background = "#f44336";
  
    toast.style.display = "block";
    
    // setTimeout(() => {
    //   //toast.style.display = "none";
    //   toast.style.opacity-- 
    // }, 3000); // 3 seconds

    
    let opacity = 1;
    let stopF = true, requestId;
    let fadeOut = () => {
        if(stopF) {
            setTimeout(() => {
                if (opacity > 0) {
                opacity -= 0.1;
                toast.style.opacity = opacity;
                requestId = requestAnimationFrame(fadeOut);
            } else if (opacity <= 0) {
                stopF = false;
                }
            }, 1000/?);
        } else {
            cancelAnimationFrame(requestId);
                toast.style.display = 'none'; 
        }
        
    }
    fadeOut();
    //setTimeout(fadeOut(), 3000);

    
  }