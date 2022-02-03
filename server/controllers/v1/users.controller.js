const express = require("express");
const router = express.Router();
const User = require("../../models/user.model");
const checkUser = require("../middleware/checkUser.middleware");
const withQuery = require("../handlers/withQuery.handler");
const whereQuery = require("../handlers/whereQuery.handler");

router.post("/", checkUser, (request, response) => {
  const newRecord = new User(request.body);

  // Add the user for the audit trail
  newRecord.__user = request.user.email;

  newRecord.save((error, document) => {
    if (error) return response.status(500).json(error.message);
    document.password = undefined;
    document.confirmation = undefined;
    return response.json(document);
  });
});

router.get("/", checkUser, (request, response) => {
  let model = User.find({});

  model = whereQuery(model, request);
  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.get("/:id", checkUser, (request, response) => {
  let model = User.findById(request.params.id);

  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.put("/:id", checkUser, (request, response) => {
  const body = request.body;

  User.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        firstName: body.firstName,
        lastName: body.lastName,
        active: body.active,
        password: body.password,
        displayName: body.displayName,
        email: body.email,
        roles: body.roles
      }
    },
    {
      new: true,
      upsert: true,
      __user: request.user.email
    },
    (error, data) => {
      if (error) return response.status(500).json(error.message);
      return response.json(data);
    }
  );
});

router.patch("/:id/password", checkUser, (request, response) => {
  const body = request.body;

  User.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        password: body.password
      }
    },
    {__user: request.user.email},
    (error, data) => {
      if (error) return response.status(500).json(error.message);
      return response.json(data);
    }
  );
});

router.delete("/:id", checkUser, (request, response) => {
  User.findByIdAndRemove(request.params.id, {__user: request.user.email}, (error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.post("/register", (request, response) => {
  const newRecord = new User(request.body);

  newRecord.save((error, data) => {
    if (error) return response.status(500).json(error.message);
    data.password = undefined;
    data.confirmation = undefined;

    // Trigger registration mail logic
    return response.json(data);
  });
});

router.post("/confirmation/:email", (request, response) => {
  const email = decodeURIComponent(request.params.email);

  if (!request.body.code) return response.status(400).json({error: "Confirmation code required"})

  User.findOne({email: email}).select('+confirmation').exec((error, user) => {
    if (error) return response.status(500).json(error.message);

    if (user) {
      if (user.verified) return response.json(user);
      if (request.body.code !== user.confirmation.code) return response.status(400).json("Confirmation code mismatch");
      if (Date.now() > user.confirmation.expiresAt) return response.status(400).json("Confirmation code has expired");

      user.verified = true;
      user.confirmation = null;
      user.save((error, user) => {
        if (error) return response.status(500).json(error.message);
        return response.json(user);
      });
    } else {
      return response.status(404).json("User not found");
    }
  });
});

router.post("/confirmation/:email/reset", (request, response) => {
});

module.exports = router;
