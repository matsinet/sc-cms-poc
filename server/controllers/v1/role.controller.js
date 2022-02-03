const express = require("express");
const router = express.Router();
const whereQuery = require("../handlers/whereQuery.handler");
const withQuery = require("../handlers/withQuery.handler");
const checkUser = require("../middleware/checkUser.middleware");
const Role = require("../../models/role.model");

router.all("*", checkUser);

router.post("/", (request, response) => {
  const newRecord = new Role(request.body);

  // Add the user for the audit trail
  newRecord.__user = request.user.email;

  newRecord.save((error, document) => {
    if (error) return response.status(500).json(error.message);
    return response.json(document);
  });
});

router.get("/", (request, response) => {
  let model = Role.find({});

  model = whereQuery(model, request);
  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.get("/:id", (request, response) => {
  let model = Role.findById(request.params.id);

  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.put("/:id", (request, response) => {
  const body = request.body;

  Role.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        name: body.name
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

router.delete("/:id", (request, response) => {
  Role.findByIdAndRemove(request.params.id, {__user: request.user.email}, (error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

module.exports = router;
