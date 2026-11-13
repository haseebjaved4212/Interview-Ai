import { useContext, useEffect, useCallback } from "react";
import { getAllInterviewReports, generateInterviewReport, getInterviewReportById, generateResumePdf } from "../services/interview.api";
import { InterviewContext } from "../Interview.context.jsx";
import { useParams } from "react-router";

export const useInterview = () => {
    const context = useContext(InterviewContext);
    const { interviewId } = useParams();

    if (!context) {
        throw new Error("useInterview must be used within an InterviewProvider");
    }

    const { loading, setLoading, report, setReport, reports, setReports } = context;

    const generateReport = async ({ jobDescription, selfDescription, resumeFile }) => {
        setLoading(true);
        try {
            const response = await generateInterviewReport({ jobDescription, selfDescription, resumeFile });
            if (response?.interviewReport) {
                setReport(response.interviewReport);
                return response.interviewReport;
            }
            return null;
        } catch (error) {
            console.error("Failed to generate report:", error);
            const serverMessage = error?.response?.data?.message || error?.response?.data?.error;
            throw new Error(serverMessage || "Failed to generate interview strategy. Please try again.", { cause: error });
        } finally {
            setLoading(false);
        }
    };

    const getReportById = useCallback(async (id) => {
        setLoading(true);
        try {
            const response = await getInterviewReportById(id);
            if (response?.interviewReport) {
                setReport(response.interviewReport);
                return response.interviewReport;
            }
            return null;
        } catch (error) {
            console.error("Failed to fetch report:", error);
            return null;
        } finally {
            setLoading(false);
        }
    }, [setLoading, setReport]);

    const getReports = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllInterviewReports();
            if (response?.interviewReports) {
                setReports(response.interviewReports);
                return response.interviewReports;
            }
            return [];
        } catch (error) {
            console.error("Failed to fetch reports:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, [setLoading, setReports]);

    const getResumePdf = async (reportId) => {
        setLoading(true);
        try {
            const pdfBlob = await generateResumePdf({ interviewReportId: reportId });
            const url = window.URL.createObjectURL(new Blob([pdfBlob], { type: "application/pdf" }));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `resume_${reportId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download PDF resume:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (interviewId) {
            getReportById(interviewId);
        } else {
            getReports();
        }
    }, [interviewId, getReportById, getReports]);

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getReports,
        getResumePdf
    };
};
