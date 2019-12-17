import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator'
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  DOB: {
    type: Date,
    required: true
  },
  dateOfJoining: Date,
  designation: String,
  technologies: [{
    type: String,
    enum: ['node', 'ruby'],
    required: true
  }],
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  roles: [{
    type: String,
    enum: ['trainee', 'trainer', 'hr', 'planner'],
    required: true
  }],
  contactno: String,
  address: String,
  reportingManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'employee'
  },
  leaves: [{
    type: Date,
    default: null
  }],
  deleted: {
    type: Boolean,
    default: false
  }
}, {
  collection: 'employee'
});
EmployeeSchema.plugin(uniqueValidator);

export default mongoose.model('Employee', EmployeeSchema);