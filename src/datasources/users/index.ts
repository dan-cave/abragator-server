import mongoose from 'mongoose';
import { composeWithMongoose } from 'graphql-compose-mongoose';
import { schemaComposer, ObjectTypeComposer } from 'graphql-compose';
import { GraphQLSchema } from 'graphql';

class UserApi {
  User: mongoose.Model<mongoose.Document>;

  constructor() {
    const userSchema = new mongoose.Schema({
      userId: String,
      lastSignIn: Date,
      lastModifiedDate: Date,
      createdDate: Date,
      redditRefreshToken: String,
    });

    this.User = mongoose.model('User', userSchema);
  }

  getSchema(): GraphQLSchema {
    const UserTC: ObjectTypeComposer = composeWithMongoose(this.User, {});

    schemaComposer.Query.addFields({
      userById: UserTC.getResolver('findById'),
      userByIds: UserTC.getResolver('findByIds'),
      userOne: UserTC.getResolver('findOne'),
      userMany: UserTC.getResolver('findMany'),
      userCount: UserTC.getResolver('count'),
      userConnection: UserTC.getResolver('connection'),
      userPagination: UserTC.getResolver('pagination'),
    });

    schemaComposer.Mutation.addFields({
      userCreateOne: UserTC.getResolver('createOne'),
      userCreateMany: UserTC.getResolver('createMany'),
      userUpdateById: UserTC.getResolver('updateById'),
      userUpdateOne: UserTC.getResolver('updateOne'),
      userUpdateMany: UserTC.getResolver('updateMany'),
      userRemoveById: UserTC.getResolver('removeById'),
      userRemoveOne: UserTC.getResolver('removeOne'),
      userRemoveMany: UserTC.getResolver('removeMany'),
    });

    return schemaComposer.buildSchema();
  }
}

export default UserApi;
