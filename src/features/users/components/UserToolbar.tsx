import { Plus, Search, SlidersHorizontal } from 'lucide-react'

interface UserToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  roleFilter: string
  onRoleFilterChange: (value: string) => void
  onAddUser: () => void
}

export function UserToolbar({ search, onSearchChange, roleFilter, onRoleFilterChange, onAddUser }: UserToolbarProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-filters">
        <label className="search-box">
          <Search size={17} />
          <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search users…" aria-label="Search users" />
        </label>
        <label className="filter-select">
          <SlidersHorizontal size={16} />
          <select value={roleFilter} onChange={(event) => onRoleFilterChange(event.target.value)} aria-label="Filter by role">
            <option value="All">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
            <option value="Viewer">Viewer</option>
          </select>
        </label>
      </div>
      <button className="button button-primary" onClick={onAddUser}><Plus size={17} /> Add user</button>
    </div>
  )
}
