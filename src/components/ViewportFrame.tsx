import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface ViewportFrameProps {
  isMobileView: boolean;
  children: React.ReactNode;
}

export const ViewportFrame: React.FC<ViewportFrameProps> = ({ isMobileView, children }) => {
  if (!isMobileView) {
    return <>{children}</>;
  }

  // Get current time formatted
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="viewport-simulator-container">
      <div className="smartphone-frame">
        {/* Dynamic Island / Notch */}
        <div className="smartphone-island" />

        {/* Status Bar */}
        <div className="smartphone-status-bar">
          <span>{timeStr}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Signal size={12} />
            <Wifi size={12} />
            <BatteryMedium size={14} />
          </div>
        </div>

        {/* Content Area */}
        <div className="smartphone-content">
          {children}
        </div>

        {/* Home Swipe Indicator */}
        <div className="smartphone-home-bar">
          <div className="home-indicator-pill" />
        </div>
      </div>
    </div>
  );
};
