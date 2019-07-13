const path = require('path')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const youtubeDl = require('@microlink/youtube-dl')

function exists (filename, cb) {
  fs.access(filename, fs.F_OK, (err) => {
    if (!err) {
      cb(true)
    } else {
      cb(false)
    }
  })
}

function download (url, options) {
  return new Promise((resolve, reject) => {
    // TODO Add proper support for options
    const video = youtubeDl(url,
      // Optional arguments passed to youtube-dl.
      ['--format=best', '--no-playlist'],
      // Additional options can be given for calling `child_process.execFile()`.
      { cwd: __dirname, maxBuffer: Infinity })

    // Will be called when the download starts.
    video.on('info', info => {
      let filename = info._filename
      let format = info.ext
      filename = filename
        .replace('.' + format, '')
        .substring(0, filename.length - 16)

      if (options.audioOnly === 'true') {
        format = 'mp3'
      }

      const filePath = path.join(options.path, `${filename}.${format}`)

      exists(filePath, (doesExist) => {
        const videoObj = {
          name: filename,
          url,
          downloading: false,
          format
        }

        if (!doesExist) {
          // Convert to audio
          ffmpeg({ source: video })
            .on('end', () => {
              resolve(videoObj)
            })
            .toFormat(format)
            .save(filePath)
        } else {
          resolve(videoObj)
        }
      })
    })
  })
}

module.exports = {
  download
}
