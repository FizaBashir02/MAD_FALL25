import mongoose from "mongoose";

const momentSchema = new mongoose.Schema(
  {
    cafeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cafe",
      required: false, // <-- Make optional if not used
    },

    selectedCoffees: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    orderType: {
      type: String,
      enum: ["carry", "order"],
      default: "carry",
    },

    description: {
      type: String,
      default: "",
    },

    dateTime: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Moment", momentSchema);
