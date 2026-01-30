import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const TeamContext = createContext(null);

const STORAGE_KEY = 'codeRelayRace_teams';
const LOCKED_KEY = 'codeRelayRace_lockedPositions';

export function TeamProvider({ children }) {
    const [teams, setTeams] = useState(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    });

    const [lockedPositions, setLockedPositions] = useState(() => {
        const stored = localStorage.getItem(LOCKED_KEY);
        return stored ? JSON.parse(stored) : { 1: null, 2: null, 3: null };
    });

    // Persist teams to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(teams));
    }, [teams]);

    // Persist locked positions to localStorage
    useEffect(() => {
        localStorage.setItem(LOCKED_KEY, JSON.stringify(lockedPositions));
    }, [lockedPositions]);

    // Cross-tab synchronization: Listen for storage changes from other tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === STORAGE_KEY && e.newValue) {
                try {
                    const newTeams = JSON.parse(e.newValue);
                    setTeams(newTeams);
                } catch (err) {
                    console.error('Failed to parse teams from storage:', err);
                }
            }
            if (e.key === LOCKED_KEY && e.newValue) {
                try {
                    const newLocked = JSON.parse(e.newValue);
                    setLockedPositions(newLocked);
                } catch (err) {
                    console.error('Failed to parse locked positions from storage:', err);
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    // Add a single team
    const addTeam = useCallback((teamNumber) => {
        const num = parseInt(teamNumber, 10);
        if (isNaN(num) || num <= 0) return false;

        // Check if team already exists
        if (teams.some(t => t.teamNumber === num)) return false;

        const newTeam = {
            teamNumber: num,
            currentQuestion: 0, // 0 = waiting, 1-3 = questions
            createdAt: Date.now(),
            lastProgressAt: null,
            finishedAt: null
        };

        setTeams(prev => [...prev, newTeam]);
        return true;
    }, [teams]);

    // Add multiple teams (comma-separated or range)
    const addTeamsBulk = useCallback((input) => {
        const numbers = [];
        const parts = input.split(',').map(p => p.trim());

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(n => parseInt(n.trim(), 10));
                if (!isNaN(start) && !isNaN(end) && start <= end) {
                    for (let i = start; i <= end; i++) {
                        numbers.push(i);
                    }
                }
            } else {
                const num = parseInt(part, 10);
                if (!isNaN(num) && num > 0) {
                    numbers.push(num);
                }
            }
        }

        // Filter out existing teams
        const existingNumbers = new Set(teams.map(t => t.teamNumber));
        const newNumbers = [...new Set(numbers)].filter(n => !existingNumbers.has(n));

        const now = Date.now();
        const newTeams = newNumbers.map((num, index) => ({
            teamNumber: num,
            currentQuestion: 0,
            createdAt: now + index, // Slight offset to preserve order
            lastProgressAt: null,
            finishedAt: null
        }));

        if (newTeams.length > 0) {
            setTeams(prev => [...prev, ...newTeams]);
        }

        return newTeams.length;
    }, [teams]);

    // Remove a team
    const removeTeam = useCallback((teamNumber) => {
        setTeams(prev => prev.filter(t => t.teamNumber !== teamNumber));
    }, []);

    // Advance team to next question
    const advanceTeam = useCallback((teamNumber) => {
        setTeams(prev => prev.map(team => {
            if (team.teamNumber !== teamNumber) return team;
            if (team.finishedAt) return team; // Already finished
            if (team.currentQuestion >= 3) return team; // Already at Q3

            return {
                ...team,
                currentQuestion: team.currentQuestion + 1,
                lastProgressAt: Date.now()
            };
        }));
    }, []);

    // Mark team as finished (only from Q3)
    const finishTeam = useCallback((teamNumber) => {
        setTeams(prev => {
            const updated = prev.map(team => {
                if (team.teamNumber !== teamNumber) return team;
                if (team.currentQuestion !== 3) return team; // Must be at Q3
                if (team.finishedAt) return team; // Already finished

                return {
                    ...team,
                    finishedAt: Date.now()
                };
            });

            // Check if we need to lock positions
            const finishedTeams = updated
                .filter(t => t.finishedAt)
                .sort((a, b) => a.finishedAt - b.finishedAt);

            if (finishedTeams.length >= 3) {
                // Lock the top 3 positions if not already locked
                setLockedPositions(currentLocked => {
                    const newLocked = { ...currentLocked };
                    for (let i = 0; i < 3; i++) {
                        if (!newLocked[i + 1] && finishedTeams[i]) {
                            newLocked[i + 1] = finishedTeams[i].teamNumber;
                        }
                    }
                    return newLocked;
                });
            }

            return updated;
        });
    }, []);

    // Start all waiting teams (move from Q0 to Q1)
    const startAllTeams = useCallback(() => {
        setTeams(prev => prev.map(team => {
            if (team.currentQuestion !== 0) return team; // Only affect waiting teams

            return {
                ...team,
                currentQuestion: 1,
                lastProgressAt: Date.now()
            };
        }));
    }, []);

    // Get ranked teams for leaderboard
    const getRankedTeams = useCallback(() => {
        const teamsCopy = [...teams];

        // Sort: finished first (by finishedAt), then by currentQuestion (desc), then by lastProgressAt (asc)
        teamsCopy.sort((a, b) => {
            // Both finished - sort by finish time
            if (a.finishedAt && b.finishedAt) {
                return a.finishedAt - b.finishedAt;
            }
            // Only a finished
            if (a.finishedAt) return -1;
            // Only b finished
            if (b.finishedAt) return 1;

            // Neither finished - sort by question (higher = better)
            if (a.currentQuestion !== b.currentQuestion) {
                return b.currentQuestion - a.currentQuestion;
            }

            // Same question - sort by progress time (earlier = better)
            if (a.lastProgressAt && b.lastProgressAt) {
                return a.lastProgressAt - b.lastProgressAt;
            }
            if (a.lastProgressAt) return -1;
            if (b.lastProgressAt) return 1;

            // Neither has progressed - sort by team number
            return a.teamNumber - b.teamNumber;
        });

        // Apply locked positions - move locked teams to their positions
        const lockedTeamNumbers = Object.values(lockedPositions).filter(Boolean);

        if (lockedTeamNumbers.length > 0) {
            // Remove locked teams from sorted list
            const unlockedTeams = teamsCopy.filter(t => !lockedTeamNumbers.includes(t.teamNumber));
            const result = [];

            // Place locked teams in their positions
            for (let pos = 1; pos <= 3; pos++) {
                const lockedNumber = lockedPositions[pos];
                if (lockedNumber) {
                    const lockedTeam = teams.find(t => t.teamNumber === lockedNumber);
                    if (lockedTeam) {
                        result.push(lockedTeam);
                    }
                }
            }

            // Add remaining teams after locked ones
            return [...result, ...unlockedTeams.filter(t => !result.includes(t))];
        }

        return teamsCopy;
    }, [teams, lockedPositions]);

    // Get all teams in original order (for grid view)
    const getTeamsInOrder = useCallback(() => {
        return [...teams].sort((a, b) => a.teamNumber - b.teamNumber);
    }, [teams]);

    // Get question color class
    const getQuestionColor = useCallback((team) => {
        if (team.finishedAt) return 'finished';
        if (team.currentQuestion === 0) return 'waiting';
        return `q${team.currentQuestion}`;
    }, []);

    // Get finished count
    const getFinishedCount = useCallback(() => {
        return teams.filter(t => t.finishedAt).length;
    }, [teams]);

    // Check if top 3 are locked
    const arePositionsLocked = useCallback(() => {
        return Object.values(lockedPositions).filter(Boolean).length >= 3;
    }, [lockedPositions]);

    // Reset all data
    const resetAll = useCallback(() => {
        setTeams([]);
        setLockedPositions({ 1: null, 2: null, 3: null });
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LOCKED_KEY);
    }, []);

    const value = {
        teams,
        addTeam,
        addTeamsBulk,
        removeTeam,
        advanceTeam,
        finishTeam,
        startAllTeams,
        getRankedTeams,
        getTeamsInOrder,
        getQuestionColor,
        getFinishedCount,
        arePositionsLocked,
        lockedPositions,
        resetAll
    };

    return (
        <TeamContext.Provider value={value}>
            {children}
        </TeamContext.Provider>
    );
}

export function useTeams() {
    const context = useContext(TeamContext);
    if (!context) {
        throw new Error('useTeams must be used within a TeamProvider');
    }
    return context;
}
