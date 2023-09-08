// TODO@me update error handler
export default (err, _, res) => {
  res.status(500).json({ message: err.message })
}


