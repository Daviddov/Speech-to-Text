import React, { Component } from 'react';

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

    const { apiKey, input } = this.props;
    const { voice } = this.state;
    const apiUrl = 'https://api.openai.com/v1/audio/speech';

    if (!input) {
      console.warn('Input is empty. Cannot stream audio.');
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'tts-1',
          voice,
          input,
        }),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Create an Audio element and set it in the state
      const audioElement = new Audio(url);
      this.setState({ audioElement }, () => {
        // Start playing the audio automatically
        this.playAudio();
      });
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

  playAgain = () => {
    const { audioElement } = this.state;
    if (audioElement && audioElement.paused) {
      // Restart the audio playback
      audioElement.currentTime = 0;
      this.playAudio();
    }
  };

  render() {
    const { loading, voice } = this.state;

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

        <button onClick={this.playAgain} disabled={loading}>
          Play Again
        </button>
      </div>
    );
  }
}

export default OpenAITTSComponent;
