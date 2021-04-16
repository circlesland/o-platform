export interface IProcessContext {
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
  /**
   * Environment data which might be injected by the shell.
   * This should not be used to parameterize processes because
   * external callers can pre-set the whole 'data' property for this case.
   */
  environment: {
    progressView?: any,
    successView?: any,
    errorView?: any
  };
}

export interface TProcessContext<Data extends {[key:string]:any}> extends IProcessContext {
  data: Data;
}

export class ProcessContext<T extends {[key:string]:any}> implements TProcessContext<T> {
  data: T = <any>{};
  dirtyFlags: { [p: string]: boolean } = <any>{};
  environment: {
    // Generic views for a infinity progressbar, a green checkmark for success or a generic error view that shows the exception
    progressView?: any,
    successView?: any,
    errorView?: any
  } = <any>{};
}