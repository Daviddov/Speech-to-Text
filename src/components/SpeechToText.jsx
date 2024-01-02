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
  }

  startListening() {
    this.setState({ listening: true });
    this.recognition.start();

    this.recognition.onresult = (event) => {
      let fullTranscript = '';
      for (let i = 0; i < event.results.length; i++) {
        fullTranscript += event.results[i][0].transcript;
      }
      this.setState({ transcription: fullTranscript });
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

  render() {
    const { listening, transcription } = this.state;

    return (
      <div>
        <button onClick={this.startListening} disabled={listening}>
          Record
        </button>
        <button onClick={this.stopListening} disabled={!listening}>
          Stop
        </button>
        <p>Transcription: {transcription}</p>
      </div>
    );
  }
}

export default SpeechToText;
