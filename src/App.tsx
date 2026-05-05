import { useState, useEffect } from 'react'
import './App.css'

type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

interface SafetyAlert {
  id: number
  message: string
  level: ThreatLevel
  timestamp: string
}

function formatTime(date: Date): string {
  return date.toTimeString().split(' ')[0]
}

function ThreatBadge({ level }: { level: ThreatLevel }) {
  const colorClass =
    level === 'LOW' ? 'glow-green' :
    level === 'MEDIUM' ? 'glow-amber' :
    level === 'HIGH' ? 'glow-red' :
    'glow-red'

  return (
    <span className={`threat-badge ${colorClass} ${level === 'CRITICAL' ? 'pulse' : ''}`}>
      {level}
    </span>
  )
}

const DEMO_ALERTS: SafetyAlert[] = [
  { id: 1, message: 'Perimeter sensor active – Zone A clear', level: 'LOW', timestamp: '21:00:01' },
  { id: 2, message: 'Motion detected – NW quadrant', level: 'MEDIUM', timestamp: '21:01:14' },
  { id: 3, message: 'Unknown entity approaching fence line', level: 'HIGH', timestamp: '21:02:33' },
]

export default function App() {
  const [time, setTime] = useState(new Date())
  const [alerts, setAlerts] = useState<SafetyAlert[]>(DEMO_ALERTS)
  const [threatLevel, setThreatLevel] = useState<ThreatLevel>('MEDIUM')
  const [arActive, setArActive] = useState(false)
  const [nextId, setNextId] = useState(4)

  // Clock tick
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Simulate incoming alert stream
  useEffect(() => {
    const levels: ThreatLevel[] = ['LOW', 'LOW', 'MEDIUM', 'HIGH']
    const messages = [
      'Routine scan complete – no anomalies',
      'Facial recognition: unknown individual',
      'Camera feed nominal – Sector 4',
      'Intrusion attempt detected at Gate 2',
      'Environmental sensors nominal',
      'Network integrity: VERIFIED',
    ]
    const interval = setInterval(() => {
      const level = levels[Math.floor(Math.random() * levels.length)]
      const msg = messages[Math.floor(Math.random() * messages.length)]
      const newAlert: SafetyAlert = {
        id: nextId,
        message: msg,
        level,
        timestamp: formatTime(new Date()),
      }
      setAlerts(prev => [newAlert, ...prev].slice(0, 10))
      setNextId(n => n + 1)
      // Update global threat level based on recent alerts
      setThreatLevel(level === 'HIGH' ? 'HIGH' : level === 'MEDIUM' ? 'MEDIUM' : 'LOW')
    }, 5000)
    return () => clearInterval(interval)
  }, [nextId])

  const threatColor =
    threatLevel === 'LOW' ? 'var(--hud-green)' :
    threatLevel === 'MEDIUM' ? 'var(--hud-amber)' :
    'var(--hud-red)'

  return (
    <div className="hud-root">
      {/* ── Header bar ── */}
      <header className="hud-header">
        <div className="hud-logo">
          <svg viewBox="0 0 48 48" width="36" height="36" aria-hidden="true">
            <ellipse cx="24" cy="24" rx="22" ry="14" stroke="var(--hud-cyan)" strokeWidth="2" fill="none" />
            <circle cx="24" cy="24" r="6" fill="var(--hud-cyan)" opacity="0.9" />
            <circle cx="24" cy="24" r="10" stroke="var(--hud-cyan)" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
          <span className="glow">SECURE EYE</span>
        </div>

        <div className="hud-clock glow">
          {formatTime(time)}{' '}
          <span className="blink">|</span>
        </div>

        <div className="hud-status">
          <span style={{ color: threatColor }}>
            THREAT: <strong>{threatLevel}</strong>
          </span>
        </div>
      </header>

      {/* ── Main grid ── */}
      <main className="hud-grid">

        {/* Camera / AR viewport */}
        <section className="hud-panel hud-viewport">
          <div className="panel-title glow">AR SURVEILLANCE FEED</div>
          <div className="ar-frame">
            <div className="ar-corner tl" />
            <div className="ar-corner tr" />
            <div className="ar-corner bl" />
            <div className="ar-corner br" />
            <div className="ar-center">
              {arActive ? (
                <div className="ar-active glow-green pulse">● LIVE AR MODE</div>
              ) : (
                <div className="ar-standby">
                  <p className="glow" style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    AR OVERLAY STANDBY
                  </p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.5rem' }}>
                    Camera access required
                  </p>
                  <button
                    className="hud-btn"
                    onClick={() => setArActive(true)}
                    style={{ marginTop: '1.5rem' }}
                  >
                    ACTIVATE AR FEED
                  </button>
                </div>
              )}
              {/* Crosshair */}
              <div className="crosshair" />
            </div>
          </div>
        </section>

        {/* Right column */}
        <div className="hud-right-col">

          {/* System status */}
          <section className="hud-panel">
            <div className="panel-title glow">SYSTEM STATUS</div>
            <ul className="status-list">
              {[
                { label: 'Perimeter Sensors', value: 'ONLINE', ok: true },
                { label: 'Facial Recognition', value: 'ACTIVE', ok: true },
                { label: 'Motion Detection', value: 'ACTIVE', ok: true },
                { label: 'Network Integrity', value: 'VERIFIED', ok: true },
                { label: 'AR Overlay', value: arActive ? 'LIVE' : 'STANDBY', ok: arActive },
              ].map(item => (
                <li key={item.label} className="status-row">
                  <span className="status-label">{item.label}</span>
                  <span className={item.ok ? 'glow-green' : 'glow-amber'}>{item.value}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Threat meter */}
          <section className="hud-panel">
            <div className="panel-title glow">THREAT LEVEL</div>
            <div className="threat-meter">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as ThreatLevel[]).map(lvl => (
                <div
                  key={lvl}
                  className={`threat-bar ${threatLevel === lvl ? 'active' : ''}`}
                  style={{
                    '--bar-color': lvl === 'LOW' ? 'var(--hud-green)' :
                      lvl === 'MEDIUM' ? 'var(--hud-amber)' : 'var(--hud-red)',
                  } as React.CSSProperties}
                >
                  <span>{lvl}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Quick actions */}
          <section className="hud-panel">
            <div className="panel-title glow">QUICK ACTIONS</div>
            <div className="action-grid">
              <button className="hud-btn">LOCKDOWN</button>
              <button className="hud-btn hud-btn-amber">ALERT TEAM</button>
              <button className="hud-btn">SCAN AREA</button>
              <button className="hud-btn hud-btn-red">EMERGENCY</button>
            </div>
          </section>
        </div>

        {/* Alert log */}
        <section className="hud-panel hud-alert-log">
          <div className="panel-title glow">LIVE ALERT FEED</div>
          <ul className="alert-list">
            {alerts.map(alert => (
              <li key={alert.id} className="alert-row">
                <span className="alert-time">{alert.timestamp}</span>
                <ThreatBadge level={alert.level} />
                <span className="alert-msg">{alert.message}</span>
              </li>
            ))}
          </ul>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="hud-footer">
        <span className="glow" style={{ fontSize: '0.7rem', opacity: 0.6 }}>
          SECURE EYE v1.0 &nbsp;|&nbsp; AI-POWERED SAFETY AWARENESS &nbsp;|&nbsp; ALL SYSTEMS NOMINAL
        </span>
      </footer>
    </div>
  )
}
