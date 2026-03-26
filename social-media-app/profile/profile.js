const DEFAULT_PROFILE_IMAGE = "../assets/images/default.jpg";

const currentUser = getCurrentUser();

if (currentUser === null) {
  window.location.href = "../auth/login.html";
}

// ---------- utils ----------
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleString();
}

function fixProfileImage(src) {
  if (!src || src.trim() === "") {
    return DEFAULT_PROFILE_IMAGE;
  }
  return src;
}

function escapeHtml(text) {
  if (typeof text !== "string") return "";
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getUserPosts(userId) {
  const data = getData();
  return data.posts
    .filter((post) => post.authorId === userId)
    .sort((a, b) => b.timestamp - a.timestamp);
}

function getCommentCount(postId) {
  const data = getData();
  return data.comments.filter((comment) => comment.postId === postId).length;
}

function getPostImage(post) {
  if (!post.postImg || post.postImg.trim() === "") return "";
  return `
    <div class="profile-post-image-wrap">
      <img class="profile-post-image" src="${post.postImg}" alt="Post image" />
    </div>
  `;
}

// ---------- render profile ----------
function renderProfileHeader() {
  const data = getData();
  const user = data.users.find((u) => u.id === data.currentUserId);

  if (!user) {
    window.location.href = "../auth/login.html";
    return;
  }

  document.getElementById("profile-avatar").src = fixProfileImage(
    user.profilePic,
  );
  document.getElementById("profile-username").textContent = `@${user.username}`;
  document.getElementById("profile-bio").textContent =
    user.bio && user.bio.trim() !== "" ? user.bio : "No bio yet.";

  document.getElementById("followers-count").textContent =
    user.followers.length;
  document.getElementById("following-count").textContent =
    user.following.length;
  document.getElementById("posts-count").textContent = getUserPosts(
    user.id,
  ).length;

  document.getElementById("edit-bio").value = user.bio || "";
  document.getElementById("edit-preview-image").src = fixProfileImage(
    user.profilePic,
  );
}

// ---------- render posts ----------
function createPostCard(post) {
  const likeCount = Array.isArray(post.likes) ? post.likes.length : 0;
  const commentCount = getCommentCount(post.id);

  return `
    <article class="profile-post-card" data-post-id="${post.id}">
      <div class="profile-post-top">
        <div class="profile-post-user">
          <img
            class="mini-avatar"
            src="${fixProfileImage(getCurrentUser().profilePic)}"
            alt="User avatar"
          />
          <div>
            <h3>@${escapeHtml(getCurrentUser().username)}</h3>
            <p>${formatDate(post.timestamp)}</p>
          </div>
        </div>

        <button class="delete-own-post-btn" data-post-id="${post.id}" aria-label="Delete post">
          <i class="fa-regular fa-trash-can"></i>
        </button>
      </div>

      <div class="profile-post-body">
        <p>${escapeHtml(post.content || "")}</p>
        ${getPostImage(post)}
      </div>

      <div class="profile-post-meta">
        <span><i class="fa-regular fa-heart"></i> ${likeCount} likes</span>
        <span><i class="fa-regular fa-comment"></i> ${commentCount} comments</span>
      </div>
    </article>
  `;
}

function renderUserPosts() {
  const postsContainer = document.getElementById("profile-posts");
  const posts = getUserPosts(getCurrentUser().id);

  if (posts.length === 0) {
    postsContainer.innerHTML = `
      <div class="empty-state-card">
        <i class="fa-regular fa-note-sticky"></i>
        <h3>No posts yet</h3>
        <p>Create your first post from the feed page.</p>
      </div>
    `;
    return;
  }

  postsContainer.innerHTML = posts.map(createPostCard).join("");
}

// ---------- delete post ----------
function deleteOwnPost(postId) {
  const data = getData();
  const post = data.posts.find((p) => p.id === postId);

  if (!post) return;
  if (post.authorId !== data.currentUserId) return;

  data.posts = data.posts.filter((p) => p.id !== postId);
  data.comments = data.comments.filter((comment) => comment.postId !== postId);

  saveData(data);
  renderProfileHeader();
  renderUserPosts();
  attachDeleteEvents();
}

function attachDeleteEvents() {
  const deleteButtons = document.querySelectorAll(".delete-own-post-btn");

  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const postId = btn.dataset.postId;
      deleteOwnPost(postId);
    });
  });
}

// ---------- modal logic ----------
const modal = document.getElementById("edit-profile-modal");
const editButton = document.getElementById("edit-profile-btn");
const closeModalButton = document.getElementById("close-modal-btn");
const cancelEditButton = document.getElementById("cancel-edit-btn");
const logoutButton = document.getElementById("logout-btn");
const editProfileForm = document.getElementById("edit-profile-form");
const editProfileImageInput = document.getElementById("edit-profile-image");
const editPreviewImage = document.getElementById("edit-preview-image");

let pendingProfileImage = null;

function openModal() {
  const user = getCurrentUser();
  document.getElementById("edit-bio").value = user.bio || "";
  editPreviewImage.src = fixProfileImage(user.profilePic);
  pendingProfileImage = null;
  modal.classList.remove("hidden");
}

function closeModal() {
  modal.classList.add("hidden");
}

function attachModalEvents() {
  editButton.addEventListener("click", openModal);
  closeModalButton.addEventListener("click", closeModal);
  cancelEditButton.addEventListener("click", closeModal);
}

function attachImagePreviewEvent() {
  editProfileImageInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      pendingProfileImage = reader.result;
      editPreviewImage.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function attachEditSubmitEvent() {
  editProfileForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = getData();
    const user = data.users.find((u) => u.id === data.currentUserId);

    if (!user) return;

    const bioValue = document.getElementById("edit-bio").value.trim();
    user.bio = bioValue;

    if (pendingProfileImage) {
      user.profilePic = pendingProfileImage;
    }

    saveData(data);
    renderProfileHeader();
    renderUserPosts();
    attachDeleteEvents();
    closeModal();
  });
}

// ---------- logout ----------
const logoutModal = document.getElementById("logout-modal");
const confirmLogoutButton = document.getElementById("confirm-logout-btn");
const cancelLogoutButton = document.getElementById("cancel-logout-btn");
const closeLogoutModalButton = document.getElementById("close-logout-modal-btn");

// ---------- logout modal ----------
function openLogoutModal() {
  logoutModal.classList.remove("hidden");
}

function closeLogoutModal() {
  logoutModal.classList.add("hidden");
}

function attachLogoutEvents() {
  logoutButton.addEventListener("click", openLogoutModal);
  cancelLogoutButton.addEventListener("click", closeLogoutModal);
  closeLogoutModalButton.addEventListener("click", closeLogoutModal);
  confirmLogoutButton.addEventListener("click", () => {
    logout();
  });
}


// ---------- init ----------
renderProfileHeader();
renderUserPosts();
attachDeleteEvents();
attachModalEvents();
attachImagePreviewEvent();
attachEditSubmitEvent();
attachLogoutEvents();
