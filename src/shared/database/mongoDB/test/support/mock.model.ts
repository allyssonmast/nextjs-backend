export abstract class MockModel<T> {
  protected abstract entityStub: T;

  new = async () => this.entityStub;
  findOne(): { exec: () => T | null } {
    return {
      exec: (): T | null => {
        return this.entityStub;
      },
    };
  }

  toJSON() {
    const obj = this.entityStub as any;
    delete obj.password;
    return obj;
  }

  async create(): Promise<T> {
    return this.entityStub;
  }
  async find(): Promise<T[]> {
    return [this.entityStub];
  }

  async save(): Promise<T> {
    return this.entityStub;
  }

  async findOneAndUpdate(): Promise<T> {
    return this.entityStub;
  }
  deleteOne(): { exec: () => void } {
    return {
      exec: (): T | null => {
        return this.entityStub;
      },
    };
  }
}

/*

export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T = {} as T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  new = async () => this.entityStub;
  save = async () => this.entityStub;
  
  find = async () => [this.entityStub];
  create = async () => this.entityStub;
  remove = async () => true;
  exists = async () => false;
  findOne = async () => ({ exec: async () => this.entityStub });
  findOneAndUpdate = async () => this.entityStub;
  findByIdAndUpdate = async () => this.entityStub;
  findByIdAndDelete = async () => this;
  exec = async () => {};
  deleteOne = async () => true;
  findById = async () => this;
  
  findOneAndUpdate = async () => this.entityStub;
  deleteOne = async (filter: any) => ({ exec: async () => {} });
}
*/
