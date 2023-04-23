export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T = {} as T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  findOne(): { exec: () => T } {
    return {
      exec: (): T => this.entityStub,
    };
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
