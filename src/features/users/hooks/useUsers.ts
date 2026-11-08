import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { userService } from '../services/userService'
import type { UserInput } from '../types/user.types'

export const usersQueryKey = ['users'] as const

export function useUsers() {
  return useQuery({ queryKey: usersQueryKey, queryFn: userService.getUsers })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: UserInput) => userService.createUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UserInput }) => userService.updateUser(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: usersQueryKey }),
  })
}
