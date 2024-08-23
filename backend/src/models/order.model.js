import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  cart_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cart',
    required: true,
  },
  status: {
    type: String,
    enum: [
      'ORDER_PLACED',
      'ORDER_ACCEPTED',
      'ORDER_DISPATCHED',
      'ORDER_SHIPPED',
      'SENT_FOR_DELIVERY',
      'ORDER_DELIVERED',
    ],
    default: 'ORDER_PLACED',
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

export const Order = mongoose.model('Order', orderSchema);
