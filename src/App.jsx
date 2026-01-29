import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TeamProvider } from './context/TeamContext';
import { ThemeProvider } from './context/ThemeContext';
import LeaderboardPage from './pages/LeaderboardPage';
import GridPage from './pages/GridPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <ThemeProvider>
      <TeamProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LeaderboardPage />} />
            <Route path="/grid" element={<GridPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </BrowserRouter>
      </TeamProvider>
    </ThemeProvider>
  );
}

export default App;
