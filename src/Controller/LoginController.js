const httpRequest = require('../Utils/HttpRequest');
class LoginController
{
    constructor() {}

    async login(request, response)
    {
        // Get the username and password from the request post
        console.log(request.body);
        const username = request.body.username;
        const password = request.body.password;
        const result = await httpRequest.login(username, password);
        response.status(200);
        response.json(result);
    }
}

module.exports = new LoginController();