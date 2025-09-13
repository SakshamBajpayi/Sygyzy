import React from 'react';
import styles from './Header.module.css';

const Header = ({ isConnected, defenseMode, onDefenseModeToggle, systemStats }) => (
  <header className={styles.header}>
    <div className={styles.container}>
      <h1 className={styles.title}>
        🛰️ SYZYGY 2.0 - SPACE DEFENSE SYSTEM
      </h1>
      <div className={styles.controls}>
        <div className={`${styles.status} ${isConnected ? styles.connected : styles.disconnected}`}>
          {isConnected ? '🟢 CONNECTED' : '🔴 DISCONNECTED'}
        </div>
        <button
          className={`${styles.defenseButton} ${defenseMode ? styles.active : ''}`}
          onClick={onDefenseModeToggle}
        >
          {defenseMode ? 'DEFENSE ACTIVE' : 'MONITORING'}
        </button>
      </div>
    </div>
  </header>
);

export default Header;
