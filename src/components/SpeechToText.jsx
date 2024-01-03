import React, { Component } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { Button } from '@mui/material';

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

    this.toggleListening = this.toggleListening.bind(this);
  }

  toggleListening() {
    if (this.state.listening) {
      this.recognition.stop();
      this.setState({ listening: false });
    } else {
      this.recognition.start();

      this.recognition.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        this.setState({ transcription: transcript });
      };

      // Modify the onend event handler
      this.recognition.onend = () => {
        this.setState({ listening: false });
        this.props.onSpeechRecognitionEnd(this.state.transcription);
      };

      this.setState({ listening: true });
    }
  }

  render() {
    const { listening, transcription } = this.state;

    return (
      <div>
        <Button
          onClick={this.toggleListening}
          variant="contained"
          style={{
            backgroundColor: 'primary',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
          }}
        >
          {listening ? (
            <StopIcon style={{ fontSize: '30px' }} />
          ) : (
            <MicIcon style={{ fontSize: '30px', color: 'white' }} />
          )}
        </Button>
        <p>Transcription: {transcription}</p>
      </div>
    );
  }
}

export default SpeechToText;
