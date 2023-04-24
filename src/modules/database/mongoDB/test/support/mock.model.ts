export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T = {} as T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}
  new = async () => this.entityStub;
  findOne(filter: any): { exec: () => Promise<T | null> } {
    return {
      exec: async (): Promise<T | null> => {
        return this.entityStub as T | null;
      },
    };
  }
  async create(data: any): Promise<T> {
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
  deleteOne(filter: any): { exec: () => Promise<void> } {
    return {
      exec: async (): Promise<void> => {},
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
