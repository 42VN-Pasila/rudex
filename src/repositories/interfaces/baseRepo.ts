export interface IBaseRepo<T> {
  getById(id: string): Promise<T>;
  save(data: Partial<T>): Promise<T>;
}
