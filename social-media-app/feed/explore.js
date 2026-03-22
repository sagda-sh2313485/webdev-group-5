const currentUser = getCurrentUser();

if (currentUser === null) {
    window.location.href = "../auth/login.html";
} else {
    const recs = recommendedUsers(currentUser, 10);
    renderRecommendedUsers(recs);
    attachFollowEvents();
    attachSearchEvents();
}


function recommendedUsers(currentUser, limit) {
    const appData = getData();
    const candidateUsers = [];
    const candidateUsersScored = [];
    const following = currentUser.following;
    
    for (let u of following) {
        const userObj = getUser(u, appData.users);
        if (!userObj) continue;
        const friendsOfFriends = userObj.following;
        for (let f of friendsOfFriends) {
            if (f === currentUser.id) continue;

            if (candidateUsers.includes(f)) {
                candidateUsersScored[candidateUsers.indexOf(f)] += 1;
            } else {
                candidateUsers.push(f);
                candidateUsersScored.push(1);
            }
        }
    }
    let combined = candidateUsers.map((userId, i) => {
    const candidateUser = getUser(userId, appData.users);
    if (!candidateUser) return null;

    const mutualUsers = getMutualUsers(currentUser, candidateUser, appData.users);
    const mutualCount = mutualUsers.length;
    const followerCount = candidateUser.followers.length;
    const isFollowing = currentUser.following.includes(userId);
    const score = mutualCount * 3 + followerCount * 0.2;

    return {
        userId,
        mutualCount,
        mutualUsers,
        followerCount,
        score,
        isFollowing
    };
}).filter(Boolean);

    if (combined.length < limit) {
        const fallbackPool = [];

        for (let user of appData.users) {
            if (user.id === currentUser.id) continue;

            const alreadyAdded = combined.some(c => c.userId === user.id);
            if (alreadyAdded) continue;

            fallbackPool.push(user);
        }

        fallbackPool.sort(() => Math.random() - 0.5);

        const needed = limit - combined.length;

        for (let i = 0; i < needed && i < fallbackPool.length; i++) {
            combined.push({
            userId: fallbackPool[i].id,
            score: 0,
            mutualCount: 0,
            mutualUsers: [],
            followerCount: fallbackPool[i].followers.length,
            isFollowing: currentUser.following.includes(fallbackPool[i].id)
        });
        }
    }
    combined.sort((a, b) => {
        if (a.isFollowing !== b.isFollowing) {
            return a.isFollowing - b.isFollowing;
        }
        return b.score - a.score;
    });

    return combined.slice(0, limit);
}

function renderRecommendedUsers(recommendations) { // list of recs objects that has this structure { userid , followcoun,mytualcount and score}
    const appData = getData();
    const usersList = document.getElementById('users-list');

    if (recommendations.length === 0) {
    usersList.innerHTML = `<p class="empty-state">No users found.</p>`;
    return;
}

    const usersHtml = recommendations.map(rec => {
        const user = getUser(rec.userId, appData.users);

        if (!user) return '';

        return toUserHtml(user, rec.mutualCount, rec.mutualUsers, rec.isFollowing);
    });

    usersList.innerHTML = usersHtml.join('');
}

function attachFollowEvents() {
    const usersList = document.getElementById('users-list');

    usersList.addEventListener('click', (e) => {
        const btn = e.target.closest('.follow-btn');
        if (!btn) return;

        const currentUser = getCurrentUser();
        const targetUserId = btn.dataset.userid;

        if (currentUser.following.includes(targetUserId)) {
            unfollowUser(currentUser, targetUserId);
        } else {
            followUser(currentUser, targetUserId);
        }

        const updatedUser = getCurrentUser();
        const searchInput = document.getElementById('searchInput');
        const query = searchInput.value.trim();

        if (query === '') {
            const recs = recommendedUsers(updatedUser, 10);
            renderRecommendedUsers(recs);
        } else {
            const results = searchUsers(query, updatedUser);
            renderRecommendedUsers(results);
        }
    });
}

//serach functions

function searchUsers(query, currentUser) {
    const appData = getData();
    const allUsers = appData.users || [];
    const normalizedQuery = query.trim().toLowerCase();
    const filteredUsers = allUsers.filter(user => {
        if (user.id === currentUser.id) return false;
        return user.username.toLowerCase().includes(normalizedQuery);
    });
    const results = filteredUsers.map(user => {
        const isFollowing = currentUser.following.includes(user.id);
        const mutualUser=getMutualUsers(currentUser, user, appData.users)
        return {
            userId: user.id,
            isFollowing: isFollowing,
            mutualCount: mutualUser.length,
            mutualUsers: mutualUser,
            followerCount: user.followers.length,
            score: 0
        };
    });
    results.sort((a, b) => {
        if (a.isFollowing !== b.isFollowing) {
            return a.isFollowing - b.isFollowing;
        }
        return 0;
    });
    return results;
}

function getMutualUsers(currentUser, targetUser, allUsers) {
    const mutuals = [];

    for (let id of currentUser.following) {
        if (targetUser.following.includes(id)) {
            const mutualUser = getUser(id, allUsers);
            if (mutualUser) {
                mutuals.push(mutualUser);
            }
        }
    }

    return mutuals;
}
function attachSearchEvents() {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const currentUser = getCurrentUser();
        const query = searchInput.value.trim();
        if (query === '') {
            const recs = recommendedUsers(currentUser, 10);
            renderRecommendedUsers(recs);
        } else {
            const results = searchUsers(query, currentUser);
            renderRecommendedUsers(results);
        }
    });
}

function getMutualUsers(currentUser, targetUser, allUsers) {
    const mutuals = [];

    for (let id of currentUser.following) {
        if (targetUser.following.includes(id)) {
            const mutualUser = getUser(id, allUsers);
            if (mutualUser) {
                mutuals.push(mutualUser);
            }
        }
    }

    return mutuals;
}

