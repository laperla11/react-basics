import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userSchema, type UserFormValues } from '../schemas/userSchema'
import type { User } from '../types/user.types'

interface UserFormProps {
  user?: User | null
  busy: boolean
  serverError?: string | null
  onCancel: () => void
  onSubmit: (values: UserFormValues) => Promise<void>
}

export function UserForm({ user, busy, serverError, onCancel, onSubmit }: UserFormProps) {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: user?.name ?? '', email: user?.email ?? '', role: user?.role ?? 'Viewer' },
  })

  useEffect(() => {
    reset({ name: user?.name ?? '', email: user?.email ?? '', role: user?.role ?? 'Viewer' })
  }, [user, reset])

  return (
    <form className="user-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <label className="field">
        <span>Full name</span>
        <input {...register('name')} placeholder="e.g. Alex Morgan" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'name-error' : undefined} />
        {errors.name && <small className="field-error" id="name-error">{errors.name.message}</small>}
      </label>
      <label className="field">
        <span>Email address</span>
        <input type="email" {...register('email')} placeholder="alex@company.com" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-error' : undefined} />
        {errors.email && <small className="field-error" id="email-error">{errors.email.message}</small>}
      </label>
      <label className="field">
        <span>Role</span>
        <select {...register('role')}>
          <option value="Admin">Admin</option>
          <option value="Editor">Editor</option>
          <option value="Viewer">Viewer</option>
        </select>
      </label>
      {serverError && <div className="form-server-error" role="alert">{serverError}</div>}
      <div className="form-actions">
        <button className="button button-quiet" type="button" onClick={onCancel}>Cancel</button>
        <button className="button button-primary" type="submit" disabled={busy || isSubmitting}>
          {busy || isSubmitting ? 'Saving…' : user ? 'Save changes' : 'Create user'}
        </button>
      </div>
    </form>
  )
}
