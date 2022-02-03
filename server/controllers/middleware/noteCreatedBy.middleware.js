const User = require("../../models/user.model");

const middleware = (request, response, next) => {
    try {
        if (request.body.notes && request.user) {
            request.body.notes.forEach(note => {
                // const currentUser = new User(request.user);
                // note.createdBy = note.createdBy ? note.createdBy : currentUser;
                note.createdBy = note.createdBy ? note.createdBy : request.user._id;
            });
        }
        next();
    } catch (error) {
        return response.sendStatus(401);
    }
}

module.exports = middleware;
