import React from 'react';
import { 
  Home, 
  Activity, 
  TrendingUp, 
  FlaskConical, 
  DownloadCloud, 
  FileText, 
  Settings,
  Heart,
  BrainCircuit,
  Lock,
  Battery,
  CheckCircle2
} from 'lucide-react';

export type AdminTab = 
  | 'home' 
  | 'live-monitoring' 
  | 'trends' 
  | 'ai-analytics'
  | 'research' 
  | 'security'
  | 'battery-model'
  | 'verification'
  | 'import' 
  | 'reports' 
  | 'settings';

interface SidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={18} /> },
    { id: 'live-monitoring', label: 'Live Monitoring', icon: <Activity size={18} /> },
    { id: 'trends', label: 'Trends & Analytics', icon: <TrendingUp size={18} /> },
    { id: 'ai-analytics', label: 'Analytics', icon: <BrainCircuit size={18} /> },
    { id: 'research', label: 'Research Lab', icon: <FlaskConical size={18} /> },
    { id: 'security', label: 'Security Center', icon: <Lock size={18} /> },
    { id: 'battery-model', label: 'Battery Model', icon: <Battery size={18} /> },
    { id: 'verification', label: 'Verification Suite', icon: <CheckCircle2 size={18} /> },
    { id: 'import', label: 'Data Import', icon: <DownloadCloud size={18} /> },
    { id: 'reports', label: 'Reports & Ledger', icon: <FileText size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div style={{ width: 34, height: 34, borderRadius: '8px', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>
            <Heart size={20} fill="#ffffff" />
          </div>
          <div className="sidebar-logo-text">
            <h2>HealthHeart</h2>
            <span>LeadlessGuard</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => onTabChange(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#38bdf8' }}>
          <Heart size={14} />
          <span style={{ fontWeight: 600 }}>LeadlessGuard Telemetry</span>
        </div>
        <span>Enterprise Clinical Edition</span>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
};
