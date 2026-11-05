const { GoogleGenAI, Type } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

// Supported Gemini models ordered by current active reliability and availability
const CANDIDATE_MODELS = [
    process.env.GEMINI_MODEL,
    "gemini-3-flash-preview",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.1-flash-lite",
    "gemini-3.8-flash",
    "gemini-3.5-flash",
    "gemini-flash-latest"
].filter(Boolean);

// Structured JSON Schema for interview report
const interviewReportSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "The title of the job for which the interview report is generated"
        },
        matchScore: {
            type: Type.NUMBER,
            description: "A score between 0 and 100 indicating how well the candidate's profile matches the job describe"
        },
        technicalQuestions: {
            type: Type.ARRAY,
            description: "Technical questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The technical question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        behavioralQuestions: {
            type: Type.ARRAY,
            description: "Behavioral questions that can be asked in the interview along with their intention and how to answer them",
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING, description: "The behavioral question can be asked in the interview" },
                    intention: { type: Type.STRING, description: "The intention of interviewer behind asking this question" },
                    answer: { type: Type.STRING, description: "How to answer this question, what points to cover, what approach to take etc." }
                },
                required: ["question", "intention", "answer"]
            }
        },
        skillGaps: {
            type: Type.ARRAY,
            description: "List of skill gaps in the candidate's profile along with their severity",
            items: {
                type: Type.OBJECT,
                properties: {
                    skill: { type: Type.STRING, description: "The skill which the candidate is lacking" },
                    severity: {
                        type: Type.STRING,
                        enum: ["low", "medium", "high"],
                        description: "The severity of this skill gap, i.e. how important is this skill for the job and how much it can impact the candidate's chances"
                    }
                },
                required: ["skill", "severity"]
            }
        },
        preparationPlan: {
            type: Type.ARRAY,
            description: "A day-wise preparation plan for the candidate to follow in order to prepare for the interview effectively",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.NUMBER, description: "The day number in the preparation plan, starting from 1" },
                    focus: { type: Type.STRING, description: "The main focus of this day in the preparation plan, e.g. data structures, system design, mock interviews etc." },
                    tasks: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                        description: "List of tasks to be done on this day to follow the preparation plan"
                    }
                },
                required: ["day", "focus", "tasks"]
            }
        }
    },
    required: ["title", "matchScore", "technicalQuestions", "behavioralQuestions", "skillGaps", "preparationPlan"]
};

// Structured JSON Schema for resume PDF generation
const resumePdfSchema = {
    type: Type.OBJECT,
    properties: {
        html: {
            type: Type.STRING,
            description: "The HTML content of the resume which can be converted to PDF using any library like puppeteer"
        }
    },
    required: ["html"]
};

/**
 * Safely parse JSON text from model response, stripping possible markdown code fences
 */
function parseModelJsonResponse(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Empty or non-string response received from AI model.");
    }
    let cleaned = text.trim();
    if (cleaned.startsWith("```json")) {
        cleaned = cleaned.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
    } else if (cleaned.startsWith("```")) {
        cleaned = cleaned.replace(/^```\s*/, "").replace(/```\s*$/, "");
    }
    return JSON.parse(cleaned.trim());
}

/**
 * Helper to call Gemini with automated model fallback
 */
async function generateContentWithFallback({ contents, schema }) {
    let lastError = null;

    // Remove duplicates while preserving order
    const models = Array.from(new Set(CANDIDATE_MODELS));

    for (const model of models) {
        try {
            const response = await ai.models.generateContent({
                model,
                contents,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: schema
                }
            });

            if (response && response.text) {
                return parseModelJsonResponse(response.text);
            }
            throw new Error(`Model ${model} returned an empty response.`);
        } catch (error) {
            lastError = error;
            console.warn(`[AI Service] Model "${model}" failed: ${error.message}. Trying next candidate model...`);

            // Don't retry if the API key itself is clearly invalid
            const isAuthKeyInvalid = error.message && (
                error.message.includes("API_KEY_INVALID") ||
                error.message.includes("API key not valid")
            );

            if (isAuthKeyInvalid) {
                throw error;
            }
            // For any other error (503 demand spike, 404 deprecated, 429 rate limit, 500 error), continue to next model
        }
    }

    throw lastError || new Error("Failed to generate content with available Gemini models.");
}

async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate an interview report for a candidate with the following details:
Resume: ${resume || "No resume provided"}
Self Description: ${selfDescription || "No self description provided"}
Job Description: ${jobDescription}
`;

    return await generateContentWithFallback({
        contents: prompt,
        schema: interviewReportSchema
    });
}

function getSystemChromePath() {
    const fs = require("fs");
    const paths = [
        process.env.PUPPETEER_EXECUTABLE_PATH,
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser"
    ].filter(Boolean);

    for (const p of paths) {
        if (fs.existsSync(p)) return p;
    }
    return undefined;
}

async function generatePdfFromHtml(htmlContent) {
    const cleanLightExportTheme = `
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

    @page {
        size: A4;
        margin: 0;
    }

    html, body {
        background-color: #F8FAFC !important;
        color: #0F172A !important;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
    }

    .resume-container, .resume-card, .card, .container, section, main {
        background-color: #FFFFFF !important;
        color: #0F172A !important;
    }

    h1, h2, h3, h4, h5, h6 {
        color: #0F172A !important;
    }

    p, li, td, th, span {
        color: #334155;
    }

    a {
        color: #4F46E5 !important;
        text-decoration: none;
    }

    code, pre {
        font-family: 'JetBrains Mono', monospace !important;
    }
</style>
`;

    const themedHtml = htmlContent.includes("</head>")
        ? htmlContent.replace("</head>", `${cleanLightExportTheme}</head>`)
        : `${cleanLightExportTheme}${htmlContent}`;

    const executablePath = getSystemChromePath();
    const launchOptions = {
        headless: true,
        pipe: true,
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu"
        ]
    };
    if (executablePath) {
        launchOptions.executablePath = executablePath;
    }

    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();
    await page.setContent(themedHtml, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4",
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    const prompt = `Generate resume for a candidate with the following details:
Resume: ${resume || "No resume provided"}
Self Description: ${selfDescription || "No self description provided"}
Job Description: ${jobDescription}

The response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using puppeteer.
The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
The styling MUST follow a clean light theme for ATS readability and print quality:
- Canvas background: #F8FAFC
- Card / section surfaces: #FFFFFF
- Main text and headings: #0F172A
- Body / description text: #334155
- Subtle borders: #E2E8F0
- Font family: Inter, sans-serif
The content should be ATS friendly. Keep it to 1-2 pages length.
`;

    const jsonContent = await generateContentWithFallback({
        contents: prompt,
        schema: resumePdfSchema
    });

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
