// Stores user information
class User {

    constructor(userID, username, passwordHash, joinDate) {

        this.userID = userID;
        this.username = username;
        this.passwordHash = passwordHash;
        this.joinDate = joinDate;

    }

    getUserID() {

        return this.userID;
    }

    getUsername() {

        return this.username;
    }

    getJoinDate() {

        return this.joinDate;
    }

}

module.exports = User;