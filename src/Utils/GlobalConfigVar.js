//global.PROD_Token = "LRwZYEBkfk"
function getUserToken() {
    return UserToken;
}
function getUserID() {
    return UserID;
}
module.exports = {
    token: getUserToken(),
    userId: getUserID()
}