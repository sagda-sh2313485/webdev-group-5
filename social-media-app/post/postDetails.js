const currentUser = getCurrentUser();

if (!currentUser) {
    window.location.href = "../auth/login.html";
}

const postContainer = document.getElementById("post-container");
const commentsContainer = document.getElementById("comments-container");
const commentInput = document.getElementById("comment-input");
const commentBtn = document.getElementById("comment-btn");

renderSinglePostPage();

commentBtn.addEventListener("click", () => {
    const postId = localStorage.getItem("selectedPostId");
    const content = commentInput.value.trim();

    if (!postId || !content) return;

    addComment(postId, currentUser.id, content);
    commentInput.value = "";
    renderSinglePostPage();
});

function renderSinglePostPage() {
    const data = getData(); //these lines are to get the data stored in storage and the selected post id
    const postId = localStorage.getItem("selectedPostId");

    if (!postId) { //this is to handle errors and if no post is selected. 
        postContainer.innerHTML = `<p>No post selected.</p>`;
        commentsContainer.innerHTML = "";
        return;
    }

    const post = data.posts.find(p => p.id === postId); //this is to ind selected post + its user

    if (!post) {
        postContainer.innerHTML = `<p>Post not found.</p>`;
        commentsContainer.innerHTML = "";
        return; //here we are also handling if no post was found. 
    }

    const author = getUser(post.authorId, data.users);
    const username = author ? author.username : "Unknown User";
    const profilePic = author ? author.profilePic : null;

    const likeCount = post.likes.length; //these variables are to keep count of how many likes, how many comments. 
    const isLiked = post.likes.includes(currentUser.id);
    const commentCount = data.comments.filter(c => c.postId === post.id).length;
    const imgSrc = fixPfp(profilePic);
    const timeP = formatTimeAgo(post.timestamp);

    const postImageHtml = post.postImg
        ? `<img src="${fixPfp(post.postImg)}" alt="post image" class="post-image">`
        : "";

    postContainer.innerHTML = ` 
        <article class="post-card" data-id="${post.id}">
            <div class="post-header">
                <div class="post-user-info">
                    <img src="${imgSrc}" alt="profile" class="post-avatar">
                    <div class="post-meta">
                        <h3 class="post-name">${username}</h3>
                        <p class="post-time">${timeP}</p>
                    </div>
                </div>
            </div>

            <div class="post-body">
                <p class="post-text">${post.content}</p>
                ${postImageHtml}
            </div>

            <div class="post-actions">
                <button class="action-btn like-btn ${isLiked ? "liked" : ""}" id="single-like-btn">
                    <i class="fa-${isLiked ? "solid" : "regular"} fa-heart"></i>
                    <span class="like-count">${likeCount}</span>
                </button>

                <button class="action-btn comment-btn" disabled>
                    <i class="fa-regular fa-comment"></i>
                    <span class="comment-count">${commentCount}</span>
                </button>
            </div>
        </article>
    `; //This is for building and displaying the selected post using real user data. 

    const comments = data.comments
        .filter(c => c.postId === post.id) //this function will get only the comments for the selected post. 
        .sort((a, b) => a.timestamp - b.timestamp);

    if (comments.length === 0) {
        commentsContainer.innerHTML = `<p>No comments yet.</p>`;
    } else {
        commentsContainer.innerHTML = comments.map(comment => { //here we are displaying each comment, including all its details. 
            const commentAuthor = getUser(comment.authorId, data.users);
            const commentName = commentAuthor ? commentAuthor.username : "Unknown User";
            const commentPic = commentAuthor ? commentAuthor.profilePic : null;

            return `
                <article class="comment-card" data-id="${comment.id}">
                    <div class="comment-header">
                        <div class="comment-user-info">
                            <img src="${fixPfp(commentPic)}" alt="profile" class="comment-avatar">
                            <div class="comment-meta">
                                <h3 class="comment-name">${commentName}</h3>
                                <p class="comment-time">${formatTimeAgo(comment.timestamp)}</p>
                            </div>
                        </div>

                        ${comment.authorId === currentUser.id ? `
                            <button class="delete-comment-btn" data-id="${comment.id}">
                                <i class="fa-regular fa-trash-can"></i>
                            </button>
                        ` : ""}
                    </div>
                    <p class="comment-text">${comment.content}</p>
                </article>
            `;
        }).join("");
    }

    const deleteCommentButtons = document.querySelectorAll(".delete-comment-btn");
    //Here we are making the delete button work to delete the comment if the user wants. 
    deleteCommentButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const commentId = btn.dataset.id;
            deleteComment(commentId);
            renderSinglePostPage();
        });
    });

    const likeBtn = document.getElementById("single-like-btn");
    likeBtn.addEventListener("click", () => {
        toggleLike(post.id, currentUser.id);
        renderSinglePostPage();
    });
}

function toggleLike(postId, userId) {
    const data = getData();
    const post = data.posts.find(p => p.id === postId);
    if (!post) return;

    if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id !== userId);
    } else {
        post.likes.push(userId);
    }

    saveData(data);
}

function addComment(postId, userId, content) { //This function is to allow user to add a comment
    const data = getData();

    const newComment = {
        id: "C" + Date.now(),
        postId: postId,
        authorId: userId, //show the comment details the user posted.
        content: content,
        timestamp: Date.now()
    };

    data.comments.push(newComment);
    saveData(data);
}

function deleteComment(commentId) { //This function is for deleting posts wrritten by current user
    const data = getData();
    const comment = data.comments.find(c => c.id === commentId);

    if (!comment) return;

    if (comment.authorId !== currentUser.id) {
        console.warn("Unauthorized delete attempt"); //to prevent deleting a comment that doesn't belong to the current user
        return;
    }

    data.comments = data.comments.filter(c => c.id !== commentId);
    saveData(data);
}