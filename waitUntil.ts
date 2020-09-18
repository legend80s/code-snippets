/**
 * 请求一定要在某个阈值后返回，即使请求本身耗时低于阈值
 * 错误则如实返回
 */
async function waitUntil<T>(request: Promise<T>, threshold = 0): Promise<T> {
  const start = Date.now();

  return new Promise(async (resolve, reject) => {
    try {
      const resp = await request;

      const end = Date.now();
      const costs = end - start;

      if (costs - threshold >= 0) {
        return resp;
      }

      setTimeout(() => {
        resolve(resp);
      }, threshold - costs);
    } catch (error) {
      reject(error);
    }
  });
}

console.time('It will reject after 500 ms')
try { await(waitUntil(rejectAfter(500), 1000)); }
finally {
  console.timeEnd('It must resolve after 500 ms')
}

console.time('It must resolve after 1000 ms')
await(resolveAfter(500), 1000));
console.timeEnd('It must resolve after 1000 ms')

