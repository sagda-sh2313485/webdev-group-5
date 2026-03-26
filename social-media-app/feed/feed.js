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
    renderPosts();
    attachLikeEvents();

function renderPosts() {
    const freshData = getData();
    const postsToShow = getpostsToShow(currentUser, freshData.posts);
    const newerPosts = [...postsToShow].sort((p1, p2) => p2.timestamp - p1.timestamp);

    const postCardsSection = document.getElementById('posts-feed');
    const postsHtml = newerPosts.map(p => {
        const username = getUserNameFromPost(p, freshData.users);
        const profilePic = getProfilePicFromPost(p, freshData.users);
        return toPostHtml(p, username, profilePic);
    });

    postCardsSection.innerHTML = postsHtml.join('');
}


function attachLikeEvents() {
    const appData = getData();
    
    appData.posts.forEach(p => {
        const btn = document.getElementById(`like-${p.id}`);

        if (!btn) return;
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleLike2(p.id, currentUser.id); //asmas job
            renderPosts();
        });
    });
}
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
}

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
    // renderPosts()
    // attachLikeEvents();
    // attachCommentEvents();
    // attachPostCardEvents();
}