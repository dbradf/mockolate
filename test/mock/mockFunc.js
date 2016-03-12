import MockFunction from '../../src/mock/mockFunc';
import {
  expect
} from 'chai';
import When from '../../src/when/when';

describe('mock function', () => {
  describe('no when', () => {
    it('should have return undefined with no callback', () => {
      const mockFunc = MockFunction();
      expect(mockFunc()).not.to.be.ok;
    });

    it('should invoke the callback with nothing', (done) => {
      const mockFunc = MockFunction();
      const cb = function(err, result) {
        expect(err).not.to.be.ok;
        expect(result).not.to.be.ok;
        done();
      };
      mockFunc(cb);
    });
  });

  describe('when', () => {
    it('should have a when method', () => {
      const mockFunc = MockFunction();
      expect(mockFunc.when).to.be.ok;
    });

    it('should accepts arguments', () => {
      const mockFunc = MockFunction();
      expect(mockFunc.when('a', 'b', 1, 3)).to.be.ok;
    });

    it('should return a When object', () => {
      const mockFunc = MockFunction();
      expect(mockFunc.when()).to.be.instanceof(When);
    });
  });

  describe('then', () => {
    it('should return a result when invoked with a matching when/then', () => {
      const mockFunc = MockFunction();
      mockFunc.when(1).thenReturn(2);
      expect(mockFunc(1)).to.equal(2);
    });
  });

  describe('verification', () => {
    it('should be able to report the number of times it was invoked', () => {
      const mockFunc = MockFunction();
      mockFunc();
      mockFunc();
      mockFunc();
      expect(mockFunc.called).to.equal(3);
    });
  });
});