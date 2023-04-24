import { MockModel } from '../../../database/mongoDB/test/support/mock.model';
import { User } from '../../schemas/user.schema';
import { userStub } from '../stubs/user.stub';

export class UserModel extends MockModel<User> {
  protected entityStub = userStub();
}

/*
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';

export class UserModel implements Model<UserDocument> {
  constructor(private readonly data: UserDocument[]) {}

  async create(doc: any): Promise<UserDocument> {
    const createdDoc = new this.model(doc);
    this.data.push(createdDoc);
    return createdDoc;
  }

  async findOne(query: any): Promise<UserDocument> {
    return this.data.find((doc) => doc.id === query.id);
  }

  async find(): Promise<UserDocument[]> {
    return this.data;
  }

  async deleteOne(query: any): Promise<any> {
    const index = this.data.findIndex((doc) => doc.id === query.id);
    if (index === -1) return { deletedCount: 0 };
    this.data.splice(index, 1);
    return { deletedCount: 1 };
  }

  async exec(): Promise<any> {
    return this.data;
  }

  model: any = {
    create: this.create.bind(this),
    findOne: this.findOne.bind(this),
    find: this.find.bind(this),
    deleteOne: this.deleteOne.bind(this),
  };
}

*/
