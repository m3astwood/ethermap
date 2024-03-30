const stringToPoint = (location: string) => {
  const locString = location.replace(/[()\s]/g, '')
  const [x, y] = locString.split(',')
  return { x, y }
}

export { stringToPoint }
