const WebSocket = require('ws');
const mqtt = require('mqtt');

const MQTT_BROKER_URL = 'mqtt://193.137.5.80:8080'; // Replace with your MQTT broker URL
const WEBSOCKET_PORT = 3001;

const mqttClient = mqtt.connect(MQTT_BROKER_URL);
const wss = new WebSocket.Server({ port: WEBSOCKET_PORT });

mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
  
  // Default subscriptions
  mqttClient.subscribe('rega', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to rega');
    }
  });

  mqttClient.subscribe('manMode', (err) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to manMode');
    }
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
      const { action, topic, payload, plantID } = parsedMessage;

      if (action === 'subscribe' && plantID) {

        mqttClient.subscribe(`${plantID}/manMode`, (err) => {
          if (err) {
            console.error(`Subscription error for topic ${plantID}/manMode:`, err);
          } else {
            console.log(`Subscribed to ${plantID}/manMode`);
          }
        });

        mqttClient.subscribe(`${plantID}/rega`, (err) => {
          if (err) {
            console.error(`Subscription error for topic ${plantID}/rega:`, err);
          } else {
            console.log(`Subscribed to ${plantID}/rega`);
          }
        });

        // Handle incoming MQTT messages for the specific plantID
        mqttClient.on('message', (topic, message) => {
          if (topic === `${plantID}/manMode` || topic === `${plantID}/rega`) {
            console.log(`Received message: ${message.toString()} on topic: ${topic}`);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ topic, message: message.toString() }));
            }
          }
        });
      } else if (action === 'publish' && topic && payload) {
        
        mqttClient.publish(topic, payload,  { retain: true } , (err) => {
          if (err) {
            console.error('MQTT publish error:', err);
          } else {
            console.log(`Message published to ${topic} with retain flag`);
          }
        });
      }
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