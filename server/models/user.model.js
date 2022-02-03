const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const add = require("date-fns/add");
const format = require('date-fns/format');
const diffHistory = require("mongoose-audit-trail").plugin;

const Schema = mongoose.Schema;

// Pull this out to a constant so that we name the value
const SALT_WORK_FACTOR = 10;
const CONFIRMATION_DURATION_HOURS = 24;

const userSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    active: {type: Boolean, required: true, default: true},
    verified: {type: Boolean, required: true, default: false},
    password: {type: String, select: false},
    displayName: {type: String},
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        immutable: true
    },
    confirmation: {type: Object, select: false},
    roles: [{type: Schema.Types.ObjectId, ref: "Role"}],
    cohort: {type: Schema.Types.ObjectId, ref: "Cohort"}
});

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.displayName) {
        user.displayName = `${user.firstName} ${user.lastName}`;
    }

    user.confirmation = null;
    user.roles = [];
    user.cohort = null;
    user.verified = null;

    // Make sure users are unique by email address
    if (user.isNew) {
        this.constructor.find({ email: user.email }, (error, existingUsers) => {
            if (error) return next(error);

            if (existingUsers.length > 0) {
                next("User already exists");
            }
        });

        const random = Math.floor(Math.random() * (999999 - 100000) + 100000);
        user.confirmation = {
            code: random,
            expiresAt: Number(format(add(Date.now(), {hours: CONFIRMATION_DURATION_HOURS}), "T"))
        };
    }

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        // hash the password using our new salt
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function (candidatePassword, callback) {
    bcrypt.compare(candidatePassword, this.password, (error, isMatch) => {
        if (error) return callback(error);
        callback(null, isMatch);
    });
};

userSchema.plugin(diffHistory);

const User = mongoose.model("User", userSchema);

module.exports = User;
