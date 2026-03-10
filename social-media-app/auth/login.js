const usernameElement = document.getElementById("username");
const passwordElement = document.getElementById("password");

const authenticationError = document.getElementById("authentication-error");

let errorTimeout;

const loginButton = document.getElementById("login-button");
loginButton.addEventListener("click", () => {
    if(usernameElement.value==="" || passwordElement.value==="") {authenticationError.textContent = "Enter a username and password";  clearTimeout(errorTimeout); errorTimeout = setTimeout(() => {authenticationError.textContent = ""}, 3000); return;}
    authenticationError.textContent = "";
    if(authenticate(usernameElement.value, passwordElement.value)) {
        window.location.href = "../feed/feed.html";
    }
});

function authenticate(username, password) {
    const data = getData();
    const user = data.users.find((user)=> user.username === username && user.password === password);
    if(!user) {
        authenticationError.textContent = "Username and Password do not match!";
        clearTimeout(errorTimeout);
        errorTimeout = setTimeout(() => {authenticationError.textContent = ""}, 3000);
        return false;; 
    }
    authenticationError.textContent = "";
    data.currentUserId = user.id;
    saveData(data);
    return true;
}