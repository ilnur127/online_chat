const users = [];

const getUser = (user) => {
    return users.find(u => u.name === user.name && u.room.name === user.room.name)
}

const addUser = (user) => {
    const isExist = getUser(user);

    if (!isExist) {
        users.push(user)
    }

    return { isExist: !!isExist, user: isExist || user };
}

const getRoomUsers = (roomName) => users.filter((u) => u.room.name === roomName);

const deleteUser = ({ userName, roomName }) => {
    const index = users.findIndex(u => u.name === userName && u.room.name === roomName)

    users.slice(index, index + 1)
}

module.exports = { addUser, getUser, deleteUser, getRoomUsers }