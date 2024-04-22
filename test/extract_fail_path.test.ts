import {Decoder, string, number, boolean, object, array} from '../src/index';

describe('errorMessageWithData', () => {
  it('errorMessageWithData - 1', () => {
    interface User {
      a: {b: {c: string[]}};
      firstname: string;
      lastname: string;
      age: number;
      active: boolean;
    }
    const userDecoder: Decoder<User> = object({
      a: object({b: object({c: array(string())})}),
      firstname: string(),
      lastname: string(),
      age: number(),
      active: boolean()
    });

    const invalidUserJson: any = {
      a: {b: {c: ['aa', 'bb', ['cc'], 'dd']}},
      firstname: 'John',
      lastname: 'Doe',
      age: 99,
      active: false
    };

    let errorMessage: string = 'no error';
    try {
      userDecoder.runWithException(invalidUserJson, {errorMessageWithData: true});
    } catch (e: any) {
      errorMessage = e.message;
    }

    expect(errorMessage).toEqual(`expected a string, got an array at input.a.b.c[2]
Error in data:
{
    "a": {
        "b": {
            "c": [
                "aa",
                "bb",
                "[\\"cc\\"] <<<ERROR HERE: expected a string, got an array at input.a.b.c[2]",
                "dd"
            ]
        }
    },
    "firstname": "John",
    "lastname": "Doe",
    "age": 99,
    "active": false
}`);
  });
});
