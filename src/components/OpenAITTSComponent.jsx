import React, { Component } from 'react';
import axios from 'axios';

class OpenAITTSComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      audioElement: null,
    };
  }

  streamAudio = async () => {
    this.setState({ loading: true });

    const { input, voice } = this.props;
    const serverUrl = 'https://tide-peppered-blackberry.glitch.me/api/streamAudio';

    if (!input) {
      console.warn('Input is empty. Cannot stream audio.');
      return;
    }

    try {
      const response = await axios.post(serverUrl, { input, voice }, { responseType: 'arraybuffer' });

      // Ensure the correct content type
      const contentType = response.headers['content-type'];

      if (contentType && (contentType.startsWith('audio/') || contentType === 'application/octet-stream')) {
        const blob = new Blob([response.data], { type: contentType });
        const url = URL.createObjectURL(blob);

        const audioElement = new Audio();
        audioElement.src = url; // Set the source dynamically
        this.setState({ audioElement }, () => {
          this.playAudio();
        });
      } else {
        console.error('Invalid content type:', contentType);
      }
    } catch (error) {
      console.error('Error streaming audio:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  playAudio = () => {
    const { audioElement } = this.state;
    if (audioElement && audioElement.paused) {
      audioElement.play().catch((error) => console.error('Error playing audio:', error));
    }
  };

  render() {
    const { loading, audioElement } = this.state;

    return (
      <div>
        {/* <button onClick={this.streamAudio} disabled={loading}>
          Stream Audio
        </button> */}

        {audioElement && (
          <div>
              <div>
          <p>Audio Controls:</p>
          <audio controls key={audioElement.src}>
            <source src={audioElement.src} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
          </div>
        )}
      </div>
    );
  }
}

export default OpenAITTSComponent;
