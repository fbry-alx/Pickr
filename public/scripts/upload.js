// https://github.com/pqina/filepond
const rootStyles = window.getComputedStyle(document.documentElement)

if (rootStyles.getPropertyValue('--photo-cover-width-large') != null && rootStyles.getPropertyValue('--photo-cover-width-large') !== '') {
  ready()
} else {
  document.getElementById('main-css').addEventListener('load', ready)
}

function ready() {
  const coverWidth = parseFloat(rootStyles.getPropertyValue('--photo-cover-width-large'))
  const coverAspectRatio = parseFloat(rootStyles.getPropertyValue('--photo-cover-aspect-ratio'))
  const coverHeight = coverWidth / coverAspectRatio
  // plugin for preview and resize
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  // set size and ratio on of image
  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })

  FilePond.parse(document.body)
}