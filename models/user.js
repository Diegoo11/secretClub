const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserShema = new Schema({
  name: {type: String, required: true},
  email: {type: String, required: true},
  password: {type: String, required: true},
  admin: {type: Boolean, required: true}
});

module.exports = mongoose.model('User', UserShema);
