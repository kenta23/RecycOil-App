import { Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/providers/authprovider';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner"
import { useBTconnection, useButtonStart } from '@/lib/store';
import mqtt from 'mqtt';
import Dashboard from './dashboard';

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
     'recycoil/energyConsumption',
     'recycoil/machineStatus',
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
  const { setButtonStart, buttonStart } = useButtonStart();
  const { BTconnected } = useBTconnection();
  const [loading, setLoading] = useState<boolean>(false);
  
  // const client = new Paho.Client(MQTT_BROKER, "ReactNativeClient" + Math.random());
  const client: mqtt.MqttClient = mqtt.connect(MQTT_BROKER, {
    clientId: "ReactNativeClient" + Math.random(),
    keepalive: 7200,
  });
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const device = BTconnected?.name || location?.latitude.toString();
  const [isResponseReceived, setIsResponseReceived] = useState(false);
  const [finished, setFinished] = useState<boolean>(false);


  const [topics, setTopics] = useState<topicsDT>({
    temperature: 0.0,
    flowRate: 0.0,
    liters: 0.0,
    status: "Not Running",
    carbonFootprint: 0.0,
    producingTime: 0,
    biodiesel: 0.0,
    oilVolume: 0.0,
    energyConsumption: 0.0,
  });

  console.log(topics);
  console.log("buttonStart", buttonStart);


  useEffect(() => {
    let timeout: string | number | NodeJS.Timeout | undefined; // Declare timeout variable for cleanup
  
    if (!isResponseReceived) {
      timeout = setTimeout(() => {
        console.log("⏳ No response received from recycoil/machineStatus! Closing connection.");
        Platform.OS === "web" ? toast.error("No machine is connected. Closing connection.") : Alert.alert("No machine is connected", "Closing connection.", [{ text: "OK" }]); 
        client.publish("recycoil/buttonStart", "false", { qos: 2 });
        setLoading(false);
        setButtonStart(false);
  
        client.end(() => {
          console.log("🔌 Disconnected from MQTT due to no response.");
        });
      }, 8000);
    }
  
    const setupMqtt = async () => {
      console.log('device', device);
      const isMobile = Platform.OS === 'ios' || Platform.OS === 'android';
  
      if (Platform.OS === 'web') {
        window.navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        });
      }
  
      if (loading) {

        if (!client.connected) {
          try {
            console.log("Connecting to MQTT...");
  
            client.on("connect", async () => {
              console.log("Connected to MQTT!"); 
  
              client.publish(`recycoil/${device}/buttonStart`, "true");
              client.publish("recycoil/buttonStart", "true");
              client.publish("recycoil/deviceId", device || "", { qos: 2 });
  
              client.subscribe(["recycoil/machineStatus"], { qos: 2 }, (err) => {
                if (err) console.error("❌ Subscription Error:", err);
                else console.log("✅ Subscribed to machineStatus");
              });
            });
  
            client.on("message", (topic, message) => {
              const payload = message.toString();
              console.log(`Received message from ${topic}: ${payload}`);
  
              if (topic === "recycoil/machineStatus") {
                console.log("Machine Status:", payload);
  
                if (payload === "ready") {
                  console.log("✅ Machine is ready! Publishing buttonStart: true");
                  client.publish(`recycoil/buttonStart`, "true", { qos: 2 });
  
                  setIsResponseReceived(true);
                  clearTimeout(timeout); // Cancel disconnect timeout
                  setLoading(false);
                  setButtonStart(true);
                } else {
                  console.log("❌ Machine is not ready! Publishing buttonStart: false");
                  client.publish("recycoil/buttonStart", "false");
                  setButtonStart(false);
                }
              }
            });
  
            client.on("error", (err) => console.error("MQTT Error:", err));
            client.on("disconnect", () => console.warn("Disconnected from MQTT broker."));
          } catch (error) {
            console.error("MQTT Connection Error:", error);
          }
        }
      }
  
      // ✅ If machine is started, subscribe and continue reading data
     if (buttonStart && isResponseReceived && !loading) {
        console.log("✅ Machine is running. Subscribing to topics...");
        client.subscribe(MQTT_TOPICS, (err) => {
          if (err) console.error("Subscription Error:", err);
          else console.log("✅ Subscribed to topics:", MQTT_TOPICS);
        });
  
        client.on("message", async (topic, message) => {
          const payload = message.toString();
          const key = topic.split("/").pop() || "";
          let data = isNaN(parseFloat(payload)) ? payload : parseFloat(payload);
  
          setTopics((prevTopics) => ({
            ...prevTopics,
            [key]: data,
          }));

          if (topic === 'recycoil/biodiesel' && message.toString() !== '0.0') {
               setFinished(true);
           }
        });
        
      }

      if (!buttonStart && isResponseReceived) {
        console.log("🔴 Closing the machine. Disconnecting from MQTT...");
  
        setTimeout(() => {
          if (client.connected) {
            client.end(() => {
              console.log("✅ Disconnected from MQTT.");
            });
          }
  
          setIsResponseReceived(false); 
          client.publish("recycoil/buttonStart", "false", { qos: 2 });
          client.publish('recycoil/machineStatus', "idle");
          //Reset topics data
          setTopics({
            temperature: 0.0,
            flowRate: 0.0,
            liters: 0.0,
            status: "Not Running",
            carbonFootprint: 0.0,
            producingTime: 0,
            biodiesel: 0.0,
            oilVolume: 0.0,
            energyConsumption: 0.0,
          });
        }, 5000);
      }
    };
  
    setupMqtt();
  
    return () => {
      clearTimeout(timeout);
  
      if (client && client.connected) {
        console.log("Cleanup: Disconnecting MQTT");
        client.end(() => {
          console.log("Cleanup: Disconnected from MQTT");
        });
      }
    };
  }, [loading, isResponseReceived, buttonStart]);
  

  //save the data from the supabase database if the status is successful or failed
  useEffect(() => {
    if (topics.status === "SUCCESSFUL") {
      async function uploadData() {

        const formatTime = (seconds: number) => {
          if (!seconds || isNaN(seconds)) return "00:00:00"; // Default value if null/undefined
          const hrs = Math.floor(seconds / 3600).toString().padStart(2, "0");
          const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
          const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
          return `${hrs}:${mins}:${secs}`;
        };

        //update the last data with status of running 
       let { data: datalogs, error, status: uploadStatus} = await supabase.from('datalogs').insert({
          status: topics.status,
          flow_rate: topics.flowRate,
          production_time: formatTime(topics.producingTime),  // Convert producingTime to string
          temperature: topics.temperature,
          oil_volume: topics.oilVolume || 0,
          biodiesel: topics.biodiesel || 0,
          carbon_footprint: topics.carbonFootprint || 0,
          energy_consumption: topics.energyConsumption || 0,
          user_id: session?.user.id
        })

        if (error) {
          alert(error.message);
          setButtonStart(false);

          if (client.connected) {
            client.end(() => {
              console.log("✅ Disconnected from MQTT after failed data upload.");
            });
          }
        }
  
        console.log("UPLOADSTATUS", uploadStatus);
  
        if (uploadStatus === 201 || uploadStatus === 200) {
          console.log(datalogs);
  
          Platform.OS === "web"
            ? toast.success("Your Biodiesel has been made successfully.")
            : Alert.alert("Successful", "Your Biodiesel has been made successfully.", [{ text: "Ok" }]);
  
          setButtonStart(false);
          setFinished(true);

          client.publish("recycoil/buttonStart", "false", { qos: 2 });
  
          // ✅ Now disconnect from MQTT AFTER successful upload
          if (client.connected) {
            client.end(() => {
              console.log("✅ Disconnected from MQTT after successful data upload.");
            });
          }
        } else if (topics.status === "FAILED") {
          Platform.OS === "web"
            ? toast.error("Failed production. Something went wrong")
            : Alert.alert("Failed production", "Something went wrong", [{ text: "OK" }]);
        } else {
          uploadData();
        }
      }
  
      uploadData();
    }
  }, [topics.status]);
  


  const oilVolume = topics.flowRate * 20;
  const maxVolume = 5 * 20;
  const remainingVolume = maxVolume - oilVolume; // 1.5 liters

  const pieData = [
    { value: oilVolume, color: "#DB2777" },
    { value: remainingVolume, color: "lightgray" },
  ];


  return (
    <Dashboard
      loading={loading}
      setFinished={setFinished}
      finished={finished}
      setLoading={setLoading}
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