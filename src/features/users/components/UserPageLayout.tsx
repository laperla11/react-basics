import type { ReactNode } from 'react'
import { Bell, ChevronDown, CircleHelp, Command } from 'lucide-react'

export function UserPageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark"><Command size={19} /></span><span>northstar<span className="brand-dot">.</span></span></div>
        <div className="workspace-label">WORKSPACE</div>
        <div className="workspace-switch"><span className="workspace-avatar">N</span><span><strong>Northstar Studio</strong><small>Free workspace</small></span><ChevronDown size={15} /></div>
        <div className="nav-label">MANAGE</div>
        <nav className="side-nav"><a className="nav-item active" href="#users"><span className="nav-symbol">◫</span> Users <span className="nav-count">6</span></a><a className="nav-item" href="#teams"><span className="nav-symbol">⌘</span> Teams</a><a className="nav-item" href="#settings"><span className="nav-symbol">⚙</span> Settings</a></nav>
        <div className="sidebar-bottom"><a className="nav-item" href="#help"><CircleHelp size={17} /> Help centre</a><div className="profile-card"><span className="profile-avatar">KM</span><span><strong>K. Morgan</strong><small>Workspace admin</small></span><MoreDots /></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Users</strong></div><div className="topbar-right"><span className="demo-tag">DEMO ENVIRONMENT</span><button className="icon-button" aria-label="Notifications"><Bell size={18} /></button><span className="top-avatar">KM</span></div></header>
        {children}
      </main>
    </div>
  )
}

function MoreDots() { return <span className="more-dots">···</span> }
