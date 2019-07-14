
import * as Transformer from 'class-transformer'

// Constructor type.
export declare type ObjectType<T> = {
  new (): T;
};

/**
 * Decode data from one format to another.
 */
export interface Decoder<EF, DF> {

  /**
   * Decode the data.
   *
   * @param {EF} encoded The encoded format.
   *
   * @return {DF} The decoded format.
   */
  decode(encoded: EF): DF
}

export class ClassDecoder<E> implements Decoder<Object, E> {

  /**
   * The class constructor.
   */
  protected type: ObjectType<E>

  /**
   * Instantiate a class decoder.
   *
   * @param {E} type The class constructor.
   */
  constructor(type: ObjectType<E>) {
    this.type = type
  }

  /**
   * Decode the class.
   *
   * @param {Object} encoded The encoded class.
   *
   * @return {D} The decoded class.
   */
  decode(encoded: Object[]): E[];
  decode(encoded: Object): E;
  decode(encoded: Object|Object[]): E|E[] {
    return Transformer.plainToClass(this.type, encoded)
  }
}
