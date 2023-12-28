import React, { Component } from 'react';
import SpeechToText from './SpeechToText';
import ChatGPTCommunication from './ChatGPTCommunication';


class SpeechToTextWithChatGPT extends Component {
  constructor(props) {
    super(props);

    this.state = {
      apiKey: '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',
      transcription: '',
    };

    this.handleSpeechRecognitionEnd = this.handleSpeechRecognitionEnd.bind(this);
  }

  handleSpeechRecognitionEnd(transcription) {
    this.setState({ transcription });
    this.sendToChatGPT(transcription);
  }

  async sendToChatGPT(transcription) {
    // Forward the transcription to ChatGPTCommunication component for further handling
    await this.chatGPTCommunicationRef.sendToChatGPT(transcription);
  }

  render() {
    const { apiKey, transcription } = this.state;

    return (
      <div>
        <SpeechToText onSpeechRecognitionEnd={this.handleSpeechRecognitionEnd} />
        <ChatGPTCommunication apiKey={apiKey} userMessage={transcription} ref={(ref) => (this.chatGPTCommunicationRef = ref)} />

      </div>
    );
  }
}

export default SpeechToTextWithChatGPT;
