const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  version: {
    type: Number,
    default: 1,
    required: false
  },
  technology: {
    type: String,
    enum: ['node', 'ruby'],
    required: true
  },
  planner_id: {
    type: Schema.Types.ObjectId,
    required: false,
    default: null
  },
  status: {
    type: String,
    default: 'Created',
    enum: ['Created', 'Drafted', 'Completed'],
    required: false
  },
  tasks: [{type: Schema.Types.ObjectId}]
});

export default mongoose.model('Plan', PlanSchema);