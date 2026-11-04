const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");

/**
 * @description Controller to generate interview report based on user self description, resume and job description.
 */
async function generateInterViewReportController(req, res) {
    try {
        const { selfDescription, jobDescription } = req.body;

        if (!jobDescription || !jobDescription.trim()) {
            return res.status(400).json({
                message: "Target job description is required."
            });
        }

        let resumeText = "";

        if (req.file && req.file.buffer) {
            try {
                const parsed = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
                resumeText = parsed.text || "";
            } catch (parseError) {
                return res.status(400).json({
                    message: "Failed to extract text from resume PDF. Please ensure you upload a valid PDF document.",
                    error: parseError.message
                });
            }
        }

        if (!resumeText.trim() && (!selfDescription || !selfDescription.trim())) {
            return res.status(400).json({
                message: "Either a resume file or a self-description is required to generate your interview strategy."
            });
        }

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription
        });

        const userId = req.user.id || req.user._id;

        const interviewReport = await interviewReportModel.create({
            user: userId,
            resume: resumeText,
            selfDescription: selfDescription || "",
            jobDescription,
            ...interViewReportByAi
        });

        return res.status(201).json({
            message: "Interview report generated successfully.",
            interviewReport
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to generate interview report. Please try again.",
            error: error.message
        });
    }
}

/**
 * @description Controller to get interview report by interviewId.
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const userId = req.user.id || req.user._id;

        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: userId });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        return res.status(200).json({
            message: "Interview report fetched successfully.",
            interviewReport
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching interview report.",
            error: error.message
        });
    }
}

/** 
 * @description Controller to get all interview reports of logged in user.
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const userId = req.user.id || req.user._id;
        const interviewReports = await interviewReportModel.find({ user: userId })
            .sort({ createdAt: -1 })
            .select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

        return res.status(200).json({
            message: "Interview reports fetched successfully.",
            interviewReports
        });
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching interview reports.",
            error: error.message
        });
    }
}

/**
 * @description Controller to generate resume PDF based on user self description, resume and job description.
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;
        const userId = req.user.id || req.user._id;

        const interviewReport = await interviewReportModel.findOne({ _id: interviewReportId, user: userId });

        if (!interviewReport) {
            return res.status(404).json({
                message: "Interview report not found."
            });
        }

        const { resume, jobDescription, selfDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({ resume, jobDescription, selfDescription });

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
        });

        return res.send(pdfBuffer);
    } catch (error) {
        return res.status(500).json({
            message: "Error generating resume PDF.",
            error: error.message
        });
    }
}

module.exports = {
    generateInterViewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController
};
