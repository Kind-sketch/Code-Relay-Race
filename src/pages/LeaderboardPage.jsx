import Header from '../components/Header';
import TeamRow from '../components/TeamRow';
import { useTeams } from '../context/TeamContext';

export default function LeaderboardPage() {
    const { getRankedTeams, arePositionsLocked } = useTeams();
    const rankedTeams = getRankedTeams();

    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <h2 className="page-title">Leaderboard</h2>

                <div className="legend">
                    <div className="legend__item">
                        <span className="legend__color legend__color--q1"></span>
                        <span>Question 1</span>
                    </div>
                    <div className="legend__item">
                        <span className="legend__color legend__color--q2"></span>
                        <span>Question 2</span>
                    </div>
                    <div className="legend__item">
                        <span className="legend__color legend__color--q3"></span>
                        <span>Question 3</span>
                    </div>
                    <div className="legend__item">
                        <span className="legend__color legend__color--finished"></span>
                        <span>Finished</span>
                    </div>
                    {arePositionsLocked() && (
                        <div className="legend__item" style={{ marginLeft: 'auto', fontWeight: 600 }}>
                            🏆 Top 3 Locked
                        </div>
                    )}
                </div>

                {rankedTeams.length === 0 ? (
                    <div className="leaderboard__empty">
                        No teams registered yet.
                        <br />
                        <span style={{ fontSize: '0.875rem' }}>
                            Go to <a href="/admin" style={{ color: '#1E3A8A' }}>/admin</a> to add teams.
                        </span>
                    </div>
                ) : (
                    <div className="leaderboard">
                        <div className="leaderboard__header">
                            <span>Position</span>
                            <span>Team</span>
                        </div>
                        {rankedTeams.map((team, index) => (
                            <TeamRow
                                key={team.teamNumber}
                                team={team}
                                position={index + 1}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
