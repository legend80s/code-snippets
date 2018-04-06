/**
 * Quick Sort an Array
 * @param  {Array} arr 
 * @param  {number} low 
 * @param  {number} high
 *
 * @example
 * var a = [10, 80, 30, 90, 40, 50, 70]; quickSort2(a);
 * // => a = [10, 30, 40, 50, 70, 80, 90]
 */
function quickSort2(arr, low = 0, high = arr.length - 1) {
  if (low > high) return;

  const pivot = partition(arr, low, high);

  quickSort2(arr, low, pivot - 1);
  quickSort2(arr, pivot + 1, high);
}

function partition(arr, low, high) {
  let i = low - 1;
  let j = low;

  const pivot = arr[high];

  for (; j < high; j += 1) {
    if (arr[j] < pivot) {
      i += 1;
      swap(arr, i, j);
    }
  }

  swap(arr, i + 1, high);

  return i + 1;
}


function swap(arr, i, j) {
  [arr[i], arr[j]] = [arr[j], arr[i]];
}
