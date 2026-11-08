export type UserRole = 'Admin' | 'Editor' | 'Viewer'
export type UserStatus = 'Active' | 'Invited'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  joinedAt: string
}

export type UserInput = Pick<User, 'name' | 'email' | 'role'>
