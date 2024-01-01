import React, { Component } from 'react';
import axios from 'axios';

class TextToSpeech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      audioUrl: null,
    };
  }

  handleSpeak = async () => {
    const text = this.props.input;

    if (text) {
      const encodedParams = new URLSearchParams();
      encodedParams.set('src', text);
      encodedParams.set('hl', 'en-us');
      encodedParams.set('r', '1');
      encodedParams.set('c', 'mp3');
      encodedParams.set('f', '8khz_8bit_mono');

      const options = {
        method: 'POST',
        url: 'https://voicerss-text-to-speech.p.rapidapi.com/',
        params: {
          key: '353a874e07c24d5bb1fde27e34061b1f', // Replace with your actual API key
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          'X-RapidAPI-Key': '9f4238fbbfmshb1885b51d05e7bap102230jsn09d3c17b8e5c',
          'X-RapidAPI-Host': 'voicerss-text-to-speech.p.rapidapi.com',
        },
        data: encodedParams,
        responseType: 'arraybuffer',
      };

      try {
        const response = await axios.request(options);
        const audioData = response.data;
        const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);
        this.setState({ audioUrl });
      } catch (error) {
        console.error('Error fetching audio:', error);
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    // Check if audioUrl has been updated and play audio
    if (prevState.audioUrl !== this.state.audioUrl && this.state.audioUrl) {
      this.audioElement.play();
    }
  }

  render() {
    return (
      <div>
        <button onClick={this.handleSpeak}>Speak</button>
        {this.state.audioUrl && (
          <audio
            controls
            ref={(audio) => {
              this.audioElement = audio;
            }}
            src={this.state.audioUrl}
            type="audio/mpeg"
          />
        )}
      </div>
    );
  }
}

export default TextToSpeech;
