import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true,
    required: true,
    auto: true,  // Mongoose doesn't have autoIncrement by default, but you can use mongoose-sequence or other plugins.
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'consumer', 'farmer', 'distributors', 'consultant', 'agricultural_chemicals', 'equipment_manufacturers', 'marketing_agencies', 'insurance', 'cold-storage'],
    default: 'consumer',
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  image: {
    type: String,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
    required: true
  },
  key: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.Number,  // Using Number as a reference
    default: null
  },
  deletedAt: {
    type: Date,
    default: null,
  }
}, { timestamps: true });  // timestamps will automatically create 'createdAt' and 'updatedAt' fields.

const User = mongoose.model('User', userSchema);

export default User
