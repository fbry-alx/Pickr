const mongoose = require('mongoose')
const Photo = require('./photo')

const photographerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})

// run method before remove photographer
photographerSchema.pre('remove', function (next) {
  // when photographer is this photographer id
  Photo.find({ photographer: this.id }, (err, photos) => {
    if (err) {
      //  pass error to next function
      next(err)
      //  if photos arent empty dont' delete photographer
    } else if (photos.length > 0) {
      next(new Error('This photographer has photos still'))
    } else {
      // otherwise remove photographer
      next()
    }
  })
})

module.exports = mongoose.model('Photographer', photographerSchema)