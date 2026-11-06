const FeaturesSection = () => {
    return (
        <section id="features" className="features-section" aria-labelledby="features-title">
            <div className="landing-container">
                <header className="features-header">
                    <span className="features-tag">Capabilities</span>
                    <h2 id="features-title" className="features-title">
                        Everything needed to prepare with clarity
                    </h2>
                    <p className="features-subtitle">
                        Every feature exists to transform ambiguity into a structured, executable interview plan.
                    </p>
                </header>

                <div className="features-grid">
                    {/* Feature 1: Large Featured Card (Technical & Behavioral Questions) */}
                    <div className="feature-card feature-card--large">
                        <div className="feature-card__content">
                            <span className="feature-card__tag">Core Analysis</span>
                            <h3 className="feature-card__heading">
                                Technical and Behavioral Questions
                            </h3>
                            <p className="feature-card__copy">
                                Detailed questions tailored to the target role with the specific interviewer intention behind each inquiry.
                            </p>
                            <p className="feature-card__copy">
                                Every question includes a complete model answer to guide your preparation and delivery.
                            </p>
                        </div>
                        <div className="feature-card__visual">
                            <div className="feature-mini-preview">
                                <div className="feature-mini-preview__item">
                                    <span className="q-card__tag q-card__tag--intention">Intention</span>
                                    <span className="feature-mini-preview__text">Evaluates architectural trade-offs and failure mitigation.</span>
                                </div>
                                <div className="feature-mini-preview__item">
                                    <span className="q-card__tag q-card__tag--answer">Model Answer</span>
                                    <span className="feature-mini-preview__text">Structured response with concrete metrics and lessons learned.</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Feature 2: Match Score */}
                    <div className="feature-card feature-card--medium">
                        <span className="feature-card__tag">Alignment</span>
                        <h3 className="feature-card__heading">
                            Role Match Score
                        </h3>
                        <p className="feature-card__copy">
                            An objective percentage score assessing alignment between your profile and role requirements.
                        </p>
                        <p className="feature-card__copy">
                            Quickly identify whether an opportunity represents a strong match or demands intensive preparation.
                        </p>
                    </div>

                    {/* Feature 3: Skill Gaps */}
                    <div className="feature-card feature-card--medium">
                        <span className="feature-card__tag">Diagnostics</span>
                        <h3 className="feature-card__heading">
                            Skill Gap Analysis
                        </h3>
                        <p className="feature-card__copy">
                            Clear indicators highlighting missing competencies, tools, and technical areas.
                        </p>
                        <p className="feature-card__copy">
                            Severity tags prioritize which deficiencies to address first before interview day.
                        </p>
                    </div>

                    {/* Feature 4: Day by Day Roadmap */}
                    <div className="feature-card feature-card--medium">
                        <span className="feature-card__tag">Execution</span>
                        <h3 className="feature-card__heading">
                            Day by Day Preparation Roadmap
                        </h3>
                        <p className="feature-card__copy">
                            A structured multi-day timeline breaking preparation into manageable milestones.
                        </p>
                        <p className="feature-card__copy">
                            Focus daily on high priority topics, mock reviews, and delivery practice.
                        </p>
                    </div>

                    {/* Feature 5: ATS Friendly Resume */}
                    <div className="feature-card feature-card--medium">
                        <span className="feature-card__tag">Export</span>
                        <h3 className="feature-card__heading">
                            ATS Friendly Resume
                        </h3>
                        <p className="feature-card__copy">
                            Generate and export a clean PDF resume tailored to the target job description.
                        </p>
                        <p className="feature-card__copy">
                            Formatted for readability and recruitment parsing systems without fragile layouts.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
