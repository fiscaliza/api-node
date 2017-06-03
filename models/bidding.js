import mongoose from 'mongoose';
import schema from './schemas/bidding';


export default mongoose.model('Bidding', schema);
