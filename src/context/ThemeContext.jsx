import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

const THEME_KEY = 'codeRelayRace_theme';

export const THEMES = {
    PROFESSIONAL: 'professional',
    NEON: 'neon'
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        const stored = localStorage.getItem(THEME_KEY);
        return stored || THEMES.PROFESSIONAL;
    });

    useEffect(() => {
        localStorage.setItem(THEME_KEY, theme);
        // Apply theme class to document root
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === THEMES.PROFESSIONAL ? THEMES.NEON : THEMES.PROFESSIONAL);
    };

    const value = {
        theme,
        setTheme,
        toggleTheme,
        isProfessional: theme === THEMES.PROFESSIONAL,
        isNeon: theme === THEMES.NEON
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
