{
// begin

class Emitter {
  constructor() {
    this.map = Object.create(null);
  }

  on(eventName, cb) {
    if (typeof cb !== 'function') {
      return false;
    }

    const listeners = this.map[eventName];

    if (!listeners) {
      this.map[eventName] = [ cb ];
    } else {
      this.map[eventName].push(cb);
    }

    return true;
  }

  emit(eventName, payload) {
    console.info(`--- emit "${eventName}" with payload:`, payload);

    const listeners = this.map[eventName];

    if (!listeners) { return false; }

    listeners.forEach(cb => cb(payload));

    return true;
  }

  off(eventName, cb) {
    const listeners = this.map[eventName];

    if (!listeners) { return false; }

    if (!cb) {
      this.map[eventName] = [];

      return true;
    }

    const idx = listeners.indexOf(cb);

    if (idx) {
      listeners.splice(idx, 1);

      return true;
    }

    return false;
  }
}

class RetryEmitter extends Emitter {
  constructor({ timeout = 1 * 60 * 1000, maxGapTime = 10 * 1000 } = {}) {
    super();

    this.timeout = timeout;
    this.maxGapTime = maxGapTime;
    this.gapInMilliseconds = 2000;
  }

  computeNextRetryGap() {
    let gapInMilliseconds = this.gapInMilliseconds;

    if (gapInMilliseconds >= this.maxGapTime) {
      gapInMilliseconds = this.maxGapTime;
    } else {
      gapInMilliseconds *= 2;
    }

    return gapInMilliseconds;
  }

  async retry(func, timeout = this.timeout) {
    let begin = Date.now();
    let retries = 0;

    while (true) {
      retries += 1;

      nextTick(() => {
        this.emit('retry', { timeout: false, success: false, elapsed: Date.now() - begin, retries, gapInMilliseconds })
      });    

      try {
        await func();

        const result = { timeout: false, success: true, elapsed: Date.now() - begin, retries, gapInMilliseconds };

        this.emit('success', result);

        return result;
      } catch (error) {
        if (Date.now() - begin > timeout) {
          const result = { timeout: true, success: false, elapsed: Date.now() - begin, retries, gapInMilliseconds, error };

          this.emit('timeout', result);

          return result;
        }

        if (gapInMilliseconds >= this.maxGapTime) {
          const result = { timeout: false, success: false, elapsed: Date.now() - begin, retries, gapTimeOverflow: true, gapInMilliseconds, error };

          this.emit('reach-gap-time-breakpoint', result);
        } else {
          this.emit('error', { timeout: false, success: false, elapsed: Date.now() - begin, retries, gapTimeOverflow: false, gapInMilliseconds, error });

        }

        await sleep(gapInMilliseconds);
      }
    }
  }
}

async function sleep(timeout) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

async function nextTick(func) {
  return Promise.resolve().then(func);
}

// biz
async function fetchFormData() {
  await sleep(800);

  const random = Math.random();
  
  // success possibility 1% 
  if (random < 0.05) {
    return {
      success: true,
      name: 'Lisa',
      age: 24,
    }
  }

  throw new Error('Network error!');
}

const emitter = new RetryEmitter();

emitter.on('retry', ({ retries, gapInMilliseconds, elapsed }) => {
  console.info(`Retrying#${retries}, time elapsed: ${elapsed}ms, will retry after: ${gapInMilliseconds}ms`);
})

emitter.on('success', ({ retries, success, elapsed, gapInMilliseconds }) => { 
  console.log(`Retry success at retry#${retries}`, 'success:', success, `time elapsed: ${elapsed}ms`, `retry gap: ${gapInMilliseconds}ms`)
});

emitter.on('timeout', ({ retries, success, elapsed, timeout, gapInMilliseconds, error }) => { 
  console.error(`Retry timeout at retry#${retries}`, 'success:', success, 'time elapsed:', elapsed, 'timeout:', timeout, `retry gap: ${gapInMilliseconds}ms`, 'error:', error.message) 
})

emitter.on('reach-gap-time-breakpoint', ({ retries, success, elapsed, timeout, gapTimeOverflow, gapInMilliseconds, error }) => { 
  console.error(`Reach the max retry gap time ${emitter.maxGapTime}ms at retry#${retries}`, 'success:', success, 'time elapsed:', elapsed, 'timeout:', timeout, 'gapTimeOverflow:', gapTimeOverflow, `will retry after: ${gapInMilliseconds}ms`, 'error:', error.message) 
})

emitter.on('error', ({ retries, success, elapsed, timeout, gapTimeOverflow, gapInMilliseconds, error }) => { 
  console.error(`Retry failed at retry#${retries}:`, error.message, 'success:', success, 'time elapsed:', elapsed, 'timeout:', timeout, 'gapTimeOverflow:', gapTimeOverflow, `will retry after: ${gapInMilliseconds}ms`)
})

console.time('emitter.retry(fetchFormData) took')

try {
  await emitter.retry(fetchFormData);
} catch (error) {
  console.error('emitter.retry(fetchFormData) failed:', error);
} finally {
  console.timeEnd('emitter.retry(fetchFormData) took')
}

// end

}
