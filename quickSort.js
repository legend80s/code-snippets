function quickSort(xs) {
  if (xs.length === 0) return xs;

  const [head, ...rest] = xs;
  
  return [...quickSort(rest.filter(x => x < head)), head, ...quickSort(rest.filter(x => x > head))];
}
