const jwt = require('jsonwebtoken');

const middleware = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        const jwtData = jwt.verify(token, process.env.JWT_SECRET);
        request.user = jwtData.user;
        next();
    } catch (error) {
        return response.sendStatus(401);
    }
}

module.exports = middleware;
