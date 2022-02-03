const mongoose = require("mongoose");
const diffHistory = require("mongoose-audit-trail").plugin;

const Schema = mongoose.Schema;

const roleSchema = new Schema({
    name: {type: String, required: true}
});

roleSchema.plugin(diffHistory);

const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
