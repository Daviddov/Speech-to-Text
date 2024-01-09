import React, { Component } from 'react';

class BlubToAudio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      audioElement: null,
    };
  }

  componentDidMount() {
    // When the component mounts, check if there is a valid audio source in props and set it up.
    this.setupAudio();
  }

  componentDidUpdate(prevProps) {
    // Check for changes in props, and update the audio source if needed.
    if (prevProps.audioData !== this.props.audioData) {
      this.setupAudio();
    }
  }

  setupAudio = () => {
    const { audioData } = this.props;

    if (!audioData) {
      console.warn('No audio data provided in props.');
      return;
    }

    // Convert binary data to ArrayBuffer
    const arrayBuffer = new Uint8Array(audioData.data).buffer;

    // Create a Blob from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
    const url = URL.createObjectURL(blob);

    const audioElement = new Audio();
    audioElement.src = url;
    this.setState({ audioElement }, () => {
      this.playAudio();
    });
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
        {/* You can add a button or any other UI element to trigger audio playback */}
        {/* <button onClick={this.playAudio} disabled={loading}>
          Play Audio
        </button> */}

        {audioElement && (
          <div>
            <div>
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

export default BlubToAudio;
