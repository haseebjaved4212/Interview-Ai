import { useState, useEffect, useRef } from 'react';

const ROTATING_STAGES = [
    "Reading the job description",
    "Mapping your profile",
    "Drafting questions",
    "Calibrating preparation roadmap"
];

const WorkflowSection = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const sectionRef = useRef(null);
    const [pathLength, setPathLength] = useState(1000);
    const [scrollOffset, setScrollOffset] = useState(1000);
    const pathRef = useRef(null);

    // Rotate analysis stage label for Step 2
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentStage(prev => (prev + 1) % ROTATING_STAGES.length);
        }, 2800);
        return () => clearInterval(timer);
    }, []);

    // Scroll-drawn connector path
    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);
            setScrollOffset(length);
        }

        const handleScroll = () => {
            if (!sectionRef.current || !pathRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Compute how far through the section the user has scrolled
            const totalDistance = rect.height + windowHeight * 0.5;
            const currentPosition = windowHeight - rect.top;
            const progress = Math.max(0, Math.min(1, currentPosition / totalDistance));

            const length = pathRef.current.getTotalLength();
            const newOffset = length * (1 - progress);
            setScrollOffset(newOffset);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section id="how-it-works" ref={sectionRef} className="workflow-section" aria-labelledby="workflow-title">
            <div className="landing-container">
                <header className="workflow-header">
                    <span className="workflow-tag">Methodology</span>
                    <h2 id="workflow-title" className="workflow-title">
                        How it works
                    </h2>
                    <p className="workflow-subtitle">
                        From raw job description to a comprehensive, calibrated interview execution plan.
                    </p>
                </header>

                <div className="workflow-timeline">
                    {/* SVG Connector Spine */}
                    <div className="workflow-svg-wrap" aria-hidden="true">
                        <svg className="workflow-svg" viewBox="0 0 100 1200" preserveAspectRatio="none">
                            <path
                                ref={pathRef}
                                className="workflow-path"
                                d="M 50,20 L 50,1180"
                                style={{
                                    strokeDasharray: pathLength,
                                    strokeDashoffset: scrollOffset
                                }}
                            />
                        </svg>
                    </div>

                    {/* Step 1: You provide the input */}
                    <div className="workflow-step workflow-step--1">
                        <div className="workflow-step__marker">
                            <span className="workflow-step__num">1</span>
                        </div>
                        <div className="workflow-step__body">
                            <h3 className="workflow-step__title">You provide the input</h3>
                            <p className="workflow-step__desc">
                                Paste the target job posting and supply your background through a resume upload or a direct self description.
                            </p>

                            <div className="step-input-cards">
                                {/* Job Description Card */}
                                <div className="step-card step-card--textarea">
                                    <div className="step-card__label">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                                        </svg>
                                        <span>Target Job Description</span>
                                    </div>
                                    <div className="step-card__text-preview">
                                        Senior Frontend Engineer: proficiency with React, distributed state, performance profiling...
                                    </div>
                                </div>

                                <div className="step-input-divider">
                                    <span className="step-input-divider__tag">OR</span>
                                </div>

                                {/* Resume Upload Card */}
                                <div className="step-card step-card--upload">
                                    <div className="step-card__label">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        <span>Resume Dropzone (PDF or DOCX)</span>
                                    </div>
                                    <p className="step-card__subtext">Upload file or enter self description</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2: HireCraft reads both sides */}
                    <div className="workflow-step workflow-step--2">
                        <div className="workflow-step__marker">
                            <span className="workflow-step__num">2</span>
                        </div>
                        <div className="workflow-step__body">
                            <h3 className="workflow-step__title">HireCraft reads both sides</h3>
                            <p className="workflow-step__desc">
                                Two streams of information flow into a centralized calibrated engine, identifying role requirements and comparing experience vectors.
                            </p>

                            <div className="step-stream-visual">
                                <div className="step-stream__inputs">
                                    <div className="step-stream__node step-stream__node--left">
                                        <span className="step-stream__dot" />
                                        <span>Job Requirements</span>
                                    </div>
                                    <div className="step-stream__node step-stream__node--right">
                                        <span className="step-stream__dot" />
                                        <span>Your Profile</span>
                                    </div>
                                </div>

                                <div className="step-stream__connector">
                                    <span className="step-stream__arrow">↓</span>
                                </div>

                                {/* Central calibrated node with live rotating stage labels */}
                                <div className="step-engine-node">
                                    <div className="step-engine-node__pulse" />
                                    <div className="step-engine-node__badge">Analyzing Dual Vectors</div>
                                    <div className="step-engine-node__stage" key={currentStage}>
                                        {ROTATING_STAGES[currentStage]}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: AI builds your strategy */}
                    <div className="workflow-step workflow-step--3">
                        <div className="workflow-step__marker">
                            <span className="workflow-step__num">3</span>
                        </div>
                        <div className="workflow-step__body">
                            <h3 className="workflow-step__title">AI builds your strategy</h3>
                            <p className="workflow-step__desc">
                                Inquiries, roadmaps, and score analysis fan out into clear, actionable candidate assets.
                            </p>

                            <div className="step-output-fan">
                                <div className="fan-card fan-card--1">
                                    <span className="fan-card__tag fan-card__tag--cobalt">Technical Questions</span>
                                    <span className="fan-card__detail">Core concepts and code patterns</span>
                                </div>
                                <div className="fan-card fan-card--2">
                                    <span className="fan-card__tag fan-card__tag--cobalt">Behavioral Questions</span>
                                    <span className="fan-card__detail">Leadership and conflict scenarios</span>
                                </div>
                                <div className="fan-card fan-card--3">
                                    <span className="fan-card__tag fan-card__tag--butter">Preparation Road Map</span>
                                    <span className="fan-card__detail">Milestones organized day by day</span>
                                </div>
                                <div className="fan-card fan-card--4">
                                    <span className="fan-card__tag fan-card__tag--sage">Match Score</span>
                                    <span className="fan-card__detail">Percentage alignment indicator</span>
                                </div>
                                <div className="fan-card fan-card--5">
                                    <span className="fan-card__tag fan-card__tag--terracotta">Skill Gaps</span>
                                    <span className="fan-card__detail">Prioritized missing competencies</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4: You prepare and apply */}
                    <div className="workflow-step workflow-step--4">
                        <div className="workflow-step__marker">
                            <span className="workflow-step__num">4</span>
                        </div>
                        <div className="workflow-step__body">
                            <h3 className="workflow-step__title">You prepare and apply</h3>
                            <p className="workflow-step__desc">
                                Review questions with intentional rationale and model answers, then export an ATS friendly PDF resume tailored specifically to the opportunity.
                            </p>

                            <div className="step-final-preview">
                                <div className="step-preview-q">
                                    <div className="step-preview-q__header">
                                        <span className="step-preview-q__badge">Technical Question</span>
                                        <p className="step-preview-q__title">
                                            How do you handle memory leaks and DOM cleanup in high throughput SPAs?
                                        </p>
                                    </div>
                                    <div className="step-preview-q__section">
                                        <span className="q-card__tag q-card__tag--intention">Intention</span>
                                        <p className="step-preview-q__text">
                                            Tests familiarity with heap profiling, detached DOM elements, and long-lived observer cleanup.
                                        </p>
                                    </div>
                                    <div className="step-preview-q__section">
                                        <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                                        <p className="step-preview-q__text">
                                            Isolate subscriptions in useEffect cleanup hooks, utilize WeakMap for cache boundaries, and verify garbage collection via browser devtools memory timelines.
                                        </p>
                                    </div>
                                </div>

                                <div className="step-preview-pdf">
                                    <div className="step-preview-pdf__icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <polyline points="14 2 14 8 20 8" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                    </div>
                                    <div className="step-preview-pdf__info">
                                        <span className="step-preview-pdf__title">ATS Friendly Resume</span>
                                        <span className="step-preview-pdf__desc">Clean typographic PDF structured for recruitment parsers</span>
                                    </div>
                                    <div className="button primary-button step-preview-pdf__btn">
                                        Download Resume
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default WorkflowSection;
