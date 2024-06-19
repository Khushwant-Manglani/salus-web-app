import mongoose, { Schema } from 'mongoose';

// define the document schema
const documentSchema = new Schema({
  // Value of the document (eg:- passport, driving license etc)
  value: {
    type: String,
    required: true,
    trim: true,
  },
});

// create and export Document model based on document schema
export const Document = mongoose.model('Document', documentSchema);
