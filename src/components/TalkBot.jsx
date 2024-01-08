import React, { Component } from 'react';
import SpeechToText from './SpeechToText';
import ChatGPTCommunication from './ChatGPTCommunication';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import ChatComponent from './ChatComponent'; // Import the new component

class TalkBot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      initialMessageSent: false, // Flag to track if the initial message has been sent
      transcription: '',
      voice: 'nova', // Default voice
      aiResponse: '',
      chatGPTSuggestion: '',
      history: '',
      chatMessages: [], // New state to hold chat messages
    };

    // Binding event handlers
    this.handleSpeechRecognitionEnd = this.handleSpeechRecognitionEnd.bind(this);
    this.handleAiResponse = this.handleAiResponse.bind(this);
  }
 

  changeVoice = (newVoice) => {
    this.setState({ voice: newVoice });
  };

  handleResetState = () => {
    this.setState({
      transcription: '',
      voice: 'nova',
      aiResponse: '',
      chatGPTSuggestion: null,
      history: '',
      chatMessages: [],
    });
  };

  handleSpeechRecognitionEnd(transcription) {
    this.sendToChatGPT(transcription, this.state.history);
    const chatMessage = { content: transcription, isAI: false };
    this.setState({ transcription });
    this.setState((prevState) => ({
    chatMessages: [...prevState.chatMessages, chatMessage]
  }));
  }

  handleAiResponse = async (aiResponse) => {
    const chatMessage = { content: aiResponse, isAI: true };
    this.setState((prevState) => ({
      aiResponse,
      history:aiResponse,
      chatMessages: [...prevState.chatMessages, chatMessage],
    }));

    try {
      const chatGPTSuggestion = await this.chatGPTCommunicationRef.sendChatGPTSuggestion(aiResponse);
  
      // this.setState({ chatGPTSuggestion });
    } catch (error) {
      console.error('Error sending transcription to ChatGPT for suggestion:', error);
      // Handle the error appropriately, e.g., display an error message to the user
    }
    }

    onResponseSuggestion = (chatGPTSuggestion) => {
      this.setState({ chatGPTSuggestion });
    };

  async sendToChatGPT(transcription, history) {
    await this.chatGPTCommunicationRef.sendToChatGPT(transcription, history);
  }

  render() {
    const { profile } = this.props;
    const { transcription, voice, aiResponse, history, chatMessages, chatGPTSuggestion} = this.state;
   
   
    const imageSyle = { width: '50px', height: '50px', borderRadius: '50%' , marginRight: '8px'};
    return (
      <div>
        <FormControl >
  <InputLabel >Voice</InputLabel>
  <Select
    value={voice}
    label="Age"
    onChange={(e) => this.changeVoice(e.target.value)}
  >
    <MenuItem value={"alloy"}> 
    <td/> <img
  src={"https://raw.githubusercontent.com/Daviddov/Speech-to-Text/master/media/IMG-20240106-WA0007.jpg"}
  style={imageSyle}
/>Alloy
</MenuItem>
    <MenuItem value={"echo"}>
    <td/> <img
  src={"https://raw.githubusercontent.com/Daviddov/Speech-to-Text/master/media/IMG-20240106-WA0004.jpg"}
  style={imageSyle}
/>Echo
</MenuItem>
    <MenuItem value={"fable"}> 
    <td/> <img
  src={"https://raw.githubusercontent.com/Daviddov/Speech-to-Text/master/media/IMG-20240106-WA0002.jpg"}
  style={imageSyle}
/>Fable
</MenuItem>
    <MenuItem value={"nova"}> 
    <td/> <img
  src={"https://raw.githubusercontent.com/Daviddov/Speech-to-Text/master/media/IMG-20240106-WA0003.jpg"}
  style={imageSyle}
/>Nova
</MenuItem>
    <MenuItem value={"shimmer"}> 
    <td/> <img
  src={"https://raw.githubusercontent.com/Daviddov/Speech-to-Text/master/media/IMG-20240106-WA0005.jpg"}
  style={imageSyle}
/>Shimmer
</MenuItem>
  </Select>
</FormControl>
<ChatComponent messages={chatMessages} />
          
          <strong>suggestion:</strong>
          <br />
          {chatGPTSuggestion} 
        <SpeechToText onSpeechRecognitionEnd={this.handleSpeechRecognitionEnd} />
        <ChatGPTCommunication
          userName={profile.name}
          voiceName={voice}
          userMessage={transcription}
          history={history}
          aiResponse={aiResponse}
          onAiResponse={this.handleAiResponse}
          onResponseSuggestion={this.onResponseSuggestion}
          ref={(ref) => (this.chatGPTCommunicationRef = ref)}
        />
        <button onClick={this.handleResetState}>Reset State</button>

        {/* <TextToSpeech  ref={(ref) => (this.TextToSpeechRef = ref)} input={aiResponseParts[0]}/> */}
        </div>

    );
  }
}

export default TalkBot;
