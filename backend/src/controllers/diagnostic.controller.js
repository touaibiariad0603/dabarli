import { DiagnosticCode } from "../models/diagnosticCode.model.js";
import { DiagnosticScan } from "../models/diagnosticScan.model.js";
import { Product } from "../models/product.model.js";
import { DiagnosticRecommendation } from "../models/diagnosticRecommendation.model.js";

export async function createDiagnosticScan(req, res) {
  try {
    const { vehicleInfo, codes } = req.body;

    if (!codes || !Array.isArray(codes) || codes.length === 0) {
      return res.status(400).json({
        message: "Diagnostic codes are required and should be an array.",
      });
    }

    const normalizedCodes = codes.map((code) =>
      code.trim().toUpperCase()
    );

    const diagnosticCodes = await DiagnosticCode.find({
      code: { $in: normalizedCodes },
    });

    const mappings = await DiagnosticRecommendation.find({
  code: { $in: normalizedCodes },
});

const keywords = mappings.flatMap((item) => item.keywords);

let recommendedProducts = [];

if (keywords.length > 0) {
  recommendedProducts = await Product.find({
    $or: keywords.map((keyword) => ({
      name: { $regex: keyword, $options: "i" },
    })),
  }).limit(10);
}
    const scan = await DiagnosticScan.create({
      //user: req.user?._id,
      user: "681f1b1b1b1b1b1b1b1b1b1b",
      vehicleInfo,
      diagnosticCodes: diagnosticCodes.map((item) => item._id),
      recommendedProducts: recommendedProducts.map((item) => item._id),
    });

    const populatedScan = await DiagnosticScan.findById(scan._id)
      .populate("diagnosticCodes")
      .populate("recommendedProducts");

    res.status(201).json({
      message: "Diagnostic scan created successfully",
      scan: populatedScan,
    });
  } catch (error) {
    console.error("Error creating diagnostic scan:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
}

 export async function getMyDiagnosticScans(req, res) {
    try {
        const scans = await DiagnosticScan.find({ user: req.user._id })
        .populate("diagnosticCodes")
        .populate("recomendedProducts")
        .sort({ createdAt: -1 });

        res.status(200).json({ scans });
    }catch (error) {
        console.error("Error fetching diagnostic scans:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getDiagnosticScanById(req, res) {
    try {
        const { id } = req.params;
        const scan = await DiagnosticScan.findOne({ _id: id, user: req.user._id })
        .populate("diagnosticCodes")
        .populate("recomendedProducts");
        if (!scan) {
            return res.status(404).json({ message: "Diagnostic scan not found" });
        }
        res.status(200).json({ scan });
    } catch (error) {
        console.error("Error fetching diagnostic scan:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function createDiagnosticCode(req, res) {
    try {
        const {code, description, severity} = req.body;

        if (!code || !description) {
            return res.status(400).json({ message: "Code and description are required." });
        }

        const diagnosticCode = await DiagnosticCode.create({
            code,
            description,
            severity,
        });
        res.status(201).json({
            message: "Diagnostic code created successfully",
            diagnosticCode,
        });
    } catch (error) {
        console.error("Error creating diagnostic code:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getDiagnosticCodes(req, res) {
    try {
        const codes = await DiagnosticCode.find().sort({ code: 1 });
        res.status(200).json({ codes });
    } catch (error) {
        console.error("Error fetching diagnostic codes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


