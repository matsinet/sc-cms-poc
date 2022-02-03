const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../../models/user.model");

const sessionExpiresIn = process.env.SESSION_EXPIRES_IN;

router.post("/login", (request, response) => {
    User.findOne({email: request.body.email}).select("+password").exec((error, user) => {
        if (error) return response.status(500);

        if (user) {
            user.comparePassword(request.body.password, (error, isMatch) => {
                if (error) return response.status(500).json({message: "Authentication Error", error});

                if (isMatch) {
                    const {password, __v, verified, approved, confirmation, ...payload} = user.toObject();
                    jwt.sign({user: payload}, process.env.JWT_SECRET, {expiresIn: sessionExpiresIn}, (error, token) => {
                        if (error) return response.sendStatus(401);
                        // Remove the password hash from the response
                        user.password = undefined;
                        response.json({token, user});
                    });
                } else {
                    response.sendStatus(401);
                }
            });
        } else {
            response.sendStatus(401);
        }
    });
});

router.post("/logout", (request, response) => {
    User.findOne({username: request.body.username}, (error, user) => {
        if (error) throw error;
        // Do whatever needs to happen at logout
    });
});

module.exports = router;
