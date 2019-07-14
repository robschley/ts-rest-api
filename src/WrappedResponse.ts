

/**
 * WrappedResponseOptions defines the parameters needed to instantiate a WrappedResponse.
 */
export type WrappedResponseOptions<T> = Response & Required<{ data: T }>

/**
 * WrappedResponse provides a strongly typed response interface.
 */
export class WrappedResponse<T> {
  public readonly headers: Headers;
  public readonly ok: boolean;
  public readonly redirected: boolean;
  public readonly status: number;
  public readonly statusText: string;
  public readonly trailer: Promise<Headers>;
  public readonly type: ResponseType;
  public readonly url: string;
  public readonly data: T

  constructor(opts: WrappedResponseOptions<T>) {
    Object.assign(this, opts)
  }
}

