import mongoose from "mongoose";

const vehicleInfoSchema = new mongoose.Schema(
  {
    brand: String,
    model: String,
    year: Number,
    vin: String,
  },
  { _id: false }
);

const diagnosticScanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vehicleInfo: vehicleInfoSchema,

    diagnosticCodes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DiagnosticCode",
      },
    ],

    recommendedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export const DiagnosticScan = mongoose.model(
  "DiagnosticScan",
  diagnosticScanSchema
);