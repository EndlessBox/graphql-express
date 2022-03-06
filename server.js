var express = require("express");
var app = express();
var {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLString,
} = require("graphql");
var { graphqlHTTP } = require("express-graphql");

var addresses = [
  {
    id: 1,
    city: "city 1",
    location: "location 1",
    userId: 1,
  },
  {
    id: 2,
    city: "city 2",
    location: "location 2",
    userId: 2,
  },
];

var users = [
  {
    id: 1,
    name: "user 1",
    age: 10,
  },
  {
    id: 2,
    name: "user 2",
    age: 20,
  },
];

// Types
const UserType = new GraphQLObjectType({
  name: "User",
  description: "Single User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    age: { type: new GraphQLNonNull(GraphQLInt) },
    address: {
      type: AddressType,
      resolve: (user) => {
        return addresses.find((address) => address.userId === user.id);
      },
    },
  }),
});

const AddressType = new GraphQLObjectType({
  name: "Address",
  description: "Single Address",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    city: { type: new GraphQLNonNull(GraphQLString) },
    location: { type: new GraphQLNonNull(GraphQLString) },
    userId: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

// Root Query
const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    user: {
      type: UserType,
      description: "Single user",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => users.find((user) => user.id === args.id),
    },
    users: {
      type: new GraphQLList(UserType),
      description: "List of All users",
      resolve: () => users,
    },
    addresses: {
      type: new GraphQLList(AddressType),
      description: "list of all addresses",
      resolve: () => addresses,
    },
  }),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    addUser: {
      type: UserType,
      description: "Add user",
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        let user = {
          id: users.length + 1,
          name: args.name,
          age: args.age,
        };
        users.push(user);
        return user;
      },
    },
    addAddress: {
      type: AddressType,
      description: "add new address",
      args: {
        city: { type: new GraphQLNonNull(GraphQLString) },
        location: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        let address = {
          id: addresses.length + 1,
          location: args.location,
          city: args.city,
          userId: args.userId,
        };
        addresses.push(address);
        return address;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(3000, () => {
  console.log("server working");
});
