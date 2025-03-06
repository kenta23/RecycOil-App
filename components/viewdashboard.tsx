import { View, Text, ScrollView, Pressable, Platform } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import DashboardWeb from './dashboard-web';
import DashboardNative from './dashboard-native';
import Paho from 'paho-mqtt';


   // Initialize the MQTT client
   const MQTT_BROKER = "ws://test.mosquitto.org:8081/mqtt";
   const MQTT_TOPICS = [
     "recycoil/temperature",
     "recycoil/flow",
     "recycoil/liters",
     "recycoil/button",
   ];
   

export default function Viewdashboard() {
  //max value is 5 liters
  //measure the volume based on the sensor
  
  //sample data
  //logic mqtt here

  //if one app already starts the machine then the others can't publish to the topic 
  //create new topic to start the machine then make a conditional statement there.

  const [temperature, setTemperature] = useState("Waiting...");
  const [flowRate, setFlowRate] = useState("Waiting...");
  const [liters, setLiters] = useState("Waiting...");
  const [buttonStatus, setButtonStatus] = useState("Waiting...");
  const [weight, setWeight] = useState("Waiting...");
  
  useEffect(() => {
    // Create MQTT Client
    const client = new Paho.Client(MQTT_BROKER, "ReactNativeClient" + Math.random());

    client.onConnectionLost = (responseObject) => {
      console.log("Connection Lost:", responseObject.errorMessage);
    };

    client.onMessageArrived = (message) => {
      console.log(`Received ${message.destinationName}: ${message.payloadString}`);

      switch (message.destinationName) {
        case "recycoil/temperature":
          setTemperature(message.payloadString);
          break;
        case "recycoil/flow":
          setFlowRate(message.payloadString);
          break;
        case "recycoil/loadcell":
          setWeight(message.payloadString);
          break;
        case "recycoil/liters":
          setLiters(message.payloadString);
          break;
        case "recycoil/button":
          setButtonStatus(message.payloadString);
          break;
        default:
          console.warn("Unknown topic:", message.destinationName);
      }
    };

    // Connect to MQTT Broker
    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT!");
        // Subscribe to all topics
        MQTT_TOPICS.forEach((topic) => client.subscribe(topic));
      },
      onFailure: (err: any) => {
        console.log("MQTT Connection failed:", err.errorMessage);
      },
      useSSL: true,
    });

    return () => {
      client.disconnect();
    };
  }, []);


  console.log(temperature);
  console.log(flowRate);
  console.log('weight', weight);
  
  const oilVolume = 4 * 20; 
  const maxVolume = 5 * 20;
  const remainingVolume = maxVolume - oilVolume; // 1.5 liters


  const pieData = [
    { value: oilVolume, color: '#DB2777', },
    { value: remainingVolume, color: 'lightgray', },
  ];

  return <DashboardNative biodiesel={weight} flowRate={flowRate} temperature={temperature} pieData={pieData}/>
}