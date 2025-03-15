import { Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import DashboardNative from './dashboard-native';
import { useAuth } from '@/providers/authprovider';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner"
import { useButtonStart } from '@/lib/store';
import mqtt from 'mqtt';


   // Initialize the MQTT client
const MQTT_BROKER = "ws://broker.emqx.io:8083/mqtt";
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
    // const client = new Paho.Client(MQTT_BROKER, "ReactNativeClient" + Math.random());
    const client: mqtt.MqttClient = mqtt.connect(MQTT_BROKER, {
      clientId: "ReactNativeClient" + Math.random(),
      keepalive: 7200,
    });
    
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

  console.log('mqtt state', client.connected);

  useEffect(() => {
    const setupMqtt = async () => {
        if (buttonStart) {
          if (!client.connected) {
            try {
              console.log("Connecting to MQTT...");

              client.on("connect", () => {
                console.log("Connected to MQTT!");

                client.publish("recycoil/buttonStart", "true");
                
                client?.subscribe(MQTT_TOPICS, (err) => {
                  if (err) console.error("Subscription Error:", err);
                  else console.log("Subscribed to topics:", MQTT_TOPICS);
                });
              });

              // Handle incoming messages
              client.on("message", (topic, message) => {
                const payload = message.toString();
                console.log(`Received message from ${topic}: ${payload}`);

                const key = topic.split("/").pop() || "";
                let data: number | string = payload;

                if (!isNaN(parseFloat(payload))) {
                  data = parseFloat(payload);
                }

                setTopics((prevTopics) => ({
                  ...prevTopics,
                  [key]: data,
                }));
              });

              client.on("error", (err) => console.error("MQTT Error:", err));
              client.on("disconnect", () =>
                console.warn("Disconnected from MQTT broker.")
              );
            } catch (error) {
              console.error("MQTT Connection Error:", error);
            }
          }
        } 
        
      else {
            if (!client?.connected) {
             try {
                client?.on("connect", () => {
                  client?.publish("recycoil/buttonStart", "false");

                  setTimeout(() => {
                    client?.end(() => {
                      console.log("Disconnected from MQTT");
                    });

                    setTopics({
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
                  }, 2000);
                });
  
             } catch (error) {
                console.warn(error);
             }
          }
        }
    };
  
    setupMqtt();
  
    return () => {
      if (client && client.connected) {
        console.log("Cleanup: Disconnecting MQTT");

        client.end(() => {
          console.log("Cleanup: Disconnected from MQTT");
        });
      }
    };

  }, [buttonStart]);
  
  
  //    useEffect(() => { 
  //     if (buttonStart) { 
  //        if (!client || !client?.connected) { 
  //          client = mqtt.connect(MQTT_BROKER, {
  //            clientId: "ReactNativeClient" + Math.random(),
  //            keepalive: 7200,
  //          });
           
  //           client?.on("connect", () => { 
  //             client?.publish('recycoil/buttonStart', 'true')
  //           })
  //        }
  //     }
  //     else { 
  //       if (!client || !client?.connected) { 
  //         client = mqtt.connect(MQTT_BROKER, {
  //           clientId: "ReactNativeClient" + Math.random(),
  //           keepalive: 7200,
  //         });
          
  //          client?.on("connect", () => { 
  //            client?.publish('recycoil/buttonStart', 'false')
  //          })
  //       } 
  //     }
     
  // }, [buttonStart])

 
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
      flowRate={topics.flowRate}
      temperature={topics.temperature}
      status={topics.status}
      carbonFootprint={topics.carbonFootprint}
      biodiesel={topics.biodiesel}
      producingTime={topics.producingTime}
      energyConsumption={topics.energyConsumption}
      pieData={pieData}
     />
  );
}