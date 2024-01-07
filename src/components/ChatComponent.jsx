import React from 'react';

class ChatComponent extends React.Component {
  renderMessages() {
    const { messages } = this.props;
console.log(messages);
    return messages.map((message, index) => (
      <div key={index} className={message.isAI ? 'ai-message' : 'user-message'}>
        {message.content}
      </div>
    ));
  }

  render() {
    return <div>{this.renderMessages()}</div>;
  }
}

export default ChatComponent;
