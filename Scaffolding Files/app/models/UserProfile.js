// Stores user profile information
class UserProfile {
    constructor(profileID, userID, bio= null, profileImage= null) {

        this.profileID = profileID;
        this.userID = userID;
        this.bio = bio;
        this.profileImage = profileImage;
    }

    getProfileID() {
        return this.profileID;
    }

    getUserID() {
        return this.userID;
    }

    getBio() {
        return this.bio;
    }

    getProfileImage() {
        return this.profileImage;
    }

}

module.exports = UserProfile;