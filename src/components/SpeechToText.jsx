import React, { Component } from 'react';

class SpeechToText extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listening: false,
      transcription: '',
    };

    // Use browser prefixes for SpeechRecognition
    this.recognition =
      new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.clearTranscription = this.clearTranscription.bind(this);
  }

  startListening() {
    this.setState({ listening: true });
    this.recognition.start();

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript;

      this.setState({ transcription: transcript });
    };

    // Modify the onend event handler
    this.recognition.onend = () => {
      this.setState({ listening: false });
      this.props.onSpeechRecognitionEnd(this.state.transcription);
    };
  }

  stopListening() {
    this.recognition.stop();
    this.setState({ listening: false });
  }

  clearTranscription() {
    this.setState({ transcription: '' });
  }

  render() {
    const { listening, transcription } = this.state;

    return (
      <div>
        <button onClick={this.startListening} disabled={listening}>
          Start Listening
        </button>
        <button onClick={this.stopListening} disabled={!listening}>
          Stop Listening
        </button>
        <button onClick={this.clearTranscription}>
          Clear Transcription
        </button>
        <p>Transcription: {transcription}</p>
      </div>
    );
  }
}

export default SpeechToText;
