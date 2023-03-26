export const getSender = (loggedUser, users) => {
    if (users.length > 0) {
        const senderName = users[0]._id === loggedUser._id ? users[1].name : users[0].name;
        return senderName;
    } else {
        return null
    }

}