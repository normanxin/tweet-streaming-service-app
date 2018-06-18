import workerPoolUtil from './workerPoolUtil';

let source;

function workerTask() {
  let rules = {
    version: -1,
    fns: [],
  };

  const parse = function (conditions) {
    return conditions.reduce((fns, {field, operator, value}) => {
      const conditionFn = {
        equals: data => {
          if (!data[field]) {
            return false;
          }

          return data[field].toString() === value;
        },
        contains: data => {
          if (!data[field]) {
            return false;
          }

          return new RegExp(value, 'i').test(data[field].toString());
        },
        regex: data => {
          if (!data[field]) {
            return false;
          }

          return new RegExp(value.substring(1, value.length - 1))
            .test(data[field].toString());
        },
      };

      fns.push(conditionFn[operator]);

      return fns;
    }, []);
  };

  this.addEventListener('message', event => {
    const {type, data} = event.data;

    switch (type) {
      case 'rules':
        rules = {
          version: data.version,
          fns: parse(data.conditions),
        };
        break;
      case 'data':
        rules.fns.length && this.postMessage({
          version: rules.version,
          data: data.filter(el => rules.fns.every(fn => fn(el))),
        });
        break;
      default:
    }
  });
}

export default {
  start() {
    const workers = workerPoolUtil.register(workerTask,
      navigator.hardwareConcurrency);
    const buffer = [];

    let workerId = 0;

    source = new EventSource('https://tweet-service.herokuapp.com/stream');
    source.addEventListener('message', event => {
      if (buffer.length >= 5000) {
        workers[workerId].postMessage({type: 'data', data: buffer});
        workerId = ++workerId % 1;
        buffer.length = 0;
      }

      buffer.push(JSON.parse(event.data));
    });
  },

  close() {
    workerPoolUtil.unregister();
    source.close();
  }
};
