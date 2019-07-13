/* global document */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isURL } from 'validator'
import DownloadForm from './DownloadForm'
import DownloadList from './DownloadList'
import { post } from '../javascripts/helpers'
import localStorage from '../javascripts/localStorage'
import '../stylesheets/DownloadPanel.scss'

class DownloadPanel extends Component {
  constructor (props) {
    super(props)

    const storedVideos = localStorage.getItem('videos')
    this.state = { videos: storedVideos, format: 'Audio' || [] }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClearClick = this.handleClearClick.bind(this)
    this.handleVideoDownloadClick = this.handleVideoDownloadClick.bind(this)
    this.handleOptionChanged = this.handleOptionChanged.bind(this)
  }

  handleClearClick () {
    this.setState({ videos: [] })
    localStorage.removeItem('videos')
  }

  handleVideoDownloadClick (e) {
    const videos = this.state.videos
    const videoUrl = e.target.getAttribute('data-orig')

    const updatedVideos = videos.filter(video => video.url !== videoUrl)

    this.setState({ videos: updatedVideos })

    // Can't use this.state.videos because this is bound to the function
    localStorage.setItem('videos', updatedVideos)
  }

  handleOptionChanged(e){
    this.setState({
      format: e.currentTarget.value
    });
  }

  handleSubmit (e) {
    e.preventDefault()
    const urlInput = document.querySelector('.downloadForm__input')
    const url = urlInput.value

    if (url.length === 0) {
      return
    }

    urlInput.value = ''

    if (!isURL(url)) {
      urlInput.classList.add('downloadForm__input--error')
      urlInput.placeholder = 'Invalid URL'

      setTimeout(() => {
        urlInput.classList.remove('downloadForm__input--error')
        urlInput.placeholder = ''
      }, 2000)

      return
    }

    // Provide instant feedback by adding as much as we know to state
    let videos = this.state.videos
    this.setState({ videos: [{
      name: url,
      url,
      downloading: true
    }, ...videos] })

    let audioOnly = this.state.format != 'Video'
    post('/download', `url=${url}&audioOnly=${audioOnly}`).then(newVideo => {
      videos = this.state.videos

      const updatedVideos = videos.map(video =>
        (video.url === newVideo.url ? Object.assign({}, video, newVideo) : video)
      )

      this.setState({ videos: updatedVideos })
      localStorage.setItem('videos', this.state.videos)
    }, error => {
      console.log('Failed!', error)
    })
  }

  render () {
    return (
      <div className='downloadPanel'>
        <DownloadForm onSubmit={this.handleSubmit} onChange={this.handleOptionChanged} />
        <DownloadList
          videos={this.state.videos}
          onClearClick={this.handleClearClick}
          onVideoDownloadClick={this.handleVideoDownloadClick}
        />
      </div>
    )
  }
}

export default DownloadPanel
