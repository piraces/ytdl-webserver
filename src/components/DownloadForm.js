import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons'
import '../stylesheets/DownloadForm.scss'

class DownloadForm extends Component {
  componentDidMount () {
  }

  render () {
    return (
      <form className='downloadForm' onSubmit={this.props.onSubmit}>
          <input className='downloadForm__input' type='text' />
          <button className='downloadForm__btn'><FontAwesomeIcon icon={faCloudDownloadAlt} /></button>
          <input id="audio_radioBtn" className='downloadForm__radioBtn' type="radio" name="options" value="Audio" onChange={this.props.onChange} defaultChecked/> Audio
          <input id="video_radioBtn" className='downloadForm__radioBtn' type="radio" name="options" value="Video" onChange={this.props.onChange} /> Video
      </form>
    )
  }
}

DownloadForm.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func
}

export default DownloadForm
