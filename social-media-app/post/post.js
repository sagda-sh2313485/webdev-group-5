
if(currentUser===null) {
    window.location.href = "../auth/login.html";
}else{


    //creating post
    const textInput = document.getElementById("mind-input");
    const post_btn = document.getElementById('post-btn');
    const imageIcon = document.getElementById("image-icon");
    const imageUpload = document.getElementById("imageUpload");
    const preview = document.getElementById("post-preview");
    //when i click on the imageIcon i can select a file 
    imageIcon.addEventListener("click", () => {
        imageUpload.click();
    });

    let selectedPostImage = null;

    imageUpload.addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            selectedPostImage = reader.result;
            preview.src = fixPfp(selectedPostImage);
            preview.style.display = "block";
        };

        reader.readAsDataURL(file);
    });


    post_btn.addEventListener('click' ,() =>{
        const content = textInput.value.trim();
        if (!content && !selectedPostImage) return;
        const newPost = createPost(content,currentUser,selectedPostImage)
        appData.posts.push(newPost);
        saveData(appData);
        textInput.value = '';
        selectedPostImage = null;
        imageUpload.value = '';
        preview.src = "";
        preview.style.display = "none";
        renderPosts()
        }
    )

  
    //deleting post
    const feed = document.getElementById("posts-feed");
    feed.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".delete-btn");
        if (!deleteBtn) return;
        const postCard = e.target.closest(".post-card");
        const postId = postCard.dataset.id;
        deletePost(postId);
        renderPosts();
    });
}

function createPost(content, user,pfp) {
    return {
        id: "P" + Date.now(),
        authorId: user.id,
        content: content,
        timestamp: Date.now(),
        likes: [],
        postImg: pfp
    };
}
function deletePost(postId) {
    const post = appData.posts.find(p => p.id === postId);
    if (!post) return;
    // Only allow owner to delete
    if (post.authorId !== currentUser.id) {
        console.warn("Unauthorized delete attempt");
        return;
    }
    appData.posts = appData.posts.filter(p => p.id !== postId);
    saveData(appData);
}

//Like/unlike a post function toggleLike(p.id, currentUser.id) {} // if the user had already liked the post remove the like from the like list in posts post.likes.splice() if the user hadnt like the post before just add the the like(add user to like[] in post.likes) //dont forget to call saveDate(appDate after)
// each post has the like btn with like-post id(post id Is teh actual post id ) comment btn wth id comment-posdID
//comment on a post

//

const postId = localStorage.getItem("selectedPostId"); // this is how u get the post ID 
function toggleLike(postId, userId) {
   
}
function addComment(postId, userId, content) {
    
}