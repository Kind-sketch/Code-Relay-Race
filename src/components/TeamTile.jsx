import { useTeams } from '../context/TeamContext';

export default function TeamTile({ team }) {
    const { getQuestionColor } = useTeams();
    const colorClass = getQuestionColor(team);

    return (
        <div className={`team-tile team-tile--${colorClass}`}>
            <span className="team-tile__number">
                {team.teamNumber}
                {team.finishedAt && <span className="team-tile__finished-icon">✓</span>}
            </span>
        </div>
    );
}
