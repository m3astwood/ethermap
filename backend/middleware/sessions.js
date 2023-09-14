export const setSessionData = (req, _, next) => {
  if (!req.session.user) {
    req.session.user = {
      name: '',
      colour: ''
    }
  }

  next()
}
