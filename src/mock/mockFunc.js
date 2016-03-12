import _ from 'lodash';
import When from '../when/when';

const MockFunction = function(){
  const whens = [];
  const mockedFunction = function(){
    mockedFunction.called++;
    const args = arguments;
    const cb = _.find(args, i => i && typeof i === 'function');
    const matchingWhen = _.find(whens, when => when.matches(...args));
    if(matchingWhen){
      if(!matchingWhen.valid()){
        //TODO: Make the error great again
        throw new Error(`A when must have a matching then. You did not specify a then for when matching arguments ${JSON.stringify(matchingWhen.args)}`);
      }
      if(matchingWhen.error && !cb){
        throw matchingWhen.error;
      }
      return cb ? cb(matchingWhen.error, matchingWhen.return) : matchingWhen.return;
    }
    return cb ? cb() : undefined;
  };
  mockedFunction.when = function(){
    const args = _.toArray(arguments);
    const when = new When(mockedFunction, args);
    whens.push(when);
    return when;
  };
  mockedFunction.called = 0;
  return mockedFunction;
};

export default MockFunction;