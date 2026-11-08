import { useMemo, useState } from 'react'
import { AlertCircle, ArrowDownToLine, Check, RefreshCw, ShieldCheck, UserRoundPlus } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { UserPageLayout } from './UserPageLayout'
import { UserToolbar } from './UserToolbar'
import { UserList } from './UserList'
import { UserForm } from './UserForm'
import { Modal } from '../../../shared/components/Modal'
import { useCreateUser, useDeleteUser, useUpdateUser, useUsers, usersQueryKey } from '../hooks/useUsers'
import { userService } from '../services/userService'
import type { User } from '../types/user.types'
import type { UserFormValues } from '../schemas/userSchema'

export function UserManagementPage() {
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('All')
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const queryClient = useQueryClient()
  const usersQuery = useUsers()
  const createMutation = useCreateUser()
  const updateMutation = useUpdateUser()
  const deleteMutation = useDeleteUser()

  const filteredUsers = useMemo(() => (usersQuery.data ?? []).filter((user) => {
    const matchesSearch = `${user.name} ${user.email}`.toLowerCase().includes(search.toLowerCase())
    return matchesSearch && (roleFilter === 'All' || user.role === roleFilter)
  }), [usersQuery.data, search, roleFilter])

  const openCreate = () => { setEditingUser(null); setFormError(null); setIsFormOpen(true) }
  const openEdit = (user: User) => { setEditingUser(user); setFormError(null); setIsFormOpen(true) }
  const closeForm = () => { setIsFormOpen(false); setEditingUser(null); setFormError(null) }

  const handleSubmit = async (values: UserFormValues) => {
    setFormError(null)
    try {
      if (editingUser) await updateMutation.mutateAsync({ id: editingUser.id, input: values })
      else await createMutation.mutateAsync(values)
      closeForm()
      setToast(editingUser ? 'User details updated' : 'New user created')
      window.setTimeout(() => setToast(''), 2800)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Something went wrong')
    }
  }

  const handleDelete = async (user: User) => {
    if (!window.confirm(`Delete ${user.name}? This only affects the local demo data.`)) return
    await deleteMutation.mutateAsync(user.id)
    setToast('User removed')
    window.setTimeout(() => setToast(''), 2800)
  }

  const exportUsers = () => {
    const rows = usersQuery.data ?? []
    const headers = ['Name', 'Email', 'Role', 'Status', 'Joined']
    const csv = [headers, ...rows.map((user) => [user.name, user.email, user.role, user.status, user.joinedAt])]
      .map((row) => row.map((value) => `\"${String(value).replaceAll('\"', '\"\"')}\"`).join(','))
      .join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'workspace-users.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  const simulateError = async () => {
    userService.simulateNextFailure()
    await queryClient.invalidateQueries({ queryKey: usersQueryKey })
  }

  const resetDemo = async () => {
    userService.resetDemo()
    await queryClient.resetQueries({ queryKey: usersQueryKey })
    setSearch('')
    setRoleFilter('All')
    setToast('Demo data reset')
    window.setTimeout(() => setToast(''), 2800)
  }

  const isSaving = createMutation.isPending || updateMutation.isPending

  return (
    <UserPageLayout>
      <div className="page-content" id="users">
        <div className="page-heading"><div><div className="eyebrow">DIRECTORY <span>·</span> ACCESS MANAGEMENT</div><h1>Users</h1><p>Manage your team members and their workspace permissions.</p></div><button className="button button-secondary export-button" onClick={exportUsers} disabled={!usersQuery.data?.length}><ArrowDownToLine size={16} /> Export</button></div>

        <div className="summary-grid">
          <div className="summary-card"><div className="summary-icon users-icon"><UserRoundPlus size={18} /></div><div><span>Total users</span><strong>{usersQuery.data?.length ?? '—'}</strong><small>Across this workspace</small></div></div>
          <div className="summary-card"><div className="summary-icon active-icon"><Check size={18} /></div><div><span>Active members</span><strong>{usersQuery.data?.filter((user) => user.status === 'Active').length ?? '—'}</strong><small>With workspace access</small></div></div>
          <div className="summary-card"><div className="summary-icon admin-icon"><ShieldCheck size={18} /></div><div><span>Administrators</span><strong>{usersQuery.data?.filter((user) => user.role === 'Admin').length ?? '—'}</strong><small>Full workspace control</small></div></div>
        </div>

        <section className="panel">
          <div className="panel-heading"><div><h2>All users</h2><p>View and manage access to your workspace.</p></div><span className="member-count">{filteredUsers.length} members</span></div>
          <UserToolbar search={search} onSearchChange={setSearch} roleFilter={roleFilter} onRoleFilterChange={setRoleFilter} onAddUser={openCreate} />
          {usersQuery.isLoading && <div className="loading-state"><span className="spinner" /><strong>Loading workspace users…</strong><small>Fetching the latest directory data</small></div>}
          {usersQuery.isError && <div className="error-state"><span className="error-icon"><AlertCircle size={21} /></span><h3>We couldn't load users</h3><p>{usersQuery.error.message}</p><button className="button button-primary" onClick={() => usersQuery.refetch()}><RefreshCw size={15} /> Try again</button></div>}
          {usersQuery.isSuccess && <UserList users={filteredUsers} onEdit={openEdit} onDelete={handleDelete} />}
          {usersQuery.isFetching && !usersQuery.isLoading && <div className="refresh-indicator"><span className="spinner spinner-small" /> Refreshing data…</div>}
          <div className="panel-footer"><span>Changes are stored in this browser for the demo.</span><span>Last updated just now</span></div>
        </section>

        <section className="demo-controls"><div><strong>Presenter controls</strong><span>Use these to demonstrate non-happy-path states.</span></div><div className="demo-control-actions"><button className="text-button" onClick={simulateError}>Simulate API error</button><button className="text-button" onClick={resetDemo}>Reset demo data</button></div></section>
        <div className="page-footnote">A small React architecture example <span>·</span> Mock API, no backend required</div>
      </div>
      {isFormOpen && <Modal title={editingUser ? 'Edit user' : 'Add a user'} description={editingUser ? 'Update this member’s details and workspace role.' : 'Invite a new member to your workspace.'} onClose={closeForm}><UserForm user={editingUser} busy={isSaving} serverError={formError} onCancel={closeForm} onSubmit={handleSubmit} /></Modal>}
      {toast && <div className="toast" role="status"><Check size={16} />{toast}</div>}
    </UserPageLayout>
  )
}
