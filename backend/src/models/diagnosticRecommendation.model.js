import mongoose from "mongoose";

const diagnosticRecommendationSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    keywords: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

export const DiagnosticRecommendation =
  mongoose.model(
    "DiagnosticRecommendation",
    diagnosticRecommendationSchema
  );