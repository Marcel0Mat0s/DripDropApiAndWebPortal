const WebSocket = require('ws');
const mqtt = require('mqtt');

const MQTT_BROKER_URL = 'mqtt://193.137.5.80:8080'; // Replace with your MQTT broker URL
const WEBSOCKET_PORT = 3001;

const mqttClient = mqtt.connect(MQTT_BROKER_URL);
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Subscribe to desired MQTT topics
    mqttClient.subscribe('rega', (err) => {
        if (err) {
        console.error('Subscription error:', err);
        }
        console.log('Subscribed to rega');
    });

    mqttClient.subscribe('manMode', (err) => {
        if (err) {
        console.error('Subscription error:', err);
        }
        console.log('Subscribed to manMode');
    });
});

mqttClient.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);

  // Broadcast message to all WebSocket clients
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ topic, message: message.toString() }));
    }
  });
});

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Received message from WebSocket client:', message);

    try {
      const parsedMessage = JSON.parse(message);
      const { topic, payload } = parsedMessage;
      // Set the retain flag to true
      const options = { retain: true };

      // Publish message to MQTT broker with retain flag
      mqttClient.publish(topic, payload, options, (err) => {
        if (err) {
          console.error('MQTT publish error:', err);
        }
      });
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log(`WebSocket server running on ws://localhost:${WEBSOCKET_PORT}`);
