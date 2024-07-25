import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate, useParams} from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeToken, removeUserId } from "../redux/actions";

const MqttComponent = () => {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  const [topic, setTopic] = useState('');
  const [payload, setPayload] = useState('');

  useEffect(() => {
    const websocket = new WebSocket('ws://localhost:3001');

    websocket.onopen = () => {
      console.log('WebSocket connection established');
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    websocket.onclose = (event) => {
      console.error('WebSocket closed:', event);
    };

    websocket.onmessage = (event) => {
      console.log('Received message:', event.data);
      try {
        const data = JSON.parse(event.data);
        setMessages(prevMessages => [
          ...prevMessages,
          { topic: data.topic, message: data.message }
        ]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, []);

  const sendMessage = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({ topic, payload });
      ws.send(message);
    }
  };

  return (
    <div>
      <h1>MQTT Messages</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.topic}: {msg.message}</li>
        ))}
      </ul>
      <input 
        type="text" 
        placeholder="Topic" 
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />
      <input 
        type="text" 
        placeholder="Payload" 
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default MqttComponent;
