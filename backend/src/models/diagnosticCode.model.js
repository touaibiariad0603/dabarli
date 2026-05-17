import mongoose from "mongoose";

const diagnosticCodeSchema = new mongoose.Schema(
  {
    code: {
        type: String,
        required: true,
        unique: true,
        upercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    severity: {
        type: String,
        enum: ["Low", "Medium", "High", "Critical"],
        default:"medium",
    },
  },
  { timestamps: true }
);

export const DiagnosticCode = mongoose.model("DiagnosticCode", diagnosticCodeSchema);