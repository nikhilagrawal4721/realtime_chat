const users=[];

//Join users to chat 

function userJoin(id, username, room){
    const user={id, username,room};
    users.push(user);

    return user;
}

// Get the current user 

function getCurrentUser(id){
    return users.find(user=>user.id==id);
}

// Remove the user
function removeUser(id){
    const elem=getCurrentUser(id);
    var ind=users.indexOf(elem);
    if(ind>-1){
        return users.splice(ind,1);
    }

}

//Get room users 
function getRoomUsers(room){
    return users.filter(user=> user.room=== room);
}
module.exports={
    userJoin,
    getCurrentUser,
    removeUser,
    getRoomUsers
};