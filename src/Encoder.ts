
import * as Transformer from 'class-transformer'

// Constructor type.
export declare type ObjectType<T> = {
  new (): T;
};

/**
 * Encode data from one format to another.
 */
export interface Encoder<DF, EF> {

  /**
   * Encode the data.
   *
   * @param {DF} decoded The decoded format.
   *
   * @return {EF} The encoded format.
   */
  encode(decoded: DF): EF
}

export class ClassEncoder<E> implements Encoder<E, Object> {

  /**
   * The class constructor.
   */
  protected type: ObjectType<E>

  /**
   * Instantiate a class encoder.
   *
   * @param {E} type The class constructor.
   */
  constructor(type: ObjectType<E>) {
    this.type = type
  }

  /**
   * Encode the class.
   *
   * @param {E} decoded The decoded class.
   *
   * @return {Object} The encoded class.
   */
  encode(decoded: E[]): Object[];
  encode(decoded: E): Object;
  encode(decoded: E|E[]): Object|Object[] {
    return Transformer.classToPlain(decoded)
  }
}