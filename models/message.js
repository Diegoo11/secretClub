const mongoose = require('mongoose');
const { DateTime } = require('luxon');
const Schema = mongoose.Schema;

const Message = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  date: {type: Date, required: true},
  text: {type: String, required: true},
  title: {type: String, required: true, default: Date.now}
});

Message
.virtual('fecha')
.get(function() {
  return DateTime.fromJSDate(this.date).toLocaleString();
})

module.exports = mongoose.model('Message', Message);