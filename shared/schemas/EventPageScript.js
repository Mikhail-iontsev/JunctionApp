const mongoose = require('mongoose')
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLNonNull,
    GraphQLInputObjectType,
} = require('graphql')
const { GraphQLBoolean } = require('graphql')

const EventPageScriptSchema = new mongoose.Schema({
    page: {
        type: String,
    },
    script: {
        type: String,
    },
    approved: {
        type: Boolean,
        default: false,
    },
})

const EventPageScriptType = new GraphQLObjectType({
    name: 'EventPageScript',
    fields: {
        page: {
            type: GraphQLNonNull(GraphQLString),
        },
        script: {
            type: GraphQLNonNull(GraphQLString),
        },
        approved: {
            type: GraphQLNonNull(GraphQLBoolean),
        },
    },
})

const EventPageScriptInput = new GraphQLInputObjectType({
    name: 'EventPageScriptInput',
    fields: {
        page: {
            type: GraphQLNonNull(GraphQLString),
        },
        script: {
            type: GraphQLNonNull(GraphQLString),
        },
        approved: {
            type: GraphQLNonNull(GraphQLBoolean),
        },
    },
})

module.exports = {
    mongoose: EventPageScriptSchema,
    graphql: EventPageScriptType,
    graphqlInput: EventPageScriptInput,
}
