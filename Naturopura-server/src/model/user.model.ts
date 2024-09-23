import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // id: {
    //   type: Number,
    //   unique: true,
    //   required: true,
    //   auto: true,  // Mongoose doesn't have autoIncrement by default, but you can use mongoose-sequence or other plugins.
    // },
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
      enum: [
        "admin",
        "consumer",
        "farmer",
        "distributors",
        "consultant",
        "agricultural_chemicals",
        "equipment_manufacturers",
        "marketing_agencies",
        "insurance",
        "cold-storage",
      ],
      default: "consumer",
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
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
    isRemember: {
      type: Boolean,
      default: false,
    },
    dialingCode: {
      type: String,
      required: true,
    },
    addressLine: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // timestamps will automatically create 'createdAt' and 'updatedAt' fields.

const User = mongoose.model("User", userSchema);

export default User;
