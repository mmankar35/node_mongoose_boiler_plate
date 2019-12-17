const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TokenSchema = new Schema({
  token: {
    type: String,
    required: true
  }
});

export default mongoose.model('Token', TokenSchema);