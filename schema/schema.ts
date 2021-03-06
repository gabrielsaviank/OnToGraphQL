const graphql = require('graphql');
const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList
} = graphql

const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: () => ({
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString },
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue: any, args: any) {
                axios.get(`https://localhost:3000/companies/${parentValue.id}/users`).then(
                    (response: any) => response.data
                )
            }
        }
    })
});

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString},
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue: any, args: any) {
                axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then(
                    (response: any) => response.data
                );
            }
        }
    }
});

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue: any, args: any) {
                return axios.get(`http://localhost:3000/users/${args.id}`).then(
                    (response: any) => response.data
                );
            }
        },
        company: {
            type: CompanyType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue: any, args: any) {
                return axios.get(`https://localhost:3000/companies/${args.id}`).then(
                    (response: any) => response.data
                );
            }
        }
    }
});

export default new GraphQLSchema({
    query: RootQuery
});
