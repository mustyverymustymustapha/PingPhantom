const uploadInput = document.getElementById('upload')
const serverLogo = document.getElementById('server-logo')
const fakePing = document.getElementById('fake-ping')
const saveButton = document.getElementById('save-btn')
const canvas = document.getElementById('canvas')
uploadInput.addEventListener('change', function(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = function(event) {
    serverLogo.src = event.target.result
  }
  reader.readAsDataURL(file)
})
function compositeImage() {
  return new Promise((resolve, reject) => {
    const serverImg = new Image()
    const pingImg = new Image()
    serverImg.crossOrigin = "anonymous"
    pingImg.crossOrigin = "anonymous"
    serverImg.src = serverLogo.src
    pingImg.src = fakePing.src
    let loaded = 0
    function checkLoaded() {
      loaded++
      if (loaded === 2) {
        canvas.width = serverImg.naturalWidth
        canvas.height = serverImg.naturalHeight
        const ctx = canvas.getContext('2d')
        ctx.drawImage(serverImg, 0, 0, canvas.width, canvas.height)
        const pingWidth = canvas.width * 0.90
        const pingHeight = canvas.height * 0.90
        const offsetX = canvas.width * 0.05
        const offsetY = canvas.height * 0.05
        const x = canvas.width - pingWidth - offsetX
        const y = canvas.height - pingHeight - offsetY
        ctx.drawImage(pingImg, x, y, pingWidth, pingHeight)
        resolve(canvas.toDataURL('image/png'))
      }
    }
    serverImg.onload = checkLoaded
    pingImg.onload = checkLoaded
    serverImg.onerror = () => reject(new Error("Error loading server image."))
    pingImg.onerror = () => reject(new Error("Error loading fake ping image."))
  })
}
saveButton.addEventListener('click', async () => {
  if (!serverLogo.src) {
    alert("Please upload a server image first.")
    return
  }
  try {
    const dataURL = await compositeImage()
    const link = document.createElement("a")
    link.href = dataURL
    link.download = "pingphantom.png"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error("Error generating composite image:", error)
  }
})