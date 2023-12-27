import React, { Component } from 'react';
import SpeechToText from './SpeechToText';
import ChatGPTCommunication from './ChatGPTCommunication';
import OpenAITTSComponent from './OpenAITTSComponent'; // Make sure to import the OpenAITTSComponent

class SpeechToTextWithChatGPT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      transcription: '',
    };

    this.handleSpeechRecognitionEnd = this.handleSpeechRecognitionEnd.bind(this);
    this.openAITTSRef = React.createRef(); // Create a ref for OpenAITTSComponent
  }

  handleSpeechRecognitionEnd(transcription) {
    this.setState({ transcription });
    this.sendToChatGPT(transcription);
    this.callOpenAITTS(transcription); // Call the OpenAI TTS function
  }

  async sendToChatGPT(transcription) {
    // Forward the transcription to ChatGPTCommunication component for further handling
    await this.chatGPTCommunicationRef.sendToChatGPT(transcription);
  }

  callOpenAITTS(transcription) {
    // Call the OpenAI TTS function using the ref
    this.openAITTSRef.current && this.openAITTSRef.current.callOpenAITTS(transcription);
  }

  render() {
    return (
      <div>
        <SpeechToText onSpeechRecognitionEnd={this.handleSpeechRecognitionEnd} />
        <ChatGPTCommunication ref={(ref) => (this.chatGPTCommunicationRef = ref)} />
        <OpenAITTSComponent ref={this.openAITTSRef} />
      </div>
    );
  }
}

export default SpeechToTextWithChatGPT;
