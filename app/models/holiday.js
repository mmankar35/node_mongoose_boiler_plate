import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const HolidaySchema = new Schema({
    dates: {
        type: Date,
        required: true
    }
}, {
    collection: 'holidays'
});

export default mongoose.model('Holiday', HolidaySchema);