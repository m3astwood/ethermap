export function userSessionParser(userSession) {
  return {
    ...userSession,
    sess: JSON.parse(userSession.sess)
  }
}

export function pointUserParser(point) {
  return {
    ...point,
    created_by_user: userSessionParser(point.created_by_user),
    updated_by_user: userSessionParser(point.updated_by_user),
  }
}
