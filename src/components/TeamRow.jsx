import { useTeams } from '../context/TeamContext';

export default function TeamRow({ team, position }) {
    const { getQuestionColor } = useTeams();
    const colorClass = getQuestionColor(team);
    const isTop = position <= 3;

    return (
        <div className={`team-row team-row--${colorClass} ${isTop ? 'team-row--top' : ''}`}>
            <span className="team-row__position">#{position}</span>
            <span className="team-row__number">
                Team {team.teamNumber}
                {team.finishedAt && ' ✓'}
            </span>
        </div>
    );
}
