import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import Home from './pages/Home';
import Knowledge from './pages/Knowledge';
import Game from './pages/Game';
import ModeOverview from './pages/ModeOverview';
import Leaderboard from './pages/Leaderboard';
import BigFiveGame from './pages/BigFiveGame';
import BigFiveKnowledge from './pages/BigFiveKnowledge';
import CreaturesGame from './pages/CreaturesGame';
import CreaturesGallery from './pages/CreaturesGallery';
import CreaturesKnowledge from './pages/CreaturesKnowledge';
import MilestonesGame from './pages/MilestonesGame';
import MilestonesKnowledge from './pages/MilestonesKnowledge';
import OlderThanGame from './pages/OlderThanGame';
import OlderThanLeaderboard from './pages/OlderThanLeaderboard';
import Erfolge from './pages/Erfolge';
import Profil from './pages/Profil';
import BottomTabBar from './components/BottomTabBar';

const AuthenticatedApp = () => {
  // Render the main app
  return (
    <>
    <BottomTabBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/mode/:modeId" element={<ModeOverview />} />
      <Route path="/game/:modeId/:gameType" element={<Game />} />
      <Route path="/knowledge" element={<Knowledge />} />
      <Route path="/knowledge/:modeId" element={<Knowledge />} />
      <Route path="/leaderboard/:modeId" element={<Leaderboard />} />
      <Route path="/bigfive/knowledge" element={<BigFiveKnowledge />} />
      <Route path="/bigfive/:gameType" element={<BigFiveGame />} />
      <Route path="/creatures/knowledge" element={<CreaturesKnowledge />} />
      <Route path="/creatures/:gameType" element={<CreaturesGame />} />
      <Route path="/creatures/gallery" element={<CreaturesGallery />} />
      <Route path="/milestones/knowledge" element={<MilestonesKnowledge />} />
      <Route path="/milestones/:gameType" element={<MilestonesGame />} />
      <Route path="/olderthan/play" element={<OlderThanGame />} />
      <Route path="/leaderboard/olderthan" element={<OlderThanLeaderboard />} />
      <Route path="/erfolge" element={<Erfolge />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
    </>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App