function toPostHtml(p, username, profilePic) {
    const appData = getData();

    const likeCount = p.likes.length;
    const isLiked = p.likes.includes(currentUser.id);
    const commentCount = appData.comments.filter(c => c.postId === p.id).length;

    const postImageHtml = p.postImg
        ? `<img src="${fixPfp(p.postImg)}" alt="post image" class="post-image">`
        : "";

    const imgSrc = fixPfp(profilePic);
    const timeP = formatTimeAgo(p.timestamp);

    const deleteButtonHtml = p.authorId === currentUser.id
        ? `
            <button class="delete-btn">
                <i class="fa-regular fa-trash-can"></i>
            </button>
          `
        : '';

    return `
    <article class="post-card" data-id="${p.id}">
        <div class="post-header">
          <div class="post-user-info">
            <img src="${imgSrc}" alt="profile" class="post-avatar">

            <div class="post-meta">
              <h3 class="post-name">${username}</h3>
              <p class="post-time">${timeP}</p>
            </div>
          </div>

          ${deleteButtonHtml}
        </div>

        <div class="post-body">
          <p class="post-text">${p.content}</p>
          ${postImageHtml}
        </div>

        <div class="post-actions">
          <button class="action-btn like-btn ${isLiked ? 'liked' : ''} id="like-${p.id}"}"">
            <i class="fa-${isLiked ? 'solid' : 'regular'} fa-heart"></i>
            <span class="like-count">${likeCount}</span>
          </button>

          <button class="action-btn comment-btn" id="comment-${p.id}">
            <i class="fa-regular fa-comment"></i>
            <span class="comment-count">${commentCount}</span>
          </button>
        </div>
      </article>
    `;
}

function formatTimeAgo(timestamp) { //displays time nicely under post 
        const now = Date.now();
        const diff = now - timestamp ;

        const minutes = Math.floor(diff / (1000 * 60));
        if (minutes < 60) return `${minutes} min ago`;

        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hr ago`;

        const days = Math.floor(hours / 24);
        return `${days} days ago`;
}

function getpostsToShow(currentUser,allPost){ // only show on feed posts of users the Current user is following or curretnt user
    const postsToShow = [];
    const targetUsers = new Set(currentUser.following); // creating a set because the lookup is O(1) efficent 
    for(let p of allPost){
        if(targetUsers.has(p.authorId) || p.authorId == currentUser.id)
            postsToShow.push(p)
    }
    return postsToShow;
}
function getUserNameFromPost(p,users){ // get name of authorId of a specfic post
  const targetUserId = p.authorId;
  const targerUser =  getUser(targetUserId,users);
  return targerUser.username
}
function getProfilePicFromPost(p,users){ // get pfp of authorId of a specfic post
  const targetUserId = p.authorId;
  const targerUser =  getUser(targetUserId,users);
  return targerUser.profilePic;
}

function getUser(userId , users){ // get user object from user id
  for(let u of users){
    if(u.id === userId){
      return u
    }}
}

function fixPfp(profilePic){ //deals with pfp wether its a link base64 also default pfp
      let imgSrc;
    if (!profilePic) {
        imgSrc = "../assets/images/default.jpg"; } // fallback  
    else if (profilePic.startsWith("data:image")) {
        imgSrc = profilePic;}   // already full base64
    else if (profilePic.startsWith("http")) {
        imgSrc = profilePic; }// normal URL
    else {
        imgSrc = `data:image/png;base64,${profilePic}`; } // raw base64 string (no prefix) 

    return imgSrc;
}
function toUserHtml(u, mutualCount, mutualUsers, isFollowing) {
    const imgSrc = fixPfp(u.profilePic);

    let mutualText = 'No mutual connections';

    if (mutualCount === 1) {
        mutualText = `${mutualUsers[0].username} follows this user`;
    } else if (mutualCount > 1) {
        mutualText = `${mutualUsers[0].username} and ${mutualCount - 1} other${mutualCount - 1 === 1 ? '' : 's'} follow this user`;
    }

    return `
        <article class="user-card">
            <div class="user-card-left">
                <img src="${imgSrc}" alt="${u.username}" class="user-avatar">

                <div class="user-info">
                    <h3 class="user-name">${u.username}</h3>
                    <p class="user-bio">${u.bio || "No bio yet."}</p>
                    <p class="mutual-text">${mutualText}</p>
                </div>
            </div>

            <button 
                class="follow-btn ${isFollowing ? 'following' : 'follow'}" 
                data-userid="${u.id}">
                ${isFollowing ? 'Following' : 'Follow'}
            </button>
        </article>
    `;
}



