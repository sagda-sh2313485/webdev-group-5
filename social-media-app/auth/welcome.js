const profilePhotoButton = document.getElementById("set-profile-photo");
const profilePhotoInput = document.getElementById("profile-photo-input") 
const profilePhoto = document.getElementById("profile-photo");

const usernameElement = document.getElementById("logged-username");
usernameElement.textContent = getCurrentUser().username;

const allSetButton = document.getElementById("allset-button");
allSetButton.addEventListener(("click"), () => {
    window.location.href = "../feed/feed.html";
})

profilePhotoButton.addEventListener("click", (e) => profilePhotoInput.click());
profilePhotoInput.addEventListener("change", (e) => setNewImage(e.target.files[0]));


function setNewImage(photo) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
        const user = getCurrentUser();
        user.profilePic = reader.result;
        const data = getData();
        const index = data.users.findIndex((u)=> u.id === user.id);
        data.users[index] = user;
        saveData(data);
        profilePhoto.src = reader.result;
    });
    reader.readAsDataURL(photo);
}