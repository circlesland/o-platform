export interface IProcessContext {
  onlyWhenDirty: boolean;
  /**
   * Contains the data that collected or manipulated during the process.
   * This data is available to every step.
   */
  data: { [p: string]: any };
  /**
   * When a step alters data, it is asked to set a 'dirty flag' for the
   * property it altered.
   * This is mainly used to to ask the user if he wants to discard entered data 'on cancel'.
   */
  dirtyFlags: { [propertyName: string]: boolean };
  messages: { [propertyName: string]: string };
}

export interface TProcessContext<Data extends {[key:string]:any}> extends IProcessContext {
  data: Data;
}

export class ProcessContext<T extends {[key:string]:any}> implements TProcessContext<T> {
  data: T = <any>{};
  dirtyFlags: { [p: string]: boolean } = {};
  onlyWhenDirty: boolean = false;
  messages: { [p: string]: string } = {};
}