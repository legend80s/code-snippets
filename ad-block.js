$$('*').filter(node => {
  const isOuterLink = node.href?.includes('http') && !node.href?.includes(window.location.host);

  return (isOuterLink) ||
    getComputedStyle(node).zIndex > 100000 ||
    getComputedStyle(node, 'before').background.includes('http')
  ;
})
  .forEach(n => { n.remove() })
