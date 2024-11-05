export function userSessionParser(userSession) {
  return {
    ...userSession,
    sess: JSON.parse(userSession.sess)
  }
}

export function pointUserParser(point) {
  return {
    ...point,
    createdBy: userSessionParser(point.createdBy),
    updatedBy: userSessionParser(point.updatedBy),
  }
}
