import { Method } from './Method'
import { Encoder } from './Encoder'
import { Decoder } from './Decoder'
import { RouteBuilder } from './Route'
import { isPlainObject, isString, isFunction } from 'lodash'

/**
 * RequestOptionBuilder builds the request options for a specific operation.
 */
export type RequestOptionBuilder<O> = (operation: O) => Partial<RequestInit>

/**
 * AuthenticationBuilder builds the request options for authentication.
 */
export type AuthenticationBuilder = (request: Partial<RequestInit>) => Partial<RequestInit>

/**
 * DescriptorPropertyNames filters an object for properties which are Descriptors.
 */
export type DescriptorPropertyNames<E> = { [K in keyof E]: E[K] extends Descriptor<any, any> ? K : never }[keyof E];

/**
 * DescriptorProperties selects the properties of an object which are Descriptors.
 */
export type DescriptorProperties<E> = Pick<E, DescriptorPropertyNames<E>>;

/**
 * isDescriptor checks if the input is a Descriptor.
 *
 * @param input The value to check.
 *
 * @return {boolean} True if the input is a descriptor, false otherwise.
 */
export function isDescriptor(input: any): input is Descriptor<any, any> {

  // Check if the input is a descriptor.
  if (isPlainObject(input) && isString(input.method) && (isString(input.route) || isFunction(input.route))) {
    return true
  }

  return false
}

/**
 * Descriptor defines an operation.
 */
export interface Descriptor<P, T> {
  method: Method
  route: string | RouteBuilder<P>
  request?: Object | RequestOptionBuilder<P>
  authentication?: AuthenticationBuilder
  encoder?: Encoder<P, any>
  decoder?: Decoder<any, T>
}
