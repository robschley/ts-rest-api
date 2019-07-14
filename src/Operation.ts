
import { Descriptor } from './Descriptor'
import { WrappedResponse } from './WrappedResponse'

/**
 * Client Operation
 */
export type Operation<P, T, R extends WrappedResponse<T>> = (payload: P) => Promise<R>

/**
 * REST Client Operation Map
 */
export type OperationMap<E> = { [K in keyof E]: E[K] extends Descriptor<(infer P), (infer T)> ? Operation<P, T, WrappedResponse<T>> : never }
