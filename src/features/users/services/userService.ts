import initialUsers from './mockUsers.json'
import type { User, UserInput } from '../types/user.types'

const STORAGE_KEY = 'react-user-management-demo-users'
let failNextRequest = false

const wait = (ms = 650) => new Promise((resolve) => window.setTimeout(resolve, ms))

function readUsers(): User[] {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (!stored) return initialUsers as User[]
  try {
    return JSON.parse(stored) as User[]
  } catch {
    return initialUsers as User[]
  }
}

function writeUsers(users: User[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

async function simulateRequest<T>(result: () => T): Promise<T> {
  await wait()
  if (failNextRequest) {
    failNextRequest = false
    throw new Error('The simulated API is temporarily unavailable. Please try again.')
  }
  return result()
}

export const userService = {
  getUsers: () => simulateRequest(() => readUsers()),

  createUser: (input: UserInput) =>
    simulateRequest(() => {
      const users = readUsers()
      if (users.some((user) => user.email.toLowerCase() === input.email.toLowerCase())) {
        throw new Error('A user with this email address already exists.')
      }
      const created: User = {
        ...input,
        id: `u-${Date.now()}`,
        status: 'Invited',
        joinedAt: new Date().toISOString().slice(0, 10),
      }
      writeUsers([created, ...users])
      return created
    }),

  updateUser: (id: string, input: UserInput) =>
    simulateRequest(() => {
      const users = readUsers()
      if (users.some((user) => user.id !== id && user.email.toLowerCase() === input.email.toLowerCase())) {
        throw new Error('A different user already uses this email address.')
      }
      const updated = users.map((user) => user.id === id ? { ...user, ...input } : user)
      writeUsers(updated)
      const result = updated.find((user) => user.id === id)
      if (!result) throw new Error('User not found.')
      return result
    }),

  deleteUser: (id: string) =>
    simulateRequest(() => {
      const updated = readUsers().filter((user) => user.id !== id)
      writeUsers(updated)
      return updated
    }),

  simulateNextFailure: () => {
    failNextRequest = true
  },

  resetDemo: () => {
    window.localStorage.removeItem(STORAGE_KEY)
  },
}
