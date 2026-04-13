// Stores user profile information
class UserProfile {
    constructor(profileID, userID, bio, profileImage, dietaryPreferences) {

        this.profileID = profileID;
        this.userID = userID;
        this.bio = bio;
        this.profileImage = profileImage;
        this.dietaryPreferences = dietaryPreferences;
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

    getDietaryPreferences() {
        return this.dietaryPreferences;
    }

}

module.exports = UserProfile;