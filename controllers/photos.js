const express = require('express')
const router = express.Router()
const Photo = require('../models/photo')
const Photographer = require('../models/photographer')
const imageMimeTypes = ['image/jpeg', 'image/png']

// All photos Route
router.get('/', async (req, res) => {
  let query = Photo.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('publishDate', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('publishDate', req.query.publishedAfter)
  }
  try {
    const photos = await query.exec()
    res.render('photos/index', {
      photos: photos,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New photo Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Photo())
})

// Create photo Route
router.post('/', async (req, res) => {
  const photo = new Photo({
    title: req.body.title,
    photographer: req.body.photographer,
    publishDate: new Date(req.body.publishDate),
    // pageCount: req.body.pageCount,
    description: req.body.description
  })
  saveCover(photo, req.body.cover)

  try {
    const newPhoto = await photo.save()
    res.redirect(`photos/${newPhoto.id}`)
  } catch {
    renderNewPage(res, photo, true)
  }
})

// Show photo Route
router.get('/:id', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
      .populate('photographer')
      .exec()
    res.render('photos/show', { photo: photo })
  } catch {
    res.redirect('/')
  }
})

// Edit photo Route
router.get('/:id/edit', async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)
    renderEditPage(res, photo)
  } catch {
    res.redirect('/')
  }
})

// Update photo Route
router.put('/:id', async (req, res) => {
  let photo

  try {
    photo = await Photo.findById(req.params.id)
    photo.title = req.body.title
    photo.photographer = req.body.photographer
    photo.publishDate = new Date(req.body.publishDate)
    // photo.pageCount = req.body.pageCount
    photo.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(photo, req.body.cover)
    }
    await photo.save()
    res.redirect(`/photos/${photo.id}`)
  } catch {
    if (photo != null) {
      renderEditPage(res, photo, true)
    } else {
      redirect('/')
    }
  }
})

// Delete photo Page
router.delete('/:id', async (req, res) => {
  let photo
  try {
    photo = await Photo.findById(req.params.id)
    await photo.remove()
    res.redirect('/photos')
  } catch {
    if (photo != null) {
      res.render('photos/show', {
        photo: photo,
        errorMessage: 'Could not remove photo'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, photo, hasError = false) {
  renderFormPage(res, photo, 'new', hasError)
}

async function renderEditPage(res, photo, hasError = false) {
  renderFormPage(res, photo, 'edit', hasError)
}

async function renderFormPage(res, photo, form, hasError = false) {
  try {
    const photographers = await Photographer.find({})
    const params = {
      photographers: photographers,
      photo: photo
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Photo'
      } else {
        params.errorMessage = 'Error Creating Photo'
      }
    }
    res.render(`photos/${form}`, params)
  } catch {
    res.redirect('/photos')
  }
}

function saveCover(photo, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    photo.coverImage = new Buffer.from(cover.data, 'base64')
    photo.coverImageType = cover.type
  }
}

module.exports = router