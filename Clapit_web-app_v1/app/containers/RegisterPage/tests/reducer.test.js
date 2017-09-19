import expect from 'expect';
import registerPageReducer from '../reducer';
import { fromJS } from 'immutable';

describe('registerPageReducer', () => {
  it('returns the initial state', () => {
    expect(registerPageReducer(undefined, {})).toEqual(fromJS({}));
  });
});
