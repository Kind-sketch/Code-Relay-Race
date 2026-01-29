import { NavLink } from 'react-router-dom';
import { useTheme, THEMES } from '../context/ThemeContext';

export default function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="header">
            <div className="header__brand">
                <img src="/quantumnique-logo.png" alt="QuantumNique" className="header__logo" />
            </div>
            <h1 className="header__title">Code Relay Race</h1>
            <nav className="header__nav">
                <NavLink
                    to="/"
                    className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
                >
                    Leaderboard
                </NavLink>
                <NavLink
                    to="/grid"
                    className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
                >
                    Grid
                </NavLink>
                <button className="theme-switcher" onClick={toggleTheme}>
                    <span className="theme-switcher__icon">
                        {theme === THEMES.PROFESSIONAL ? '✨' : '📊'}
                    </span>
                    <span className="theme-switcher__label">
                        {theme === THEMES.PROFESSIONAL ? 'Neon' : 'Pro'}
                    </span>
                </button>
            </nav>
        </header>
    );
}
