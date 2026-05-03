const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Үнэлж буй хүн (Ажилтан эсвэл Олгогч)
  revieweeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Үнэлүүлж буй хүн
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' }, // Ямар ажил дээр вэ гэдэг нь давхардал үүсэхээс сэргийлнэ
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);