import { format } from 'prettier3';
import { parentPort } from 'worker_threads';

if (parentPort) {
  parentPort.addListener('message', async ({ signal, port, originalText, options }) => {
    const response = {};

    try {
      response.result = await format(originalText, options);
    } catch (error) {
      response.error = error;
      response.errorData = { ...error };
    }

    try {
      port.postMessage(response);
    } catch {
      port.postMessage({
        error: new Error('Cannot serialize worker response'),
      });
    } finally {
      port.close();
      Atomics.store(signal, 0, 1);
      Atomics.notify(signal, 0);
    }
  });
}
