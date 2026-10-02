import { LineChart, Activity } from 'lucide-react';
import clsx from 'clsx';

interface NavbarProps {
  currentPage: 'dashboard' | 'analysis' | 'methodology';
  onNavigate: (page: 'dashboard' | 'analysis' | 'methodology') => void;
}

export default function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <span className="text-xl font-bold tracking-tight text-navy flex items-center gap-2">
              <Activity className="w-6 h-6 text-primary" />
              Alpha<span className="text-primary">Predict</span>
            </span>
          </div>
          
          <div className="hidden md:flex space-x-2">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'analysis', label: 'Model Analysis' },
              { id: 'methodology', label: 'Methodology' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id as any)}
                className={clsx(
                  "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                  currentPage === item.id 
                    ? "text-primary bg-primary/10" 
                    : "text-neutral hover:text-navy hover:bg-gray-50"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-xs font-medium text-neutral bg-background px-3 py-1.5 rounded-full border border-border">
              <span className="w-2 h-2 rounded-full bg-positive"></span>
              System Operational
            </div>
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
              SP
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
