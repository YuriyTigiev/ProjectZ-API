require('dotenv').config()
import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull } from 'graphql'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import { authenticated } from '../guards'

// Import types needed in Queries & Mutations
import UserModel from '../../models/UserModel'
import UserType from '../types/UserType'

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    me: {
      type: UserType,
      resolve: async (root, args, { user }) => await UserModel.findOne({ id: user.id })
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: authenticated(async () => await UserModel.find({}))
    }
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    register: {
      type: UserType,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) },
        steamURL: { type: new GraphQLNonNull(GraphQLString) },
        blizzardURL: { type: GraphQLString }
      },
      resolve: async (root, args) => {
        args.password = await bcrypt.hash(args.password, 12)
        let { email, password, steamURL, blizzardURL } = args
        let user = await new UserModel({
          email,
          password,
          steamURL,
          blizzardURL: blizzardURL || ''
        })
        console.log('User registered : ', user)
        return await user.save()
      }
    },
    login: {
      type: GraphQLString,
      args: {
        email: { type: new GraphQLNonNull(GraphQLString) },
        password: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve: async (root, { email, password }) => {
        const user = await UserModel.findOne({ email })
        if (!user) throw new Error('No user with that email')

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) throw new Error('Incorrect password')

        const { id } = user
        const token = jwt.sign({ user: { id, email } }, process.env.SECRET, { expiresIn: '1d' })

        return tokenz
      }
    }
  }
})

export default new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
})
