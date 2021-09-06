export interface IObject {
  [key: string]: any;
  [key: number]: any;
}

export interface IGenericCallback<E, T> {
  (err: E | null, arg: T): void;
}
