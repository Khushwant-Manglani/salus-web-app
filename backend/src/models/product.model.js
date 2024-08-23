import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  partner_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    // Cloudinary image URL
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  analysis: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

export const Product = mongoose.model('Product', productSchema);
