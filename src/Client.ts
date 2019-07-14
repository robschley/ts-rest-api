import { Descriptor, DescriptorProperties, isDescriptor } from './Descriptor'
import { canHaveBody } from './Method'
import { Operation, OperationMap } from './Operation'
import { WrappedResponse } from './WrappedResponse'
import { buildRoute } from './Route'
import * as lodash from 'lodash'
import * as Transformer from 'class-transformer'
import 'isomorphic-fetch'

/**
 * Client Options
 *
 * @type {ClientOptions}
 */
export interface ClientOptions {
  baseURL: string,
  requestOptions?: Partial<RequestInit>
}

export type Fetch = (input: RequestInfo, init?: RequestInit) => Promise<Response>

/**
 * Client
 */
export class Client {

  static readonly defaultOptions: Partial<ClientOptions> = {

    // The default request options.
    requestOptions: {
      cache: 'no-cache',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer'
    }
  }

  /**
   * The client authentication token.
   */
  protected _authentication?: string = undefined

  /**
   * The client options.
   *
   * @type {ClientOptions}
   */
  protected _options: ClientOptions


  protected readonly fetch: Fetch

  /**
   * Invalid names for namespace() and register().
   */
  private _invalidNames: Array<string> = [
    'authentication',
    'options',
    'namespace',
    'register',
    'buildOperation'
  ]

  /**
   * Instantiate the client.
   *
   * @param {ClientOptions} options The client options.
   */
  constructor(options: ClientOptions, fetcher?: Fetch) {
    this.options = lodash.defaultsDeep({}, options || {}, Client.defaultOptions)
    this.fetch = fetcher ? fetcher : fetch
  }

  /**
   * Get the authentication mechanism.
   *
   * @return {string|undefined} The authentication string or undefined.
   */
  get authentication(): string|undefined {
    return this._authentication
  }

  /**
   * Set the authentication mechanism.
   *
   * @param {string|undefined} auth The authentication string or undefined.
   */
  set authentication(auth: string|undefined) {
    this._authentication = auth
  }

  /**
   * Get the client options.
   *
   * @return {ClientOptions} The client options.
   */
  get options(): ClientOptions {
    return this._options
  }

  /**
   * Set the client options.
   *
   * @param {ClientOptions} options The client options.
   */
  set options(options: ClientOptions) {
    this._options = options
  }

  /**
   * Create a new namespace on the client.
   *
   * @param name {string} The namespace name.
   * @param descriptors {object} The operation descriptors.
   *
   * @return {this & { ns: descriptors }} The client with the namespace added.
   */
  public namespace<N extends string, E extends object>(name: N, descriptors: E): this & Record<N, OperationMap<DescriptorProperties<E>>> {

    // Check if the namespace is valid.
    if (this._invalidNames.includes(name)) {
      throw new Error(`Namespace (${name}) cannot be used because it conflicts with ${this.constructor.name}.${name}`);
    }

    // Build the operations.
    const ops: OperationMap<DescriptorProperties<E>> = lodash.reduce(
      descriptors,
      (client, descriptor, name) => {

        // Check if the descriptor is valid.
        if (isDescriptor(descriptor)) {
          client[name] = this.buildOperation(descriptor)
        }

        return client
      },
      {} as OperationMap<DescriptorProperties<E>>
    )

    // Build the record container for the operations.
    const rec = { [name]: ops } as Record<N, OperationMap<DescriptorProperties<E>>>

    // Extend the client with the record container.
    let client = lodash.assign(this, rec)

    return client
  }

  /**
   * Create new operations on the client.
   *
   * @param descriptors {object} The operation descriptors.
   *
   * @return {this & descriptors} The client with the added descriptors.
   */
  public register<E extends object>(descriptors: E): this & OperationMap<DescriptorProperties<E>> {

    // Build the operations.
    return lodash.reduce(
      descriptors,
      (client, descriptor, name) => {

        // Check if the namespace is valid.
        if (this._invalidNames.includes(name)) {
          throw new Error(`Method (${name}) cannot be used because it conflicts with ${this.constructor.name}.${name}`);
        }

        // Check if the descriptor is valid.
        if (isDescriptor(descriptor)) {
          client[name] = this.buildOperation(descriptor)
        }

        return client
      },
      this as this & OperationMap<DescriptorProperties<E>>
    )
  }

  /**
   * Build the operation from the descriptor.
   *
   * @param descriptor {Descriptor<P, T>} The operation descriptor.
   * @return Operation<P, T> The operation.
   */
  protected buildOperation<P, T>(descriptor: Descriptor<P, T>): Operation<P, T, WrappedResponse<T>> {

    // Return the operation.
    return async (payload: P): Promise<WrappedResponse<T>> => {

      // Build the request body.
      const body = canHaveBody(descriptor.method) ? (descriptor.encoder ? descriptor.encoder.encode(payload) : Transformer.serialize(payload)) : undefined

      // Get the default and payload request descriptor.
      const defaultRequestOptions = this.options.requestOptions
      const payloadRequestOptions = lodash.isFunction(descriptor.request) ? descriptor.request(payload) : descriptor.request
      const authenticationRequestOptions = this.authentication ? { headers: { 'Authorization': this.authentication } } : {}
      const mergedRequestOptions = lodash.defaultsDeep({}, defaultRequestOptions, authenticationRequestOptions, payloadRequestOptions)

      // Get the base URL.
      let url = this.options.baseURL

      // Handle route builder functions.
      if (lodash.isFunction(descriptor.route)) {
        url += descriptor.route(payload)
      }
      // Build the route by interpolation.
      else {
        url = buildRoute(url + descriptor.route, payload, !canHaveBody(descriptor.method))
      }

      // Fetch the data.
      const response = await (this.fetch)(
        url,
        lodash.assign({}, mergedRequestOptions, { body: body, method: descriptor.method })
      )

      // Unserialize the data.
      const data = await response.json()

      // Check for an error response.
      if (response.status < 200 || response.status >= 400) {
        return Promise.reject(Error(lodash.isPlainObject(data) && data.message ? data.message : 'An unknown error has occurred.'))
      }

      // If no decoder was provided, return the data as is.
      if (!descriptor.decoder) {
        return new WrappedResponse(lodash.assign({}, response, { data }))
      }

      // Decode the data into the desired type.
      return new WrappedResponse<T>(lodash.assign({}, response, { data: descriptor.decoder.decode(data) }))
    }
  }
}
