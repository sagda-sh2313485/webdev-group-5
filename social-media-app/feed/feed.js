const appData = getData();
const currentUser = getCurrentUser();

if (currentUser === null) {
    window.location.href = "../auth/login.html";
} else {
    const pfp = document.getElementById('pfp')
    const imgSrc = fixPfp(currentUser.profilePic)
    pfp.src = imgSrc;
    const mindInput = document.getElementById("mind-input");
    mindInput.placeholder = `What's on your mind, ${currentUser.username}?`;
    renderPosts()

function renderPosts(){
    const posttoShow = getpostsToShow(currentUser,appData.posts)
    const newerPosts = posttoShow.sort((p1,p2) => p2.timestamp - p1.timestamp ); // sort posts in decending timestamp order so newer posts show first

    // know which part of the code are we addding the card to (the container)
    const postCardsSection = document.getElementById('posts-feed');
    const postsHtml = newerPosts.map(p =>{
        const username = getUserNameFromPost(p,appData.users)
        const profilePic = getProfilePicFromPost(p,appData.users)
        return toPostHtml(p,username,profilePic)});

    postCardsSection.innerHTML = postsHtml.join('');
}


function attachLikeEvents() {
    const appData = getData();
    const freshCurrentUser = getCurrentUser();

    appData.posts.forEach(p => {
        const btn = document.getElementById(`like-${p.id}`);
        if (!btn) return;

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleLike(p.id, freshCurrentUser.id);//asmas job
            refreshFeed();
        });
    });
}

function attachCommentEvents() {
    const appData = getData();

    appData.posts.forEach(p => {
        const btn = document.getElementById(`comment-${p.id}`);
        if (!btn) return;

        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            // post page basically
            localStorage.setItem("selectedPostId", p.id);
            window.location.href = `post.html`;;
        });
    });
}}

function attachPostCardEvents() {
    const appData = getData();

    appData.posts.forEach(p => {
        const postCard = document.getElementById(`post-${p.id}`);
        if (!postCard) return;

        postCard.addEventListener("click", () => {
            localStorage.setItem("selectedPostId", p.id);
            window.location.href = `post.html`;
        });
    });
}

function refreshFeed() {
    //renderPosts() un comment after eveythign good 
    //attachLikeEvents();
    //attachCommentEvents();
    //attachPostCardEvents();
}