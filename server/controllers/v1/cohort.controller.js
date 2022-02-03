const express = require("express");
const router = express.Router();
const whereQuery = require("../handlers/whereQuery.handler");
const withQuery = require("../handlers/withQuery.handler");
const checkUser = require("../middleware/checkUser.middleware");
const Cohort = require("../../models/cohort.model");
const User = require("../../models/user.model");

router.all("*", checkUser);

router.post("/", (request, response) => {
  const newRecord = new Cohort(request.body);

  // Add the user for the audit trail
  newRecord.__user = request.user.email;

  newRecord.save((error, document) => {
    if (error) return response.status(500).json(error.message);
    return response.json(document);
  });
});

router.get("/", (request, response) => {
  let model = Cohort.find({});

  model = whereQuery(model, request);
  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.get("/:id", (request, response) => {
  let model = Cohort.findById(request.params.id);

  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.put("/:id", (request, response) => {
  const body = request.body;

  Cohort.findByIdAndUpdate(
    request.params.id,
    {
      $set: {
        name: body.name,
        type: body.type,
        active: body.active,
        startDate: body.startDate,
        staff: body.staff,
        students: body.students
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
  Cohort.findByIdAndRemove(request.params.id, {__user: request.user.email}, (error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data);
  });
});

router.get("/:id/students", (request, response) => {
  let model = Cohort.findById(request.params.id);

  model = model.populate('students');

  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data.students);
  });
});

router.get("/:id/staff", (request, response) => {
  let model = Cohort.findById(request.params.id);

  model = model.populate('staff');

  model = withQuery(model, request);

  model.exec((error, data) => {
    if (error) return response.status(500).json(error.message);
    return response.json(data.staff);
  });
});

module.exports = router;
