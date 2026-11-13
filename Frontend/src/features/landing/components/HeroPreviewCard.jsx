const HeroPreviewCard = () => {
    return (
        <aside className="hero-preview" aria-label="Product interface preview">
            <div className="preview-card">
                {/* Station card top label */}
                <div className="preview-card__header">
                    <div className="preview-card__badge">Strategy report preview</div>
                    <span className="preview-card__meta">Sample output</span>
                </div>

                {/* Score & Gaps summary row */}
                <div className="preview-card__summary">
                    <div className="preview-card__score">
                        <div className="preview-card__score-ring score--high">
                            <span className="preview-card__score-value">92</span>
                            <span className="preview-card__score-pct">%</span>
                        </div>
                        <div className="preview-card__score-info">
                            <span className="preview-card__score-title">Match score</span>
                            <span className="preview-card__score-desc">Strong match for this role</span>
                        </div>
                    </div>

                    <div className="preview-card__gaps">
                        <span className="preview-card__gaps-label">Skill gaps</span>
                        <div className="preview-card__gap-tags">
                            <span className="skill-tag skill-tag--medium">Cloud Infrastructure</span>
                            <span className="skill-tag skill-tag--low">System Scalability</span>
                        </div>
                    </div>
                </div>

                {/* Question rows */}
                <div className="preview-card__questions">
                    {/* Q1 Technical */}
                    <div className="preview-card__q-item">
                        <div className="preview-card__q-head">
                            <span className="preview-card__q-index">Q1</span>
                            <span className="preview-card__q-type">Technical</span>
                            <p className="preview-card__q-text">
                                How do you handle optimistic concurrency and data reconciliation in distributed pipelines?
                            </p>
                        </div>
                        <div className="preview-card__q-detail">
                            <span className="q-card__tag q-card__tag--intention">Intention</span>
                            <p className="preview-card__q-note">
                                Evaluates distributed systems consistency models and failure handling experience.
                            </p>
                        </div>
                    </div>

                    {/* Q2 Behavioral */}
                    <div className="preview-card__q-item">
                        <div className="preview-card__q-head">
                            <span className="preview-card__q-index">Q2</span>
                            <span className="preview-card__q-type">Behavioral</span>
                            <p className="preview-card__q-text">
                                Describe a project where unexpected scope changes threatened delivery deadlines.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Bottom miniature download pill */}
                <div className="preview-card__footer">
                    <div className="preview-card__ats-pill">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                        </svg>
                        <span>ATS resume generated</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default HeroPreviewCard;
