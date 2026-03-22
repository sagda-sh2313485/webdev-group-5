const appData = getData();

function followUser(currentUser, targetUserId) {
    const appData = getData();

    const freshCurrentUser = getUser(currentUser.id, appData.users);
    const targetUser = getUser(targetUserId, appData.users);

    if (!freshCurrentUser || !targetUser) return;
    if (freshCurrentUser.id === targetUserId) return;
    if (freshCurrentUser.following.includes(targetUserId)) return;

    freshCurrentUser.following.push(targetUserId);

    if (!targetUser.followers.includes(freshCurrentUser.id)) {
        targetUser.followers.push(freshCurrentUser.id);
    }

    saveData(appData);
}
                      //U1        //U2
function unfollowUser(currentUser, targetUserId) {
    const appData = getData();

    const freshCurrentUser = getUser(currentUser.id, appData.users);
    const targetUser = getUser(targetUserId, appData.users);

    if (!freshCurrentUser || !targetUser) return;
    if (freshCurrentUser.id === targetUserId) return;

    //remove u2 from u1 following list
    freshCurrentUser.following = freshCurrentUser.following.filter(id => id !== targetUserId);

    // remove u1 from u2 followers list 
    targetUser.followers = targetUser.followers.filter(id => id !== freshCurrentUser.id);

    saveData(appData);
}