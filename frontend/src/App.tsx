import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import ModelAnalysis from './pages/ModelAnalysis';
import Methodology from './pages/Methodology';
import type { PredictionResponse } from './types';

function App() {
  const [currentPage, setCurrentPage] = useState<'dashboard' | 'analysis' | 'methodology'>('dashboard');
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard data={predictionData} onDataUpdate={setPredictionData} />;
      case 'analysis':
        return <ModelAnalysis data={predictionData} />;
      case 'methodology':
        return <Methodology />;
      default:
        return <Dashboard data={predictionData} onDataUpdate={setPredictionData} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-text">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1">
        {renderPage()}
      </main>
      <footer className="py-6 text-center text-xs text-muted border-t border-border mt-12">
        <p>Educational machine-learning project. Predictions are estimates based on historical market data and should not be considered financial advice.</p>
      </footer>
    </div>
  );
}

export default App;
