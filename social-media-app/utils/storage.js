const startup_data =  {
    users: [],
    posts: [],
    comments: [],
    currentUserId: 'u1'
};

function getData() {
    try {
        const jsonData = localStorage.getItem("appData");
        if(!jsonData) {
            saveData(startup_data);
            console.log("Storage has been initialized");
            return startup_data;
        }
        const data = JSON.parse(jsonData);
        return data;
    }
    catch(e) {
        console.error(`Error reading from local storage: ${e}`);
        return startup_data;
    }
}

function saveData(data) {
    console.trace("saveData called with:", JSON.stringify(data));
    try {
        const jsonString = JSON.stringify(data);
        localStorage.setItem("appData", jsonString);
    }
    catch(e) {
        console.error(`Error while saving to local storage: ${e}`);
    }
}

function getCurrentUser() {
    const data = getData();
    const id = data.currentUserId;
    if(id==null) {
        return null;
    }
    return data.users.find((user)=> user.id === id) ?? null;
}

function logout() {
    const data = getData();
    data.currentUserId = null;
    saveData(data);
    window.location.href = "../auth/login.html";
}
