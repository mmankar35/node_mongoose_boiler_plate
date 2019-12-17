const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  trello: {
    title: {
      type: [String],
      required: true
    },
    description: {
      type: [String],
      required: true
    }
  },
  emails: {
    type: [String],
    required: true
  },
  duration: {
    type: Number,
    reuired: true
  }
});

export default mongoose.model('Task', TaskSchema);
