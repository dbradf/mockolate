import When from '../../src/when/when';
import {
  expect
} from 'chai';
import _ from 'lodash';

describe('when class', () => {
  const mockFunc = () => {};

  describe('constructor', () => {
    it('should error without a mocked function', () => {
      try {
        new When();
      } catch (err) {
        expect(err).to.be.ok;
        expect(err).to.match(/Ooops/);
      }
    });

    it('should not error when a mock function is provided', () => {
      const newWhen = new When(mockFunc);
      expect(newWhen).to.be.ok;
    });

    it('should accept arguments and store them', () => {
      const args = [1, 2, 3];
      const newWhen = new When(mockFunc, args);
      expect(newWhen).to.be.ok;
      const result = newWhen.args;
      expect(args).to.deep.equal(_.toArray(result));
    });
  });

  describe('then return', () => {
    it('should store the return value', () => {
      const newWhen = new When(mockFunc);
      const returnValue = {
        a: 1,
        b: 2
      };
      newWhen.thenReturn(returnValue);
      expect(newWhen.return).to.equal(returnValue);
    });

    it('should return the mocked function', () => {
      const newWhen = new When(mockFunc);
      const returnValue = {
        a: 1,
        b: 2
      };
      const result = newWhen.thenReturn(returnValue);
      expect(newWhen.return).to.equal(returnValue);
      expect(result).to.equal(mockFunc);
    });

    it('should error if invoked twice', () => {
      const newWhen = new When(mockFunc);
      const returnValue = {
        a: 1,
        b: 2
      };
      newWhen.thenReturn(returnValue);
      expect(newWhen.thenReturn.bind(newWhen)).to.throw(/Each when can only/);
    });
  });

  describe('then error', () => {
    it('should store the error value', () => {
      const newWhen = new When(mockFunc);
      const errorValue = 'abc1234';
      newWhen.thenError(errorValue);
      expect(newWhen.error).to.equal(errorValue);
      expect(newWhen.forceError).to.not.be.ok;
    });

    it('should return the mocked function', () => {
      const newWhen = new When(mockFunc);
      const errorValue = 'abc1234';
      const result = newWhen.thenError(errorValue);
      expect(newWhen.error).to.equal(errorValue);
      expect(newWhen.forceError).to.not.be.ok;
      expect(result).to.equal(mockFunc);
    });

    it('should error if called twice', () => {
      const newWhen = new When(mockFunc);
      const errorValue = 'abc1234';
      newWhen.thenError(errorValue);
      expect(newWhen.thenError.bind(newWhen)).to.throw(/Each when can only/);
    });

    it('should error if another then is called after it', () => {
      const newWhen = new When(mockFunc);
      const errorValue = 'abc1234';
      newWhen.thenError(errorValue);
      expect(newWhen.thenReturn.bind(newWhen)).to.throw(/Each when can only/);
      expect(newWhen.thenError.bind(newWhen)).to.throw(/Each when can only/);
    });
  });

  describe('then throw', () => {
    it('should store the error value and set force error', () => {
      const newWhen = new When(mockFunc);
      const errorValue = 'abc1234';
      const result = newWhen.thenThrow(errorValue);
      expect(newWhen.error).to.equal(errorValue);
      expect(newWhen.forceError).to.equal(true);
      expect(result).to.equal(mockFunc);
    });
  });

  describe('matches', () => {
    it('should return true if all arguments are exactly equal', () => {
      const args = [1, 2, 3, 'a'];
      const newWhen = new When(mockFunc, args);
      expect(newWhen.matches(...args)).to.equal(true);
    });

    it('should work with a single argument', () => {
      const newWhen = new When(mockFunc, [1]);
      expect(newWhen.matches(1)).to.equal(true);
    });

    it('should return true if all arguments claim to be equal', () => {
      const equals = function(b) {
        return b === 1 || b === '1';
      };
      const arg = {
        equals
      };
      const newWhen = new When(mockFunc, [arg]);
      expect(newWhen.matches(1)).to.equal(true);
      expect(newWhen.matches('1')).to.equal(true);
      const stringWhen = new When(mockFunc, ['1']);
      expect(stringWhen.matches(arg)).to.equal(true);
      const numberWhen = new When(mockFunc, [1]);
      expect(numberWhen.matches(arg)).to.equal(true);
    });
  });

  describe('verify', () => {
    it('should throw an error if a return or error value has already been set', () => {
      const noReturns = new When(mockFunc);
      expect(noReturns.verify.bind(noReturns)).not.to.throw('Anything');
      const returnValue = new When(mockFunc);
      returnValue.thenReturn('anything');
      expect(returnValue.verify.bind(returnValue)).to.throw(/Each when can only/);
      const errorValue = new When(mockFunc);
      errorValue.thenError('some error');
      expect(errorValue.verify.bind(errorValue)).to.throw(/Each when can only/);
    });
  });

  describe('valid', () => {
    it('should return valid if a return value has been set', () => {
      const returnValue = new When(mockFunc);
      returnValue.thenReturn('anything');
      expect(returnValue.valid()).to.equal(true);
    });

    it('should return valid if an error value is set', () => {
      const errorValue = new When(mockFunc);
      errorValue.thenError('anything');
      expect(errorValue.valid()).to.equal(true);
    });

    it('should return invalid if no error or return has been set', () => {
      const invalid = new When(mockFunc);
      expect(invalid.valid()).to.equal(false);
    });

    it('should return invalid if a return value and an error are both set', () => {
      const invalid = new When(mockFunc);
      invalid.return = 'a';
      invalid.error = 'b';
      expect(invalid.valid()).to.equal(false);
    });
  });
});