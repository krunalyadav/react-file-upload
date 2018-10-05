import React, { Component } from 'react';
import Spinner from './Spinner';
import Images from './Images';
import Buttons from './Buttons';
import { API_URL } from './config';
import './App.css';

const toastColor = {
  background: '#505050',
  text: '#fff'
};

export default class App extends Component {
  state = {
    loading: true,
    uploading: false,
    images: []
  };

  onChange = e => {
    const files = Array.from(e.target.files);
    this.setState({ uploading: true });

    if (files.length > 3) {
      const msg = 'Only 3 images can be uploaded at a time';
      return this.toast(msg, 'custom', 2000, toastColor);
    }

    const formData = new FormData();

    files.forEach((file, i) => {
      formData.append(i, file);
    });

    fetch(`${API_URL}/image-upload`, {
      method: 'POST',
      body: formData
    })
      .then(res => res.json())
      .then(images => {
        this.setState({
          uploading: false,
          images
        });
      });
  };

  removeImage = id => {
    this.setState({
      images: this.state.images.filter(image => image.public_id !== id)
    });
  };

  render() {
    const { uploading, images } = this.state;

    const content = () => {
      switch (true) {
        case uploading:
          return <Spinner />;
        case images.length > 0:
          return <Images images={images} removeImage={this.removeImage} />;
        default:
          return <Buttons onChange={this.onChange} />;
      }
    };

    return (
      <div>
        <div className="buttons">{content()}</div>
      </div>
    );
  }
}
