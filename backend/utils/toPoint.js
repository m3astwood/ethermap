const stringToPoint = (location) => {
  const locString = location.replace(/[()\s]/g, '')
  const [x, y] = locString.split(',')
  return { x, y }
}

const convertMapPoint = (point) => {
  if (typeof point.location === 'string' || point.location instanceof String) {
    point.location = stringToPoint(point.location)
  }
}

export { stringToPoint, convertMapPoint }
