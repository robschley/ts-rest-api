
import { Descriptor, Method, Client, ClassDecoder, ClassEncoder } from '../src'

export class CreateUser {
  name: string
  email: string
  password: string
}

const createUserEncoder = new ClassEncoder(CreateUser)

export class User {
  id: number
  name: string
  email: string
  passwordHash: string
  createdAt: Date
  lastUpdatedAt?: Date
}

const userDecoder = new ClassDecoder(User)

export interface GetUser {
  id: number
}

export interface GetUsers {
  name?: string
}

export interface DeleteUser {
  id: number
}

export class UpdateUser {
  name?: string
  email?: string
  password?: string
}

const updateUserEncoder = new ClassEncoder(UpdateUser)

export class UserOperations {

  create: Descriptor<CreateUser, User> = {
    method: Method.Post,
    route: '/users',
    encoder: createUserEncoder,
    decoder: userDecoder,
  }

  delete: Descriptor<DeleteUser, null> = {
    method: Method.Delete,
    route: '/users'
  }

  get: Descriptor<GetUser, User> = {
    method: Method.Get,
    route: '/users/:id',
    decoder: userDecoder,
  }

  query: Descriptor<GetUsers, User[]> = {
    method: Method.Get,
    route: '/users',
    decoder: userDecoder,
  }

  update: Descriptor<UpdateUser, User> = {
    method: Method.Post,
    route: '/users',
    encoder: updateUserEncoder,
    decoder: userDecoder,
  }
}

let client = (new Client({ baseURL: 'http://localhost:4000' })).namespace('user', new UserOperations())

client.user
  .create({ name: 'Test', email: 'example@example.com', password: 'p4ssw0rd' })
  .then(({data}) => data.passwordHash) // data is strongly typed `User`

// client.user.create({ name: 'Test User', email: 'test@example.com' })
// Argument of type '{ name: string; email: string; }' is not assignable to parameter of type 'CreateUser'. Property 'password' is missing in type '{ name: string; email: string; }' but required in type 'CreateUser'

// client.user.noop()
// Property 'noop' does not exist on type 'OperationMap<Pick<UserOperations, "create" | "delete" | "get" | "query" | "update">>'
