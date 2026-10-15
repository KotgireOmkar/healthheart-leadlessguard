import React from 'react';
import { Activity, Bell, User, Monitor, Smartphone, Database, CheckCircle2 } from 'lucide-react';

interface HeaderProps {
  activeRole: 'ADMIN' | 'USER';
  onRoleChange: (role: 'ADMIN' | 'USER') => void;
  isMobileView: boolean;
  onViewportToggle: () => void;
  dbStatus: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeRole,
  onRoleChange,
  isMobileView,
  onViewportToggle,
  dbStatus,
}) => {
  return (
    <header className="top-header">
      <div className="header-left">
        <div className="header-title-section">
          <Activity size={24} color="#2563eb" />
          <div>
            <h1>HealthHeart | LeadlessGuard</h1>
          </div>
        </div>

        {/* Database Status indicator (Clean, NO sensitive cluster URLs!) */}
        <div className="status-badge online" title="Cloud persistence synchronized">
          <Database size={13} />
          <span>Cloud Database: Synchronized</span>
        </div>

        {/* Telemetry Uplink Status */}
        <div className="status-badge online" title="Encrypted telemetry uplink active">
          <span className="pulse-dot" />
          <span>Telemetry Uplink: Active</span>
        </div>
      </div>

      <div className="header-right">
        {/* Viewport Desktop vs Mobile Toggle */}
        <button
          onClick={onViewportToggle}
          className="mode-toggle-btn active"
          style={{ background: '#f8fafc', border: '1px solid #cbd5e1' }}
          title="Toggle Mobile Viewport Mockup"
        >
          {isMobileView ? (
            <>
              <Monitor size={14} color="#2563eb" />
              <span>Switch to Desktop View</span>
            </>
          ) : (
            <>
              <Smartphone size={14} color="#2563eb" />
              <span>Demonstrate Mobile View</span>
            </>
          )}
        </button>

        {/* Dual Panel Switcher (Admin / Clinician EP vs. Patient Companion) */}
        <div className="mode-toggle-group">
          <button
            className={`mode-toggle-btn ${activeRole === 'ADMIN' ? 'active' : ''}`}
            onClick={() => onRoleChange('ADMIN')}
          >
            Clinician EP Workstation
          </button>
          <button
            className={`mode-toggle-btn ${activeRole === 'USER' ? 'active' : ''}`}
            onClick={() => onRoleChange('USER')}
          >
            Patient Companion App
          </button>
        </div>

        {/* Notification Bell */}
        <button style={{ background: '#f8fafc', border: '1px solid #e2e8f0', width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
          <Bell size={16} color="#64748b" />
          <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, borderRadius: '50%', background: '#ef4444' }} />
        </button>

        {/* User Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '9999px' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
            {activeRole === 'ADMIN' ? 'EP' : 'PT'}
          </div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#0f172a' }}>
            {activeRole === 'ADMIN' ? 'Clinician EP' : 'Patient View'}
          </span>
        </div>
      </div>
    </header>
  );
};
