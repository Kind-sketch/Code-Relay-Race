import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminAuth from '../components/AdminAuth';
import { useTeams } from '../context/TeamContext';

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [singleTeamInput, setSingleTeamInput] = useState('');
    const [bulkTeamInput, setBulkTeamInput] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });

    const {
        teams,
        addTeam,
        addTeamsBulk,
        removeTeam,
        advanceTeam,
        finishTeam,
        startAllTeams,
        getQuestionColor,
        getFinishedCount,
        arePositionsLocked,
        lockedPositions,
        resetAll
    } = useTeams();

    useEffect(() => {
        const auth = sessionStorage.getItem('adminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const showMessage = (text, type = 'success') => {
        setMessage({ text, type });
        setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    };

    const handleAddSingle = (e) => {
        e.preventDefault();
        if (addTeam(singleTeamInput)) {
            showMessage(`Team ${singleTeamInput} added`);
            setSingleTeamInput('');
        } else {
            showMessage('Invalid or duplicate team number', 'error');
        }
    };

    const handleAddBulk = (e) => {
        e.preventDefault();
        const count = addTeamsBulk(bulkTeamInput);
        if (count > 0) {
            showMessage(`${count} teams added`);
            setBulkTeamInput('');
        } else {
            showMessage('No valid teams to add', 'error');
        }
    };

    const handleStartAll = () => {
        if (window.confirm('Are you sure you want to START the race for ALL waiting teams?')) {
            startAllTeams();
            showMessage('Race started for all waiting teams!');
        }
    };

    const handleReset = () => {
        if (window.confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            resetAll();
            showMessage('All data reset');
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('adminAuth');
        setIsAuthenticated(false);
    };

    const getStatusLabel = (team) => {
        if (team.finishedAt) return 'Finished';
        if (team.currentQuestion === 0) return 'Waiting';
        return `Q${team.currentQuestion}`;
    };

    if (!isAuthenticated) {
        return (
            <div className="app">
                <header className="header">
                    <h1 className="header__title">Code Relay Race</h1>
                    <nav className="header__nav">
                        <Link to="/" className="header__link">← Back to Leaderboard</Link>
                    </nav>
                </header>
                <main className="main-content">
                    <AdminAuth onAuthenticated={() => setIsAuthenticated(true)} />
                </main>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="header">
                <h1 className="header__title">Code Relay Race — Admin</h1>
                <nav className="header__nav">
                    <Link to="/" className="header__link">Leaderboard</Link>
                    <Link to="/grid" className="header__link">Grid</Link>
                    <button onClick={handleLogout} className="btn btn--secondary btn--small">
                        Logout
                    </button>
                </nav>
            </header>

            <main className="main-content">
                <div className="admin-panel">
                    {/* Status Bar */}
                    <div style={{
                        display: 'flex',
                        gap: '2rem',
                        padding: '1rem 1.5rem',
                        background: '#F9FAFB',
                        borderRadius: '0.75rem',
                        fontSize: '0.875rem'
                    }}>
                        <div><strong>Total Teams:</strong> {teams.length}</div>
                        <div><strong>Finished:</strong> {getFinishedCount()}</div>
                        <div><strong>Top 3 Locked:</strong> {arePositionsLocked() ? 'Yes ✓' : 'No'}</div>
                        {arePositionsLocked() && (
                            <div style={{ marginLeft: 'auto' }}>
                                🏆 1st: Team {lockedPositions[1]} |
                                🥈 2nd: Team {lockedPositions[2]} |
                                🥉 3rd: Team {lockedPositions[3]}
                            </div>
                        )}
                    </div>

                    {/* Message */}
                    {message.text && (
                        <div style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '0.5rem',
                            background: message.type === 'error' ? '#FEE2E2' : '#D1FAE5',
                            color: message.type === 'error' ? '#DC2626' : '#059669',
                            fontWeight: 500
                        }}>
                            {message.text}
                        </div>
                    )}

                    {/* Add Teams Section */}
                    <section className="admin-section">
                        <h3 className="admin-section__title">Add Teams</h3>

                        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                            {/* Single Team */}
                            <form onSubmit={handleAddSingle} className="add-team-form" style={{ flex: 1 }}>
                                <input
                                    type="number"
                                    className="add-team-form__input"
                                    placeholder="Team number (e.g., 5)"
                                    value={singleTeamInput}
                                    onChange={(e) => setSingleTeamInput(e.target.value)}
                                    min="1"
                                />
                                <button type="submit" className="btn btn--primary">
                                    Add Team
                                </button>
                            </form>

                            {/* Bulk Add */}
                            <form onSubmit={handleAddBulk} className="add-team-form" style={{ flex: 1 }}>
                                <input
                                    type="text"
                                    className="add-team-form__input"
                                    placeholder="Bulk add (e.g., 1-10 or 1,2,5,8)"
                                    value={bulkTeamInput}
                                    onChange={(e) => setBulkTeamInput(e.target.value)}
                                />
                                <button type="submit" className="btn btn--primary">
                                    Bulk Add
                                </button>
                            </form>
                        </div>
                    </section>

                    {/* Teams Table */}
                    <section className="admin-section">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 className="admin-section__title" style={{ marginBottom: 0 }}>Manage Teams ({teams.length})</h3>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button
                                    onClick={handleStartAll}
                                    className="btn btn--primary btn--small"
                                    style={{ backgroundColor: '#10B981' }} // Green color for start
                                >
                                    ▶ Start All
                                </button>
                                <button onClick={handleReset} className="btn btn--danger btn--small">
                                    Reset All
                                </button>
                            </div>
                        </div>

                        {teams.length === 0 ? (
                            <p style={{ color: '#6B7280', textAlign: 'center', padding: '2rem' }}>
                                No teams added yet. Use the form above to add teams.
                            </p>
                        ) : (
                            <table className="admin-team-table">
                                <thead>
                                    <tr>
                                        <th>Team</th>
                                        <th>Status</th>
                                        <th>Progress Time</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[...teams].sort((a, b) => a.teamNumber - b.teamNumber).map((team) => (
                                        <tr key={team.teamNumber}>
                                            <td>
                                                <strong>Team {team.teamNumber}</strong>
                                            </td>
                                            <td>
                                                <span className={`status-badge status-badge--${getQuestionColor(team)}`}>
                                                    {getStatusLabel(team)}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '0.875rem', color: '#6B7280' }}>
                                                {team.finishedAt
                                                    ? `Finished at ${new Date(team.finishedAt).toLocaleTimeString()}`
                                                    : team.lastProgressAt
                                                        ? `Last progress: ${new Date(team.lastProgressAt).toLocaleTimeString()}`
                                                        : '—'
                                                }
                                            </td>
                                            <td>
                                                <div className="admin-team-table__actions">
                                                    {!team.finishedAt && team.currentQuestion < 3 && (
                                                        <button
                                                            onClick={() => advanceTeam(team.teamNumber)}
                                                            className="btn btn--advance btn--small"
                                                        >
                                                            {team.currentQuestion === 0 ? 'Start Q1' : `→ Q${team.currentQuestion + 1}`}
                                                        </button>
                                                    )}
                                                    {team.currentQuestion === 3 && !team.finishedAt && (
                                                        <button
                                                            onClick={() => finishTeam(team.teamNumber)}
                                                            className="btn btn--finish btn--small"
                                                        >
                                                            ✓ Finish
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm(`Remove Team ${team.teamNumber}?`)) {
                                                                removeTeam(team.teamNumber);
                                                            }
                                                        }}
                                                        className="btn btn--secondary btn--small"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
