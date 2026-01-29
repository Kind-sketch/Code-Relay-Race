# Code Relay Race

A real-time competition dashboard and leaderboard system designed for coding relay races. This application provides a live, interactive status board for tracking team progress across multiple stages, ensuring a professional and engaging experience for participants and spectators.

## 🚀 Features

### 📊 Live Views
- **Leaderboard (`/`)**: A ranked list of top performing teams, sorting finished teams first by time, then by progression. Top 3 positions lock automatically.
- **Stage Grid (`/grid`)**: A Kanban-style board showing teams distributed across three stages (Q1, Q2, Q3).
  - **Real-time Movement**: Watch teams animate smoothly between columns as they advance.
  - **Race-Based Ordering**: Teams are ordered by arrival time — the first to reach a stage appears at the top.
  - **Visual Themes**: Switch between **Professional Dashboard** (clean, solid colors) and **Neon Presentation Mode** (glowing, pill-shaped cards) for different display environments.
  - **Projector Optimized**: Responsive layout designed to scale from monitors to large projection screens.

### 🛠️ Admin Panel (`/admin`)
- **Secure Access**: PIN-protected control panel (Default PIN: `1234`).
- **Team Management**: Bulk add teams (e.g., `1-10` or `1,3,5`), remove teams, or reset the entire race.
- **Race Control**:
  - **Advance**: Move teams to the next question/stage.
  - **Finish**: Mark a team as finished when they complete the final stage.
- **Instant Sync**: All actions update instantly across all open tabs and views without refreshing.

## 🎨 Visual Identity
- **Dynamic Header**: Features a digital LED-style display font (`Orbitron`) for an event-grade feel.
- **Branding**: Integrated QuantumNique and C3 logos.
- **Responsive Handling**: The layout adapts intelligently to different screen widths, ensuring optimal visibility on any device.

## 🛠️ Tech Stack
- **Framework**: React + Vite
- **Styling**: Vanilla CSS with comprehensive Design Tokens (Variables)
- **State Management**: React Context API + LocalStorage for persistence
- **Sync**: Cross-tab synchronization via Storage Events

## 🏁 Getting Started

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Run Development Server**
    ```bash
    npm run dev
    ```

3.  **Build for Production**
    ```bash
    npm run build
    ```

## 📖 Usage Guide

1.  **Setup**: Open `/admin` and login. Use the "Add Teams" input to register teams (e.g., type `1-20` and add).
2.  **Display**: Open `/grid` or `/` (Leaderboard) on the main presentation screen/projector.
3.  **Run the Race**: As teams complete questions, use the Admin panel to "Advance" them.
    - **Q1 -> Q2**: Click "Advance" on a team in Stage 1.
    - **Q2 -> Q3**: Click "Advance" on a team in Stage 2.
    - **Finish**: Click "Finish" when a team completes Q3.
4.  **Theming**: Toggle the "✨/📊" button in the header to switch between Neon and Professional themes.

## 📂 Project Structure

- `src/pages/`: Main views (Leaderboard, Grid, Admin)
- `src/context/`: Global state management (`TeamContext`, `ThemeContext`)
- `src/components/`: Reusable UI components
- `src/index.css`: Global styles and theme definitions

---
Developed for **QuantumNique Solutions Pvt Ltd**.
