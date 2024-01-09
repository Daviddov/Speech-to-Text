import React, { Component } from 'react';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import { Button, ListItem } from '@mui/material';

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
  
      let finalTranscription = '';
  
      this.recognition.onresult = (event) => {
        const interimTranscript = event.results[event.results.length - 1][0].transcript;
        const isFinal = event.results[event.results.length - 1].isFinal;
  
        if (isFinal) {
          finalTranscription += interimTranscript + ' ';
          this.setState({ transcription: finalTranscription.trim() });
        } else {
          this.setState({ transcription: interimTranscript });
        }
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
      <div style={{ display: 'inline-flex', alignItems: 'center' }}>
        <ListItem
          sx={{
            bgcolor: '#DCF8C6',
            width: '300px',
            borderRadius: '8px',
            margin: 'auto',
            height: '30px',
          }}
          >
          {transcription}
        </ListItem>
        <Button
          onClick={this.toggleListening}
          variant="contained"
          style={{
            backgroundColor: '#37874c',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
          }}
          >
          {listening ? (
            <StopIcon style={{ fontSize: '20px' }} />
            ) : (
              <MicIcon style={{ fontSize: '20px', color: 'white' }} />
              )}
        </Button>
      </div>
              </div>
    );
  }
}

export default SpeechToText;
