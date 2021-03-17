const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  auth_name: {
    type: String,
  },
  auth_time: {
    type: Number,
  },
  create_time: {
    type: Number,
    default: Date.now,
  },
  menus: {
    type: Array,
  },
});

const RoleModel = mongoose.model('roles', roleSchema);

module.exports = RoleModel;
