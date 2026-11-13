import { useState, useRef, useEffect } from 'react';
import { useInterview } from '../hooks/useInterview.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import { useNavigate, Link } from 'react-router';

const LOADING_STAGES = [
    "Reading the job description",
    "Mapping your profile",
    "Drafting questions",
    "Calibrating preparation roadmap"
];

const GenerationLoader = () => {
    const [stageIndex, setStageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setStageIndex(prev => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
        }, 6500);
        return () => clearInterval(interval);
    }, []);

    return (
        <main className='loading-screen'>
            <div className='loading-column'>
                <header className='loading-header'>
                    <h1 className='loading-title'>{LOADING_STAGES[stageIndex]}</h1>
                    <p className='loading-sub'>This usually takes about 30 seconds.</p>
                </header>
                <div className='loading-stage-list'>
                    {LOADING_STAGES.map((stage, idx) => {
                        const isDone = idx < stageIndex;
                        const isActive = idx === stageIndex;
                        return (
                            <div
                                key={stage}
                                className={`loading-stage-row ${isDone ? 'loading-stage-row--done' : isActive ? 'loading-stage-row--active' : 'loading-stage-row--pending'}`}
                            >
                                <span className='loading-stage-marker' aria-hidden="true">
                                    {isDone ? (
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                    ) : (
                                        <span className='loading-dot' />
                                    )}
                                </span>
                                <span className='loading-stage-text'>{stage}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

const Home = () => {
    const { loading, generateReport, reports } = useInterview();
    const { user, handleLogout } = useAuth();
    const navigate = useNavigate();

    const onLogout = async () => {
        await handleLogout();
        navigate('/');
    };

    const [jobDescription, setJobDescription] = useState("");
    const [selfDescription, setSelfDescription] = useState("");
    const [selectedFileName, setSelectedFileName] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [formError, setFormError] = useState("");
    const resumeInputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
            setFormError("");
        } else {
            setSelectedFileName("");
        }
    };

    const handleRemoveFile = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedFileName("");
        if (resumeInputRef.current) {
            resumeInputRef.current.value = "";
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFileName(file.name);
            setFormError("");
            if (resumeInputRef.current && typeof DataTransfer !== 'undefined') {
                const dt = new DataTransfer();
                dt.items.add(file);
                resumeInputRef.current.files = dt.files;
            }
        }
    };

    const handleGenerateReport = async () => {
        setFormError("");
        const resumeFile = resumeInputRef.current?.files?.[0];

        if (!jobDescription.trim()) {
            setFormError("Target job description is required.");
            return;
        }

        if (!resumeFile && !selfDescription.trim()) {
            setFormError("Please upload a resume or provide a short description.");
            return;
        }

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile });
            if (data?._id) {
                navigate(`/interview/${data._id}`);
            } else {
                setFormError("Failed to generate interview strategy. Please try again.");
            }
        } catch (err) {
            setFormError(err.message || "Failed to generate interview strategy. Please try again.");
        }
    };

    if (loading) {
        return <GenerationLoader />;
    }

    const usernameRaw = user?.username || 'Candidate';
    const avatarInitial = (usernameRaw[0] || 'C').toUpperCase();
    const truncatedUsername = usernameRaw.length > 18 ? `${usernameRaw.slice(0, 18)}...` : usernameRaw;

    return (
        <div className='home-page'>
            {/* ── 1. Top Bar ── */}
            <header className='home-topbar'>
                <Link to="/" className='home-topbar__wordmark'>HireCraft</Link>
                <div className='home-topbar__user'>
                    <span className='home-topbar__avatar' aria-hidden="true">{avatarInitial}</span>
                    <span className='home-topbar__username' title={usernameRaw}>{truncatedUsername}</span>
                    <button
                        type="button"
                        onClick={onLogout}
                        className='home-topbar__logout'
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className='home-main-container'>
                {/* ── 2. Hero Header ── */}
                <section className='home-hero'>
                    <h1 className='home-hero__title'>Build your interview plan</h1>
                    <p className='home-hero__sub'>
                        Paste the job description and your profile to generate a focused preparation plan.
                    </p>
                </section>

                {formError && (
                    <div className='form-error-alert home-error-alert' role='alert'>
                        {formError}
                    </div>
                )}

                {/* ── 3. Workspace (One Surface, Two Columns) ── */}
                <section className='workspace-panel' aria-label="Interview Plan Builder">
                    <div className='workspace-grid'>

                        {/* Left Column: Job Description */}
                        <div className='workspace-col workspace-col--left'>
                            <div className='workspace-field-header'>
                                <label htmlFor="jobDescription" className='workspace-label'>
                                    Job description
                                </label>
                                <span className='workspace-meta-text'>Required</span>
                            </div>
                            <textarea
                                id="jobDescription"
                                name="jobDescription"
                                value={jobDescription}
                                onChange={(e) => {
                                    setJobDescription(e.target.value);
                                    if (formError) setFormError("");
                                }}
                                className='workspace-textarea'
                                placeholder="Paste the job description here (responsibilities, technical requirements, qualifications)..."
                                maxLength={5000}
                            />
                            <div className='workspace-counter'>
                                <span className='counter-digits'>{jobDescription.length}</span> / 5000
                            </div>
                        </div>

                        {/* Hairline Divider */}
                        <div className='workspace-divider' aria-hidden="true" />

                        {/* Right Column: Profile */}
                        <div className='workspace-col workspace-col--right'>
                            <div className='workspace-field-header'>
                                <span className='workspace-label'>Your profile</span>
                                <span className='workspace-meta-text'>Recommended</span>
                            </div>

                            {/* Dropzone */}
                            <div
                                className={`workspace-dropzone ${isDragging ? 'workspace-dropzone--dragover' : ''} ${selectedFileName ? 'workspace-dropzone--has-file' : ''}`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                            >
                                <input
                                    ref={resumeInputRef}
                                    onChange={handleFileChange}
                                    type='file'
                                    id='resume'
                                    name='resume'
                                    accept='.pdf,.docx'
                                    className='workspace-dropzone__input'
                                />
                                {selectedFileName ? (
                                    <div className='workspace-dropzone__file-row'>
                                        <div className='workspace-dropzone__file-info'>
                                            <svg className='workspace-dropzone__icon' width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                                <polyline points="14 2 14 8 20 8" />
                                            </svg>
                                            <span className='workspace-dropzone__filename'>{selectedFileName}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveFile}
                                            className='workspace-dropzone__remove'
                                            aria-label="Remove attached file"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor='resume' className='workspace-dropzone__label'>
                                        <svg className='workspace-dropzone__icon' width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span className='workspace-dropzone__text'>
                                            Upload a PDF or DOCX, max 3 MB
                                        </span>
                                    </label>
                                )}
                            </div>

                            {/* Plain "or" divider */}
                            <div className='workspace-or'>
                                <span>or</span>
                            </div>

                            {/* Short Description */}
                            <div className='workspace-short-desc'>
                                <label htmlFor='selfDescription' className='workspace-sublabel'>
                                    Short description
                                </label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => {
                                        setSelfDescription(e.target.value);
                                        if (formError) setFormError("");
                                    }}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='workspace-textarea workspace-textarea--short'
                                    placeholder="Briefly describe your background, years of experience, and core skills if you don't have a resume file handy..."
                                />
                            </div>

                            <p className='workspace-note'>
                                Add a resume or a short description. One is enough.
                            </p>
                        </div>
                    </div>
                </section>

                {/* ── 4. Action Row (Below Workspace) ── */}
                <div className='workspace-actions'>
                    <span className='workspace-actions__helper'>Takes about 30 seconds</span>
                    <button
                        type="button"
                        onClick={handleGenerateReport}
                        className='button primary-button workspace-actions__submit'
                    >
                        Generate my plan
                    </button>
                </div>

                {/* ── 5. Recent Reports List (Separated by Hairlines, Hidden when empty) ── */}
                {reports.length > 0 && (
                    <section className='recent-plans' aria-labelledby="recent-plans-title">
                        <h2 id="recent-plans-title" className='recent-plans__title'>Recent interview plans</h2>
                        <div className='recent-plans__list'>
                            {reports.map(reportItem => (
                                <article
                                    key={reportItem._id}
                                    className='recent-plan-row'
                                    onClick={() => navigate(`/interview/${reportItem._id}`)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/interview/${reportItem._id}`); }}
                                >
                                    <div className='recent-plan-row__main'>
                                        <h3 className='recent-plan-row__title'>{reportItem.title || 'Untitled Position'}</h3>
                                        <span className='recent-plan-row__date'>
                                            {new Date(reportItem.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className='recent-plan-row__score'>
                                        <span className='recent-plan-row__digits'>{reportItem.matchScore ?? 0}%</span>
                                        <span className='recent-plan-row__label'>match</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default Home;
