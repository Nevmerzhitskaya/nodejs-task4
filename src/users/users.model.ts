export interface BaseData {
  id: string;
}

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface Database<T extends BaseData> {
  set(value: T): void;
  get(id: string): Record<string, T> | T | undefined;
}

export class InMemoryDatabase<T extends BaseData> implements Database<T> {
  private db: Record<string, T> = {};

  public set(value: T): void {
    this.db[value.id] = value;
  }

  public get(id?: string): Record<string, T> | T | undefined {
    return id ? this.db[id] : this.db;
  }

  public delete(id: string): void {
    delete this.db[id];
  }
}