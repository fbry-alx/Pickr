const mongoose = require('mongoose')
const Photo = require('./photo')

const photographerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

photographerSchema.pre('remove', function (next) {
  photo.find({ photographer: this.id }, (err, photos) => {
    if (err) {
      next(err)
    } else if (photos.length > 0) {
      next(new Error('This photographer has photos still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Photographer', photographerSchema)