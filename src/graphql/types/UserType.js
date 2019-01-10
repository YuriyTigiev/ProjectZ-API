import { GraphQLObjectType, GraphQLString, GraphQLID } from 'graphql'

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLID },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    steamURL: { type: GraphQLString },
    blizzardURL: { type: GraphQLString }
  })
})

export default UserType