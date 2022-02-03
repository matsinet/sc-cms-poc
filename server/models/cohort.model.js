const mongoose = require("mongoose");
const diffHistory = require("mongoose-audit-trail").plugin;

const Schema = mongoose.Schema;

const cohortSchema = new Schema({
    name: {type: String, required: true},
    type: {type: String, required: true},
    active: {type: Boolean, required: true, default: true},
    startDate: {type: Date},
    staff: [{type: Schema.Types.ObjectId, ref: "User", default: []}],
    students: [{type: Schema.Types.ObjectId, ref: "User", default: []}]
});

cohortSchema.plugin(diffHistory);

const Cohort = mongoose.model("Cohort", cohortSchema);

module.exports = Cohort;
