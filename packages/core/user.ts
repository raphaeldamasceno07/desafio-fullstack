export interface UserDTO {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface CreateUserRequest {
  name: string
  email: string
  password_hash: string
}
