import { MoreHorizontal, Pencil, Trash2, Users } from 'lucide-react'
import type { User } from '../types/user.types'

interface UserListProps {
  users: User[]
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const initials = (name: string) => name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()

export function UserList({ users, onEdit, onDelete }: UserListProps) {
  if (users.length === 0) {
    return <div className="empty-state"><div className="empty-icon"><Users size={23} /></div><h3>No users found</h3><p>Try changing your search or filter, or add a new user.</p></div>
  }

  return (
    <div className="table-wrap">
      <table className="user-table">
        <thead><tr><th>User</th><th>Role</th><th>Status</th><th>Joined</th><th><span className="sr-only">Actions</span></th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><div className="user-cell"><span className="avatar">{initials(user.name)}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></div></td>
              <td><span className={`role-pill role-${user.role.toLowerCase()}`}>{user.role}</span></td>
              <td><span className={`status-label status-${user.status.toLowerCase()}`}><i />{user.status}</span></td>
              <td className="date-cell">{new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${user.joinedAt}T12:00:00`))}</td>
              <td><div className="row-actions"><button className="icon-button" aria-label={`Edit ${user.name}`} onClick={() => onEdit(user)}><Pencil size={15} /></button><button className="icon-button danger-hover" aria-label={`Delete ${user.name}`} onClick={() => onDelete(user)}><Trash2 size={15} /></button><button className="icon-button more-button" aria-label={`More actions for ${user.name}`} onClick={() => onEdit(user)}><MoreHorizontal size={17} /></button></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
