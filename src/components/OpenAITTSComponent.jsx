import React, { Component } from 'react';
import axios from 'axios';

class OpenAITTSComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      voice: 'nova', // Default voice
      audioElement: null,
    };
  }

  streamAudio = async () => {
    this.setState({ loading: true });

    const { input } = this.props;
    const { voice } = this.state;
    const serverUrl = 'http://localhost:3000/api/streamAudio';

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

        const audioElement = new Audio(url);
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

  changeVoice = (newVoice) => {
    this.setState({ voice: newVoice });
  };

  render() {
    const { loading, voice, audioElement } = this.state;

    return (
      <div>
        <button onClick={this.streamAudio} disabled={loading}>
          Stream Audio
        </button>

        <select value={voice} onChange={(e) => this.changeVoice(e.target.value)}>
          <option value="alloy">Alloy</option>
          <option value="echo">Echo</option>
          <option value="fable">Fable</option>
          <option value="nova">Nova</option>
          <option value="shimmer">Shimmer</option>
        </select>

        {audioElement && (
          <div>
            <p>Audio Controls:</p>
            <audio controls>
              <source src={audioElement.src} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    );
  }
}

export default OpenAITTSComponent;
