// src/components/Dashboard/Dashboard.jsx - FULL ROW LAYOUT VERSION
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [telemetryData, setTelemetryData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [defenseMode, setDefenseMode] = useState(false);
  const [systemStats, setSystemStats] = useState({
    totalSatellites: 3,
    activeSatellites: 3,
    threatsDetected: 0,
    defenseActivations: 0
  });

  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsConnected(true);
    
    // Generate floating particles
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 6 + 2,
      color: ['quantumBlue', 'plasmaBlue', 'auroraGreen', 'fusionPurple'][Math.floor(Math.random() * 4)],
      animationDelay: Math.random() * 5,
      speed: Math.random() * 10 + 5
    }));
    setParticles(newParticles);
    
    // Enhanced telemetry simulation
    const interval = setInterval(() => {
      const satelliteIds = ['SAT-001', 'SAT-002', 'SAT-003'];
      const randomSat = satelliteIds[Math.floor(Math.random() * satelliteIds.length)];
      const isAnomaly = Math.random() < 0.05;
      
      const newData = {
        timestamp: Date.now(),
        satellite_id: randomSat,
        signal_strength: isAnomaly ? Math.random() * 30 + 10 : Math.random() * 30 + 70,
        battery_level: Math.random() * 20 + 80,
        temperature: Math.random() * 50 - 25,
        packet_loss: isAnomaly ? Math.random() * 15 : Math.random() * 2,
        anomaly: isAnomaly,
        threat_type: isAnomaly ? ['jamming', 'spoofing', 'data_injection'][Math.floor(Math.random() * 3)] : null
      };
      
      setTelemetryData(prev => [...prev.slice(-19), newData]);
      
      if (isAnomaly) {
        const newAlert = {
          id: Date.now(),
          satellite_id: randomSat,
          threat_type: newData.threat_type,
          severity: 'high',
          timestamp: new Date().toISOString(),
          message: `🚨 ${newData.threat_type.toUpperCase()} detected on ${randomSat}`
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 3)]);
        setSystemStats(prev => ({ ...prev, threatsDetected: prev.threatsDetected + 1 }));
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleDefenseModeToggle = () => {
    const newDefenseMode = !defenseMode;
    setDefenseMode(newDefenseMode);
    
    if (newDefenseMode) {
      setSystemStats(prev => ({ ...prev, defenseActivations: prev.defenseActivations + 1 }));
      setTimeout(() => setAlerts([]), 2000);
    }
  };

  return (
    <div className={styles.dashboard}>
      {/* Ambient Background */}
      <div className={styles.ambientBackground}>
        <div className={styles.gradientOrb1}></div>
        <div className={styles.gradientOrb2}></div>
        <div className={styles.gradientOrb3}></div>
      </div>

      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>
          🛰️ SYZYGY 2.0 - SPACE DEFENSE SYSTEM
        </h1>
        <div className={styles.headerControls}>
          <div className={`${styles.connectionStatus} ${isConnected ? styles.connected : styles.disconnected}`}>
            {isConnected ? 'SYSTEM ONLINE' : 'SYSTEM OFFLINE'}
          </div>
          <button 
            className={`${styles.defenseButton} ${defenseMode ? styles.active : ''}`}
            onClick={handleDefenseModeToggle}
          >
            {defenseMode ? '🛡️ DEFENSE ACTIVE' : '👁️ MONITORING'}
          </button>
        </div>
      </header>

      {/* Main Dashboard - Full Row Layout */}
      <main className={styles.mainContainer}>
        
        {/* Stats Row - Full Width */}
        <section className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <StatsCard title="Total Satellites" value={systemStats.totalSatellites} icon="🛰️" color="quantumBlue" />
            <StatsCard title="Active Satellites" value={systemStats.activeSatellites} icon="📡" color="auroraGreen" />
            <StatsCard title="Threats Detected" value={systemStats.threatsDetected} icon="⚠️" color="criticalRed" />
            <StatsCard title="Defense Activations" value={systemStats.defenseActivations} icon="🛡️" color="fusionPurple" />
          </div>
        </section>

        {/* Orbital Surveillance Row - Full Width */}
        <section className={styles.orbitalSection}>
          <div className={styles.fullRowPanel}>
            <div className={styles.panelHeader}>
              <h2>🌍 ORBITAL SURVEILLANCE</h2>
              <div className={styles.statusIndicators}>
                <span className={styles.statusDot}></span>
                <span>ACTIVE SCAN</span>
              </div>
            </div>
            
            <div className={styles.orbitalContent}>
              <div className={styles.satelliteMapArea}>
                <div className={styles.earthCenter}>
                  <div className={styles.earthCore}></div>
                  <div className={styles.orbitRing}></div>
                  <div className={styles.orbitRing} style={{ animationDelay: '10s' }}></div>
                  <div className={styles.orbitRing} style={{ animationDelay: '20s' }}></div>
                </div>
                {defenseMode && <div className={styles.scanLine}></div>}
              </div>
              
              <div className={styles.orbitalInfo}>
                <div className={styles.infoCard}>
                  <h3>🌐 Real-time Positioning</h3>
                  <p>Tracking 3 active satellites in low Earth orbit</p>
                  <div className={styles.orbitData}>
                    <span>SAT-001: 408km altitude</span>
                    <span>SAT-002: 412km altitude</span>
                    <span>SAT-003: 405km altitude</span>
                  </div>
                </div>
                
                <div className={styles.infoCard}>
                  <h3>🔍 AI Detection Status</h3>
                  <p>Machine learning algorithms actively monitoring</p>
                  <div className={styles.aiStatus}>
                    <span className={styles.statusItem}>
                      <span className={styles.statusIcon}>🤖</span>
                      Anomaly Detection: ACTIVE
                    </span>
                    <span className={styles.statusItem}>
                      <span className={styles.statusIcon}>⚡</span>
                      Response Time: &lt;50ms
                    </span>
                  </div>
                </div>
                
                <div className={styles.infoCard}>
                  <h3>⚡ Defense Status</h3>
                  <p>Security measures: {defenseMode ? 'ENGAGED' : 'STANDBY'}</p>
                  <div className={styles.defenseStatus}>
                    <span className={`${styles.defenseItem} ${defenseMode ? styles.active : styles.inactive}`}>
                      Encryption Shield
                    </span>
                    <span className={`${styles.defenseItem} ${defenseMode ? styles.active : styles.inactive}`}>
                      Frequency Hopping
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Threat Alerts Row - Full Width */}
        <section className={styles.threatSection}>
          <div className={styles.fullRowPanel}>
            <div className={styles.panelHeader}>
              <h2>🚨 THREAT ALERT SYSTEM</h2>
              <div className={styles.threatCounter}>
                <span className={styles.alertBadge}>{alerts.length}</span>
                <span>Active Threats</span>
              </div>
            </div>
            
            <div className={styles.threatContent}>
              {alerts.length === 0 ? (
                <div className={styles.allClearDisplay}>
                  <div className={styles.allClearIcon}>✅</div>
                  <div className={styles.allClearText}>
                    <h3>ALL SYSTEMS SECURE</h3>
                    <p>No active threats detected across all satellite networks</p>
                    <div className={styles.securityMetrics}>
                      <span>Last scan: {new Date().toLocaleTimeString()}</span>
                      <span>Uptime: 99.97%</span>
                      <span>Threats blocked today: {systemStats.threatsDetected}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.threatGrid}>
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`${styles.threatCard} ${styles[alert.severity]}`}>
                      <div className={styles.threatIcon}>⚠️</div>
                      <div className={styles.threatDetails}>
                        <h4>{alert.threat_type.toUpperCase()} ATTACK</h4>
                        <p>{alert.message}</p>
                        <div className={styles.threatMeta}>
                          <span>Target: {alert.satellite_id}</span>
                          <span>Time: {new Date(alert.timestamp).toLocaleTimeString()}</span>
                          <span className={styles.severity}>Severity: {alert.severity.toUpperCase()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Fill empty slots */}
                  {Array.from({ length: Math.max(0, 4 - alerts.length) }).map((_, index) => (
                    <div key={`empty-${index}`} className={styles.threatCardEmpty}>
                      <div className={styles.emptySlot}>
                        <span>🛡️</span>
                        <p>Protected</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Defense Matrix Row - Full Width */}
        <section className={styles.defenseSection}>
          <div className={styles.fullRowPanel}>
            <div className={styles.panelHeader}>
              <h2>🛡️ DEFENSE MATRIX CONTROL</h2>
              <div className={styles.defenseToggle}>
                <button 
                  className={`${styles.matrixButton} ${defenseMode ? styles.active : styles.inactive}`}
                  onClick={handleDefenseModeToggle}
                >
                  {defenseMode ? 'DEACTIVATE DEFENSES' : 'ACTIVATE DEFENSES'}
                </button>
              </div>
            </div>
            
            <div className={styles.defenseContent}>
              <div className={styles.defenseGrid}>
                <div className={styles.defenseCategory}>
                  <h3>🔐 Encryption Systems</h3>
                  <div className={styles.defenseOptions}>
                    <div className={`${styles.defenseOption} ${defenseMode ? styles.active : styles.inactive}`}>
                      <div className={styles.optionIcon}>🔒</div>
                      <span>AES-256 Encryption</span>
                      <div className={`${styles.statusLight} ${defenseMode ? styles.on : styles.off}`}></div>
                    </div>
                    <div className={`${styles.defenseOption} ${defenseMode ? styles.active : styles.inactive}`}>
                      <div className={styles.optionIcon}>🔑</div>
                      <span>Quantum Key Exchange</span>
                      <div className={`${styles.statusLight} ${defenseMode ? styles.on : styles.off}`}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.defenseCategory}>
                  <h3>📡 Signal Protection</h3>
                  <div className={styles.defenseOptions}>
                    <div className={`${styles.defenseOption} ${defenseMode ? styles.active : styles.inactive}`}>
                      <div className={styles.optionIcon}>📻</div>
                      <span>Frequency Hopping</span>
                      <div className={`${styles.statusLight} ${defenseMode ? styles.on : styles.off}`}></div>
                    </div>
                    <div className={`${styles.defenseOption} ${defenseMode ? styles.active : styles.inactive}`}>
                      <div className={styles.optionIcon}>🌊</div>
                      <span>Signal Scrambling</span>
                      <div className={`${styles.statusLight} ${defenseMode ? styles.on : styles.off}`}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.defenseCategory}>
                  <h3>🛰️ Network Resilience</h3>
                  <div className={styles.defenseOptions}>
                    <div className={`${styles.defenseOption} ${defenseMode ? styles.active : styles.inactive}`}>
                      <div className={styles.optionIcon}>🔄</div>
                      <span>Auto Failover</span>
                      <div className={`${styles.statusLight} ${defenseMode ? styles.on : styles.off}`}></div>
                    </div>
                    <div className={`${styles.defenseOption} ${defenseMode ? styles.active : styles.inactive}`}>
                      <div className={styles.optionIcon}>📶</div>
                      <span>Backup Channels</span>
                      <div className={`${styles.statusLight} ${defenseMode ? styles.on : styles.off}`}></div>
                    </div>
                  </div>
                </div>

                <div className={styles.defenseCategory}>
                  <h3>📊 Real-time Telemetry</h3>
                  <div className={styles.telemetryMini}>
                    {telemetryData.slice(-3).map((data, index) => (
                      <div key={index} className={`${styles.miniTelemetryRow} ${data.anomaly ? styles.anomaly : ''}`}>
                        <span className={styles.miniSatId}>{data.satellite_id}</span>
                        <span className={styles.miniSignal}>{data.signal_strength.toFixed(0)}%</span>
                        <span className={`${styles.miniStatus} ${data.anomaly ? styles.critical : styles.normal}`}>
                          {data.anomaly ? '⚠️' : '✅'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Floating Elements */}
      <div className={styles.floatingElements}>
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`${styles.floatingParticle} ${styles[particle.color]}`}
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDelay: `${particle.animationDelay}s`,
              animationDuration: `${particle.speed}s`
            }}
          />
        ))}
        
        <div className={`${styles.floatingDot} ${styles.dot1}`}></div>
        <div className={`${styles.floatingDot} ${styles.dot2}`}></div>
        <div className={`${styles.floatingDot} ${styles.dot3}`}></div>
        <div className={`${styles.floatingDot} ${styles.dot4}`}></div>
        <div className={`${styles.floatingDot} ${styles.dot5}`}></div>
        
        <div className={styles.orbitingElement1}></div>
        <div className={styles.orbitingElement2}></div>
      </div>

      <div className={styles.dataFlowLines}>
        <div className={styles.dataLine1}></div>
        <div className={styles.dataLine2}></div>
        <div className={styles.dataLine3}></div>
      </div>
    </div>
  );
};

const StatsCard = ({ title, value, icon, color }) => (
  <div className={`${styles.statsCard} ${styles[color]}`}>
    <div className={styles.cardShimmer}></div>
    <div className={styles.cardContent}>
      <div className={styles.cardHeader}>
        <div className={styles.cardIcon}>{icon}</div>
      </div>
      <div className={styles.cardValue}>{value}</div>
      <div className={styles.cardTitle}>{title}</div>
    </div>
    <div className={styles.cardGlow}></div>
  </div>
);

export default Dashboard;
