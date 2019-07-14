import { ClassEncoder } from '../src/Encoder'
import * as Transformer from 'class-transformer'

describe('ClassEncoder', function() {

  class TestSubclass {
    id: number = 42

    @Transformer.Exclude()
    password: string = 'p4ssw0rd'
  }

  class TestClass {

    @Transformer.Expose()
    allowed: boolean = true

    name: string = 'Test Class'

    @Transformer.Exclude()
    excluded: boolean = true

    sub: TestSubclass = new TestSubclass()
  }

  const testEncoder = new ClassEncoder(TestClass)

  it('should transform with decorators', function() {
    const plain = testEncoder.encode(new TestClass())
    expect(plain).toEqual({ allowed: true, name: 'Test Class', sub: { id: 42 } })
  })
})
