import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  date_of_delivery: {
    type: String,
  },
  payment_method: {
    type: String,
    enum: ['CASH_ON_DELIVERY', 'CREDIT_CARD', 'DEBIT_CARD', 'UPI'],
    default: 'CASH_ON_DELIVERY',
  },
  payment_status: {
    type: String,
    enum: ['UNPAID', 'PAID'],
    default: 'UNPAID',
  },
  total_amount: {
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

export const Cart = mongoose.model('Cart', cartSchema);
