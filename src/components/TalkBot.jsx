import React, { Component } from 'react';
import SpeechToText from './SpeechToText';
import ChatGPTCommunication from './ChatGPTCommunication';
import OpenAITTSComponent from './OpenAITTSComponent';
// import TextToSpeech from './TextToSpeech';

class TalkBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transcription: '',
      voice: 'nova', // Default voice
      aiResponse: '',
      history: '',
    };

    // Binding event handlers
    this.handleSpeechRecognitionEnd = this.handleSpeechRecognitionEnd.bind(this);
    this.handleAiResponse = this.handleAiResponse.bind(this);
  }

  // componentDidUpdate(prevProps, prevState) {
  //   const { aiResponse, voice } = this.state;

  //   // Check if aiResponse has changed
  //   if (aiResponse !== prevState.aiResponse) {
  //     // Start the audio stream only if the response is non-empty
  //     if (aiResponse.trim() !== '') {
  //       // this.TextToSpeechRef.handleSpeak();
  //     }
  //   }
  // }

  changeVoice = (newVoice) => {
    this.setState({ voice: newVoice });
  };

  handleSpeechRecognitionEnd(transcription) {
    this.setState({ transcription });
    this.sendToChatGPT(transcription, this.state.history);
  }

  handleAiResponse(response) {
    const history = response.split('|')[0];
    this.setState({ aiResponse: response, history });
  }

  async sendToChatGPT(transcription, history) {
    await this.chatGPTCommunicationRef.sendToChatGPT(transcription, history);
  }

  render() {
    const { profile } = this.props;
    const { transcription, voice, aiResponse, history } = this.state;
    const aiResponseParts = aiResponse.split('|');

    return (
      <div>
        <select value={voice} onChange={(e) => this.changeVoice(e.target.value)}>
          <option value="alloy">Alloy</option>
          <option value="echo">Echo</option>
          <option value="fable">Fable</option>
          <option value="nova">Nova</option>
          <option value="shimmer">Shimmer</option>
        </select>

        <SpeechToText onSpeechRecognitionEnd={this.handleSpeechRecognitionEnd} />
        <ChatGPTCommunication
          userName={profile.name}
          voiceName={voice}
          userMessage={transcription}
          history={history}
          aiResponse={aiResponse}
          onAiResponse={this.handleAiResponse}
          ref={(ref) => (this.chatGPTCommunicationRef = ref)}
        />

        {/* <TextToSpeech  ref={(ref) => (this.TextToSpeechRef = ref)} input={aiResponseParts[0]}/> */}

        <div>
          <strong>User:</strong> {transcription}
          <div>
            <strong>AI English Teacher:</strong>
            <br />
            {aiResponseParts[0]}
            <br />
            <strong>suggestion:</strong>
            <br />
            {aiResponseParts[1]}
          </div>
        </div>
      </div>
    );
  }
}

export default TalkBot;
