const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ROLES } = require('../config/constants');

/**
 * User schema — passwords are NEVER stored in plain text.
 * Hashing is done in pre-save hook using bcrypt (adaptive cost factor).
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      // Index on email supports fast login lookups and enforces uniqueness at DB level
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      // select: false prevents password from being returned in queries unless explicitly requested
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const saltRounds = 12;
  // Higher salt rounds increase work for attackers brute-forcing stolen hashes
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
