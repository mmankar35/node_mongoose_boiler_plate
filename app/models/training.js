import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import Employee from '../models';

const trainingSchema = new Schema({
  trainee_id: {type : mongoose.Schema.Types.ObjectId, required : true, ref: 'employee' },
  trainer_id: {type : mongoose.Schema.Types.ObjectId, required : true, ref: 'employee' },
  program_id: {type : mongoose.Schema.Types.ObjectId, required : true, ref: 'employee' },
  next_task_index: Number,
  completion_time: Date,
  trelloBoard: {type : mongoose.Schema.Types.ObjectId, default : null },
  trelloListId: {type : mongoose.Schema.Types.ObjectId, default : null },
  state: {
    type : String,
    enum: ['in progress', 'completed', 'expired'], 
    default : 'in progress'
  }
},{collection : 'training'});

export default mongoose.model('Training', trainingSchema);


