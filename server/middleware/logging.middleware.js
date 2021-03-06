const jwt = require("jsonwebtoken");

function consoleLog(request, user = "") {

}

const middleware = (request, response, next) => {
  try {
    let user = "Unauthorized";

    if (request.headers.hasOwnProperty('authorization')) {
      const token = request.headers.authorization.split(' ')[1];
      const jwtData = jwt.verify(token, process.env.JWT_SECRET);
      user = jwtData.user._id || "Foo Bar";
    }


    console.log({
      timestamp: Date.now(),
      method: request.method,
      route: request.path,
      query: request.query,
      params: request.params,
      body: request.body,
      ipAddress: request.ip,
      user: user
    });

    next();
  } catch (error) {
    return response.sendStatus(401);
  }
}

module.exports = middleware;