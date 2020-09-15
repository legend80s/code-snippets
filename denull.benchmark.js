
const objToString = Object.prototype.toString;

function isPlainObject(obj) {
  return !!obj && typeof obj === 'object' && objToString.call(obj) === '[object Object]';
}

function denullRecursivelyUsingObjectEntries(obj) {
  return Object.entries(obj).reduce((acc, [key, val]) => {
    if (isPlainObject(val)) {
      acc[key] = denullRecursivelyUsingObjectEntries(val);
    } else {
      if (val !== null) {
        acc[key] = val;
      }
      // else not save in result
    }

    return acc;
    }, {})
}

function denullRecursivelyUsingObjectKeys(obj) {
  return Object.keys(obj).reduce((acc, key) => {
    const val = obj[key];

    if (isPlainObject(val)) {
      acc[key] = denullRecursivelyUsingObjectKeys(val);
    } else {
      if (val !== null) {
        acc[key] = val;
      }
      // else not save in result
    }

    return acc;
    }, {})
}


function denullUsingStringify(obj) {
  return JSON.parse(JSON.stringify(obj, (key, value) => {
    // console.log({ key, value })

    return value === null ? undefined : value;
  }))
}



// var data = { a: '', b: { c: null, d: 1 }, c: {}, d: [], e: false, f: () => {}, g: new Date() };

// expect(actual).toEqual({ a: '', b: { d: 1 }, c: {}, d: [], e: false, f: () => {}, g: new Date() })

exports.denullRecursivelyUsingObjectEntries = denullRecursivelyUsingObjectEntries;
exports.denullRecursivelyUsingObjectKeys = denullRecursivelyUsingObjectKeys;
exports.denullUsingStringify = denullUsingStringify;


const Benchmark = require("benchmark");
const {
  denullRecursivelyUsingObjectKeys,
  denullRecursivelyUsingObjectEntries,
  denullUsingStringify,
} = require('./utils/denull');

const suite = new Benchmark.Suite;

const data = { a: '', b: { c: null, d: 1 }, c: {}, d: [], e: false, f: () => {}, g: new Date() };

console.log('denullRecursivelyUsingObjectKeys(data):', denullRecursivelyUsingObjectKeys(data));
console.log('denullRecursivelyUsingObjectEntries(data):', denullRecursivelyUsingObjectEntries(data));
console.log('denullUsingStringify(data):', denullUsingStringify(data));

// add tests
suite
  .add('denullRecursivelyUsingObjectKeys', function() {
    denullRecursivelyUsingObjectKeys(data);
  })
  .add('denullRecursivelyUsingObjectEntries', function() {
    denullRecursivelyUsingObjectEntries(data);
  })
  .add('denullUsingStringify', function() {
    denullUsingStringify(data);
  })

  // add listeners
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    console.log('Fastest is ' + this.filter('fastest').map('name'));
  })
  // run async
  .run({ 'async': true });

// node -v v12.8.1
// denullRecursivelyUsingObjectKeys x 1,064,256 ops/sec ±3.25% (70 runs sampled)
// denullRecursivelyUsingObjectEntries x 1,281,371 ops/sec ±2.80% (72 runs sampled)
// denullUsingStringify x 148,264 ops/sec ±4.59% (73 runs sampled)
// Fastest is denullRecursivelyUsingObjectEntries
