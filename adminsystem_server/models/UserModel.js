const mongoose = require('mongoose');
const md5 = require('md5');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  create_time: {
    type: Number,
    default: Date.now,
  },
  role_id: {
    type: String,
  },
});

const UserModel = mongoose.model('users', userSchema);

// default admin user: admin/admin
UserModel.findOne({ username: 'admin' }).then((user) => {
  if (!user) {
    UserModel.create({ username: 'admin', password: md5('admin') })
      .then(() => {
        console.log('default user: username: admin password: admin');
      });
  }
});

module.exports = UserModel;
