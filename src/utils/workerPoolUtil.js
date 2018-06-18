let workerPool = [];

export default {
  register(task, totalWorkers = 1) {
    if (!task) {
      return workerPool;
    }

    const url = URL.createObjectURL(new Blob([`(${task.toString()})()`]));

    totalWorkers = Math.min(navigator.hardwareConcurrency, totalWorkers);

    for (let i = 0; i < totalWorkers; i++) {
      workerPool[i] = new Worker(url);
    }

    return workerPool;
  },

  getWorkerPool() {
    return workerPool;
  },

  addEventListener(name, callback) {
    workerPool.forEach(worker => worker.addEventListener(name, callback));
  },

  postMessageToAll(data) {
    workerPool.forEach(worker => worker.postMessage(data));
  },

  unregister() {
    workerPool.forEach(worker => worker.terminate());
    workerPool.length = 0;
  },
};
