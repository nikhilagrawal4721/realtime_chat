const rooms = [];

function addRoom(room,password)
{
    rooms.push({room,password});
}

function removeRoom( room )
{
    const elem = rooms.find( x => x.room === room );
    const index = rooms.indexOf(elem);

    if( index != -1 )
        rooms.splice( index, 1);
}

function getRooms()
{
    return rooms;
}

function isRoomAvail(room)
{
    const elem = rooms.find( x => x.room === room );
    const index = rooms.indexOf(elem);

    if( index == -1 )
        return false;
    else 
        return true;
}

function checkPassword( room, password )
{
    const elem = rooms.find( x => x.room === room );

    if( elem.password === password )
        return true;
    else 
        return false;
}

module.exports = {
    addRoom,
    removeRoom,
    getRooms,
    isRoomAvail,
    checkPassword
}
