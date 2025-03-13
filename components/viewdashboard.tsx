import { Platform, Alert } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import DashboardNative from './dashboard-native';
import Paho from 'paho-mqtt';
import { useAuth } from '@/providers/authprovider';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner"
import { useButtonStart } from '@/lib/store';


   // Initialize the MQTT client
   const MQTT_BROKER = "wss://broker.emqx.io:8084/mqtt";
   const MQTT_TOPICS = [
     "recycoil/temperature",
     "recycoil/flowRate",
     "recycoil/liters",
     "recycoil/buttonStart",
     "recycoil/buttonStop",
     'recycoil/status',
     'recycoil/biodiesel',
     'recycoil/carbonFootprint',
     'recycoil/producingTime',
     'recycoil/energyConsumption'
   ];
  
   
  type topicsDT = {
    temperature: number;
    flowRate: number;
    liters: number;
    status: string;
    carbonFootprint: number;
    producingTime: number;
    biodiesel: number;
    oilVolume: number;
    energyConsumption: number
  };


export default function Viewdashboard() {
  //max value is 5 liters
  //measure the volume based on the sensor
    const { session } = useAuth();
    const {setButtonStart, buttonStart} = useButtonStart();
    const client = new Paho.Client(MQTT_BROKER, "ReactNativeClient" + Math.random());
    
  const [topics, setTopics] = useState<topicsDT>({ 
    temperature: 0.0,
    flowRate: 0.0,
    liters: 0.0,
    status: 'Not Running',
    carbonFootprint: 0.0,
    producingTime: 0,
    biodiesel: 0.0,
    oilVolume: 0.0,
    energyConsumption: 0.0
  })

  console.log(topics);
  console.log('buttonStart', buttonStart);
  
  useEffect(() => {
    // Handle Connection Loss
    client.onConnectionLost = (responseObject) => {
      if (responseObject.errorCode !== 0) {
        console.log("onConnectionLost:", responseObject.errorMessage);
      }
  
      // Attempt Reconnection
      client.connect({
        onSuccess: () => {
          console.log("Reconnected to MQTT!");
          MQTT_TOPICS.forEach((topic: string) => client.subscribe(topic));
        },
        onFailure: (err: any) => {
          console.log("MQTT Reconnection failed:", err.errorMessage);
        },
        keepAliveInterval: 120 * 60,
        useSSL: true,
      });
    };
  
    // Handle Incoming Messages
    client.onMessageArrived = (message) => {
      console.log(`Received ${message.destinationName}: ${message.payloadString}`);
  
      const key = message.destinationName.split('/').pop() || "";
      let data: number | string = message.payloadString;
  
      if (!isNaN(parseFloat(data))) {
        data = parseFloat(data);
      }
  
      setTopics((prevTopics) => ({
        ...prevTopics,
        [key]: data,
      }));
    };
  
    // Connect to MQTT Broker
    client.connect({
      onSuccess: () => {
        console.log("Connected to MQTT!");
        MQTT_TOPICS.forEach((topic: string) => client.subscribe(topic));
      },
      onFailure: (err: any) => {
        console.log("MQTT Connection failed:", err.errorMessage);
      },
      useSSL: true,
    });
  
    return () => {
      if (client.isConnected()) {
        client.disconnect();
      }
    };
  }, []);
  
  useEffect(() => {  
    if (buttonStart === true) {
       client.connect({
         onSuccess: () => {
            const messageSend = new Paho.Message("true");
            messageSend.destinationName = "recycoil/buttonStart";
            console.log("Sending MQTT Message:", messageSend.destinationName, messageSend.payloadString); // Debug Log
            client.send(messageSend);
         },

         onFailure: (err: any) => {
           console.log("Failed sending back to mqtt", err.errorMessage);
         },
       })
    }
  }, [buttonStart]);
  
  

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
  
         console.log('UPLOADSTATUS', uploadStatus);
  
         if (uploadStatus === 201 || uploadStatus === 200) {
           console.log(datalogs);

           // eslint-disable-next-line no-unused-expressions
           Platform.OS === "web"
             ? toast.success("Your Biodiesel has been made successfully.")
             : Alert.alert("Successful", "Your Biodiesel has been made successfully.", [{
              text: "Ok",
             }]);

           //reset data     
           setTopics({
            temperature: 0.0,
            flowRate: 0.0,
            liters: 0.0,
            status: 'Not Running',
            carbonFootprint: 0.0,
            biodiesel: 0,
            producingTime: 0, 
            oilVolume: 0,
            energyConsumption: 0.0
          })

          setButtonStart(false);
         }

         else if (topics.status === 'FAILED') {
          // eslint-disable-next-line no-unused-expressions
          Platform.OS === "web"
            ? toast.error("Failed production. Something went wrong")
            : Alert.alert("Failed production", "Something went wrong", [{ text: "OK" }]);
        }

        else { 
           uploadData();
        }
    }

        uploadData();
      }
      
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [topics.status]);



  
  const oilVolume = topics.flowRate * 20; 
  const maxVolume = 5 * 20;
  const remainingVolume = maxVolume - oilVolume; // 1.5 liters 


  const pieData = [
    { value: oilVolume, color: '#DB2777', },
    { value: remainingVolume, color: 'lightgray', },
  ];


  return (
    <DashboardNative
      producingTime={topics.producingTime}
      status={topics.status}
      biodiesel={topics.biodiesel}
      carbonFootprint={topics.carbonFootprint}
      flowRate={topics.flowRate}
      temperature={topics.temperature}
      energyConsumption={topics.energyConsumption}
      pieData={pieData}
    />
  );
}