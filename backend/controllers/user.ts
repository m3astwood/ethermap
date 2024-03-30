const getUserSession = (req, res) => {
  res.json({ user: req.session.user })
}

const updateUserSession = (req, res) => {
  const { user } = req.body
  req.session.user = { ...req.session.user, ...user }

  res.json({ user: req.session.user })
}

export { getUserSession, updateUserSession }
