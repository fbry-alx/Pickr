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
  FilePond.registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginImageResize,
    FilePondPluginFileEncode,
  )

  FilePond.setOptions({
    stylePanelAspectRatio: 1 / coverAspectRatio,
    imageResizeTargetWidth: coverWidth,
    imageResizeTargetHeight: coverHeight
  })

  FilePond.parse(document.body)
}