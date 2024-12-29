import { View, Text } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import Paho, { Message } from 'paho-mqtt';



export default function Account() {
  const [text, setText] = useState("");

  // Initialize the MQTT client
  const client = useMemo(() => new Paho.Client("ws://test.mosquitto.org:8081/mqtt", ""), []); //websocket protocol

  useEffect(() => {
    // Set up the client and connect
    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("Connection lost:", responseObject.errorMessage);
      }
    };

    client.onMessageArrived = (message) => {
      console.log("Message arrived:", message.payloadString);
      setText(message.payloadString);
    };

    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT broker");
        client.subscribe("mytopic/test");
        console.log("Subscribed to topic: mytopic/test");
      },
      onFailure: (err) => console.log("Connection failed", err.errorMessage),
      useSSL: true,
    });

    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };

  }, [client]);


  return (
    <View>
      <Text>fsdfsfsffsf</Text>
      <Text>{text.length && text}</Text>
    </View>
  )
}