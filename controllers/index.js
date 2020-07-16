const express = require('express')
const router = express.Router()
const Photo = require('../models/photo')

router.get('/', async (req, res) => {
  let photos
  try {
    // sort in descending order and limit the amount to top 12 most recent ones.
    photos = await Photo.find().sort({ createdAt: 'desc' }).limit(12).exec()
  } catch {
    photos = []
  }
  res.render('index', { photos: photos })
})

module.exports = router