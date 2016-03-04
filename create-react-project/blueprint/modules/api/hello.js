export default function (req, res, { params, location, route }) {
  (params, location, route)
  res.send('I only run on the server!')
}
