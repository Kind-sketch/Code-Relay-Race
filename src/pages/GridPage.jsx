import Header from '../components/Header';
import { useTeams } from '../context/TeamContext';

export default function GridPage() {
    const { teams } = useTeams();

    // Filter teams by stage
    const stage1Teams = teams.filter(t => t.currentQuestion === 1 && !t.finishedAt);
    const stage2Teams = teams.filter(t => t.currentQuestion === 2 && !t.finishedAt);
    const stage3Teams = teams.filter(t => t.currentQuestion === 3 || t.finishedAt);
    const waitingTeams = teams.filter(t => t.currentQuestion === 0);

    // Sort by race progression (time-based, not team number)
    // Stage 1: sort by when they entered the race (lastProgressAt = when they started Q1)
    stage1Teams.sort((a, b) => {
        const aTime = a.lastProgressAt || a.createdAt || 0;
        const bTime = b.lastProgressAt || b.createdAt || 0;
        return aTime - bTime; // Earlier = first
    });

    // Stage 2: sort by when they reached Stage 2 (lastProgressAt)
    stage2Teams.sort((a, b) => {
        const aTime = a.lastProgressAt || 0;
        const bTime = b.lastProgressAt || 0;
        return aTime - bTime; // Earlier = first
    });

    // Stage 3: finished teams first (by finishedAt), then unfinished (by lastProgressAt)
    stage3Teams.sort((a, b) => {
        // Both finished - sort by finish time
        if (a.finishedAt && b.finishedAt) {
            return a.finishedAt - b.finishedAt;
        }
        // Finished teams come first
        if (a.finishedAt) return -1;
        if (b.finishedAt) return 1;
        // Neither finished - sort by progress time
        const aTime = a.lastProgressAt || 0;
        const bTime = b.lastProgressAt || 0;
        return aTime - bTime;
    });

    // Waiting: sort by creation time (order added)
    waitingTeams.sort((a, b) => {
        const aTime = a.createdAt || 0;
        const bTime = b.createdAt || 0;
        return aTime - bTime;
    });

    return (
        <div className="app">
            <Header />
            <main className="main-content main-content--wide">
                <div className="stage-header">
                    <div className="stage-header__left">
                        <h2 className="page-title">Race Status Board</h2>
                        <div className="stage-stats">
                            <span className="stage-stat">
                                <strong>{teams.length}</strong> Teams
                            </span>
                            <span className="stage-stat stage-stat--waiting">
                                <strong>{waitingTeams.length}</strong> Waiting
                            </span>
                            <span className="stage-stat stage-stat--q1">
                                <strong>{stage1Teams.length}</strong> Stage 1
                            </span>
                            <span className="stage-stat stage-stat--q2">
                                <strong>{stage2Teams.length}</strong> Stage 2
                            </span>
                            <span className="stage-stat stage-stat--q3">
                                <strong>{stage3Teams.length}</strong> Stage 3
                            </span>
                        </div>
                    </div>
                    <img src="/logo.png" alt="C3 Logo" className="stage-header__logo" />
                </div>

                {teams.length === 0 ? (
                    <div className="leaderboard__empty">
                        No teams registered yet.
                        <br />
                        <span style={{ fontSize: '0.875rem' }}>
                            Go to <a href="/admin" style={{ color: '#1E3A8A' }}>/admin</a> to add teams.
                        </span>
                    </div>
                ) : (
                    <div className="stage-board">
                        {/* Stage 1 - Question 1 */}
                        <div className="stage-column">
                            <div className="stage-column__header stage-column__header--q1">
                                <span className="stage-column__title">Stage 1</span>
                                <span className="stage-column__subtitle">Question 1</span>
                                <span className="stage-column__count">{stage1Teams.length} teams</span>
                            </div>
                            <div className="stage-column__content">
                                {stage1Teams.map(team => (
                                    <div key={team.teamNumber} className="stage-tile stage-tile--q1">
                                        <span className="stage-tile__number">Team {team.teamNumber}</span>
                                    </div>
                                ))}
                                {stage1Teams.length === 0 && (
                                    <div className="stage-column__empty">No teams</div>
                                )}
                            </div>
                        </div>

                        {/* Stage 2 - Question 2 */}
                        <div className="stage-column">
                            <div className="stage-column__header stage-column__header--q2">
                                <span className="stage-column__title">Stage 2</span>
                                <span className="stage-column__subtitle">Question 2</span>
                                <span className="stage-column__count">{stage2Teams.length} teams</span>
                            </div>
                            <div className="stage-column__content">
                                {stage2Teams.map(team => (
                                    <div key={team.teamNumber} className="stage-tile stage-tile--q2">
                                        <span className="stage-tile__number">Team {team.teamNumber}</span>
                                    </div>
                                ))}
                                {stage2Teams.length === 0 && (
                                    <div className="stage-column__empty">No teams</div>
                                )}
                            </div>
                        </div>

                        {/* Stage 3 - Question 3 */}
                        <div className="stage-column">
                            <div className="stage-column__header stage-column__header--q3">
                                <span className="stage-column__title">Stage 3</span>
                                <span className="stage-column__subtitle">Question 3</span>
                                <span className="stage-column__count">{stage3Teams.length} teams</span>
                            </div>
                            <div className="stage-column__content">
                                {stage3Teams.map(team => (
                                    <div
                                        key={team.teamNumber}
                                        className={`stage-tile stage-tile--q3 ${team.finishedAt ? 'stage-tile--finished' : ''}`}
                                    >
                                        <span className="stage-tile__number">Team {team.teamNumber}</span>
                                        {team.finishedAt && <span className="stage-tile__check">✓</span>}
                                    </div>
                                ))}
                                {stage3Teams.length === 0 && (
                                    <div className="stage-column__empty">No teams</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Waiting Teams Section */}
                {waitingTeams.length > 0 && (
                    <div className="waiting-section">
                        <h3 className="waiting-section__title">Waiting to Start ({waitingTeams.length})</h3>
                        <div className="waiting-grid">
                            {waitingTeams.map(team => (
                                <div key={team.teamNumber} className="waiting-tile">
                                    Team {team.teamNumber}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
