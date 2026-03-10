const usernameElement = document.getElementById("username");
usernameElement.addEventListener("input", (e) => {isValidUsername(e.target.value)});

const passwordElement = document.getElementById("password");
passwordElement.addEventListener("input", (e) => {isStrongPassword(e.target.value)});

const passwordConfirmElement = document.getElementById("password-confirm");
passwordConfirmElement.addEventListener("input", (e) => {isPasswordMatch(passwordElement.value, e.target.value)});

const birthdateElement = document.getElementById("birth-date");
birthdateElement.addEventListener("input", (e) => {isValidBirthdate(e.target.value)});

const emailElement = document.getElementById("email");

const registrationForm  = document.getElementById("registration-form");
registrationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Current data:", getData());
    console.log("Form submitted");

    const username = usernameElement.value
    const password = passwordElement.value;
    const confirmPassword = passwordConfirmElement.value;
    const email = emailElement.value;
    const birthdate = birthdateElement.value;

    if (!isValidUsername(username)) return;
    if (!isStrongPassword(password)) return;
    if (!isPasswordMatch(password, confirmPassword)) return;
    if (!isValidBirthdate(birthdate)) return;

    const data = getData();

    if(data.users.find((user) => user.username === username)!=null) {
         document.getElementById("username-error").textContent = "This username is already taken";
        return;
    }

    
    if(data.users.find((user) => user.email === email)!=null) {
        document.getElementById("email-error").textContent = "This email is already in use";
        return;
    }

    const newUser = {
        id : "u" + Date.now(),
        username : username,
        email : email,
        password : password,
        birthdate : birthdate,
        bio : "",
        profilePic : null,
        followers : [],
        following : []
    }

    data.users.push(newUser);
    data.currentUserId = newUser.id;
    console.log("About to save:", data);
    saveData(data)
    window.location.href = "welcome.html";
})

function isValidUsername(username) {
    const usernameError = document.getElementById("username-error");
    if(!/^[a-zA-Z0-9._]{3,}$/.test(username)) {
      usernameError.textContent = "Username must be at least 3 characters, letters and numbers only"
      return false
    }
    usernameError.textContent = "";
    return true;
}

function isStrongPassword(password) {
    const passwordError = document.getElementById("password-error");
   if (password.length < 8) {
        passwordError.textContent = "Password must be at least 8 characters";
        return false;
    }
    if (!/[A-Z]/.test(password)) {
        passwordError.textContent = "Password must contain at least 1 uppercase letter";
        return false;
    }
    if (!/[a-z]/.test(password)) {
        passwordError.textContent = "Password must contain at least 1 lowercase letter";
        return false;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        passwordError.textContent = "Password must contain at least 1 special character";
        return false;
    }
    passwordError.textContent = "";
    return true;
}

function isPasswordMatch(p1, p2) {
    const passwordConfirmError = document.getElementById("password-confirm-error");
    if(p1!==p2) {
        passwordConfirmError.textContent = "Passwords do not match"
        return false;
    }
    passwordConfirmError.textContent = "";
    return true
}

function isValidBirthdate(date) {
    const birthdateError = document.getElementById("birth-date-error");
    if(new Date(date) > new Date()) {
      birthdateError.textContent = "Invalid birth date"
        return false;
    }
    birthdateError.textContent = "";
    return true
}