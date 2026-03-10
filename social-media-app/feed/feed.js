if(getCurrentUser()===null) {
    window.location.href = "../auth/login.html";
}

const logoutButton = document.getElementById("logout-button");
logoutButton.addEventListener("click", () => {
    logout();
})