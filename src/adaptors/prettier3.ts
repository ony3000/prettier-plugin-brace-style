import { resolve } from 'path';
import type { Options } from 'prettier3';
import { Worker, MessageChannel, receiveMessageOnPort } from 'worker_threads';

let worker: Worker | undefined;

export function formatSync(source: string, options?: Options): string {
  const signal = new Int32Array(new SharedArrayBuffer(4));
  const { port1, port2 } = new MessageChannel();

  if (!worker) {
    worker = new Worker(resolve(__dirname, './worker.js'));
    worker.unref();
  }

  if (options) {
    // eslint-disable-next-line no-param-reassign
    delete options.plugins;
  }
  worker.postMessage({ signal, port: port1, originalText: source, options }, [port1]);
  Atomics.wait(signal, 0, 0);

  const response = receiveMessageOnPort(port2);

  if (response?.message.error) {
    throw new Error(response?.message.error);
  }

  return String(response?.message.result);
}
