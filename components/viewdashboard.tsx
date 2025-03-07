import { View, Text, ScrollView, Pressable, Platform, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import DashboardNative from './dashboard-native';
import Paho from 'paho-mqtt';
import { useAuth } from '@/providers/authprovider';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner"


   // Initialize the MQTT client
   const MQTT_BROKER = "wss://test.mosquitto.org:8081/mqtt";


   const MQTT_TOPICS = [
     "recycoil/temperature",
     "recycoil/flowRate",
     "recycoil/liters",
     "recycoil/buttonStart",
     "recycoil/buttonStop",
     'recycoil/status',
     'recycoil/biodiesel',
     'recycoil/carbonFootprint',
     'recycoil/producingTime'
   ];
   

   type topicsDT = {
    temperature: number;
    flowRate: number;
    liters: number;
    buttonStart: string;
    buttonStop: string;
    status: string;
    carbonFootprint: number;
    producingTime: number;
    biodiesel: number;
  };
  

export default function Viewdashboard() {
  //max value is 5 liters
  //measure the volume based on the sensor
    const { session } = useAuth();
  
  //sample data
  //logic mqtt here

  //if one app already starts the machine then the others can't publish to the topic 
  //create new topic to start the machine then make a conditional statement there.
  const [topics, setTopics] = useState<topicsDT>({ 
    temperature: 0.0,
    flowRate: 0.0,
    liters: 0.0,
    buttonStart: "",
    buttonStop: "",
    status: 'Not Running',
    carbonFootprint: 0.0,
    producingTime: 0,
    biodiesel: 0.0
  })
  
  useEffect(() => {
    // Create MQTT Client
    const client = new Paho.Client(MQTT_BROKER, "ReactNativeClient" + Math.random());
    client.onConnectionLost = (responseObject) => {
      console.log("Connection Lost:", responseObject.errorMessage);
    };

    client.onMessageArrived = (message) => {
      console.log(`Received ${message.destinationName}: ${message.payloadString}`);

      const key = message.destinationName.toString().split('/').pop() || ""; //{temperature, flowRate, liters, button} topic name
      let data: number | string = message.payloadString;

      if(!isNaN(parseFloat(data))) { //if the value is number
         data = parseFloat(data);
      }

      setTopics(prevTopics => ({  
         ...prevTopics, 
         [key]: data
      }))
    };

    // Connect to MQTT Broker
    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT!");
        // Subscribe to all topics
        MQTT_TOPICS.forEach((topic: string) => client.subscribe(topic));
      },
      onFailure: (err: any) => {
        console.log("MQTT Connection failed:", err.errorMessage);
      },
      useSSL: true,
    });


    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:" + responseObject.errorMessage);
      }
      client.connect(
        {
          onSuccess: () => {
            console.log("Connected to MQTT!");
            // Subscribe to all topics
            MQTT_TOPICS.forEach((topic: string) => client.subscribe(topic));
          },
          onFailure: (err: any) => {
            console.log("MQTT Connection failed:", err.errorMessage);
          },
          keepAliveInterval: 120 * 60,
          useSSL: true,
        }
      );
    }

    return () => {
      client.disconnect();
    };
  }, []);


    //save the data from the supabase database
    useEffect(() => { 

      if (topics.status === 'SUCCESSFUL') { 
        async function uploadData() { 
   
         let { data: datalogs, error, status: uploadStatus } = await supabase.from('datalogs').insert([
           { 
            flow_rate: topics.flowRate,
            production_time: null,
            temperature: topics.temperature,
            user_id: session?.user.id,   
            oil_volume: topics.flowRate,
            biodiesel: topics.biodiesel,
            carbon_footprint: topics.carbonFootprint,
            status: topics.status
           }
         ])
   
         if (error) { 
            alert(error.message);
         }
  
         console.log('UPLOADSTATUS' ,uploadStatus);
  
         if (uploadStatus === 201 || uploadStatus === 200) {
           alert('Data has been uploaded successfully.');
           console.log(datalogs);

           // eslint-disable-next-line no-unused-expressions
           Platform.OS === "web"
             ? toast.success("Your Biodiesel has been made successfully.")
             : Alert.alert("Your Biodiesel has been made successfully.");

           //reset data     
           setTopics({
            temperature: 0.0,
            flowRate: 0.0,
            liters: 0.0,
            buttonStart: "",
            buttonStop: "",
            status: 'Not Running',
            carbonFootprint: 0.0,
            biodiesel: 0,
            producingTime: 0, 
          })
         }

         else if (topics.status === 'FAILED') {
          // eslint-disable-next-line no-unused-expressions
          Platform.OS === "web"
            ? toast.error("Failed production. Something went wrong")
            : Alert.alert("Failed production", "Something went wrong", [{ text: "OK" }]);
        }

        else { 
           //do nothing 
           uploadData();
        }
    }

        uploadData();
      }
      
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [topics.status]);


  console.log(topics);

  
  const oilVolume = 4 * 20; 
  const maxVolume = 5 * 20;
  const remainingVolume = maxVolume - oilVolume; // 1.5 liters


  const pieData = [
    { value: oilVolume, color: '#DB2777', },
    { value: remainingVolume, color: 'lightgray', },
  ];
  console.log("flow rate", topics.flowRate);

  return (
    <DashboardNative
      producingTime={topics.producingTime}
      status={topics.status}
      biodiesel={topics.biodiesel}
      carbonFootprint={topics.carbonFootprint}
      flowRate={topics.flowRate}
      temperature={topics.temperature}
      pieData={pieData}
    />
  );
}