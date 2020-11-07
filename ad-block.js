$$('*').filter(node =>
  getComputedStyle(node).zIndex > 100000 ||
  getComputedStyle(node, 'before').background.includes('http')
)
  .forEach(n => { n.remove() })
