const express = require('express')
const router = express.Router()
const Photographer = require('../models/photographer')
const Photo = require('../models/photo')

// All photographers Route
router.get('/', async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && req.query.name !== '') {
    searchOptions.name = new RegExp(req.query.name, 'i')
  }
  try {
    const photographers = await Photographer.find(searchOptions)
    res.render('photographers/index', {
      photographers: photographers,
      searchOptions: req.query
    })
  } catch (error) {
    res.redirect('/')
  }
})

// New photographer Route
router.get('/new', (req, res) => {
  res.render('photographers/new', { photographer: new Photographer() })
})

// Create photographer Route
router.post('/', async (req, res) => {
  const photographer = new Photographer({
    name: req.body.name
  })
  try {
    const newPhotographer = await photographer.save()
    res.redirect(`photographers/${newPhotographer.id}`)
  } catch (error) {
    res.render('photographers/new', {
      photographer: photographer,
      errorMessage: 'Error Creating New Photographer'
    })
  }
})


// show photographer route
router.get('/:id', async (req, res) => {
  try {
    const photographer = await Photographer.findById(req.params.id)
    const photos = await Photo.find({ photographer: photographer.id }).limit(10).exec()
    res.render('photographers/show', {
      photographer: photographer,
      photosByPhotographer: photos
    })
  } catch (error) {
    res.redirect('/')
  }
})

// edit route
router.get('/:id/edit', async (req, res) => {
  try {
    const photographer = await Photographer.findById(req.params.id)
    res.render('photographers/edit', { photographer: photographer })
  } catch {
    res.redirect('/photographers')
  }
})


// update route
router.put('/:id', async (req, res) => {
  let photographer
  try {
    photographer = await Photographer.findById(req.params.id)
    photographer.name = req.body.name
    await photographer.save()
    res.redirect(`/photographers/${photographer.id}`)
  } catch (error) {
    if (photographer == null) {
      res.redirect('/')
    } else {
      res.render('photographers/edit', {
        photographer: photographer,
        errorMessage: 'Error Updating Photographer'
      })
    }
  }
})


// delete route
router.delete('/:id', async (req, res) => {
  let photographer
  try {
    photographer = await Photographer.findByIdAndDelete(req.params.id)
    res.redirect('/photographers')
  } catch (error) {
    if (photographer == null) {
      res.redirect('/')
    } else {
      res.redirect(`/photographers/${photographer.id}`)
    }
  }
})

module.exports = router