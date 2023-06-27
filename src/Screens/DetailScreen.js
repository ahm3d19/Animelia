import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Lottie from 'lottie-react-native';
import {firebase} from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';

import {
  VictoryArea,
  VictoryChart,
  VictoryLine,
  VictoryZoomContainer,
  VictoryPie,
} from 'victory-native';

const DetailScreen = ({route}) => {
  const deviceId = route.params.deviceId;

  const currentUser = firebase.auth().currentUser;

  const [behaviorData, setBehaviorData] = useState([]);

  const [tempData, setTempData] = useState([]);
  const [humiData, setHumiData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [averageTemperature, setAverageTemperature] = useState(0);
  const [averageHumidity, setAverageHumidity] = useState(0);

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const calculateAverageTemperature = data => {
    if (data.length === 0) return 0;

    const sum = data.reduce((total, point) => total + point.y, 0);
    return sum / data.length;
  };
  const calculateAverageHumidity = data => {
    if (data.length === 0) return 0;

    const sum = data.reduce((total, point) => total + point.y, 0);
    return sum / data.length;
  };

  // Function to retrieve sensor values for a specific device within a 24-hour range
  const retrieveSensorValues = async deviceId => {
    try {
      const sensorDataRef = firestore()
        .collection('users')
        .doc(currentUser.email)
        .collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      const deviceDoc = await deviceDocRef.get();

      if (deviceDoc.exists) {
        const sensorValues = deviceDoc.data().sensorValues || [];

        // Filter sensor values based on timestamp within the specified range
        const filteredValues = sensorValues.filter(value => {
          const timestamp = value.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
          return timestamp >= startOfDay && timestamp <= endOfDay;
        });

        setBehaviorData(filteredValues);

        const tempReadings = filteredValues.map(value => ({
          x: value.timestamp.toDate(),
          y: value.temp,
        }));
        setAverageTemperature(calculateAverageTemperature(tempReadings));
        setTempData(tempReadings);
        const humiReadings = filteredValues.map(value => ({
          x: value.timestamp.toDate(),
          y: value.humi,
        }));
        setAverageHumidity(calculateAverageHumidity(humiReadings));
        setHumiData(humiReadings);
        setLoading(false);
      } else {
        Alert.alert('Device document does not exist.');
      }
    } catch (error) {
      Alert.alert('Error retrieving sensor values:', error);
    }
  };
  // Count the occurrences of each behavior
  const behaviorCounts = behaviorData.reduce((counts, value) => {
    const behavior = value.behave;
    counts[behavior] = (counts[behavior] || 0) + 1;
    return counts;
  }, {});

  // Calculate the total count of behaviors
  const totalCount = Object.values(behaviorCounts).reduce(
    (total, count) => total + count,
    0,
  );

  // Calculate the percentages of each behavior
  const behaviorPercentages = {};
  for (const behavior in behaviorCounts) {
    const count = behaviorCounts[behavior];
    const percentage = (count / totalCount) * 100;
    behaviorPercentages[behavior] = percentage.toFixed(2); // Round to 2 decimal places
  }

  // Format the data for the Victory graph
  const graphData = Object.entries(behaviorPercentages).map(
    ([behavior, percentage]) => ({
      behavior,
      percentage: parseFloat(percentage),
    }),
  );

  // Get the earliest and latest timestamps
  const timestamps = behaviorData.map(value => value.timestamp.toDate());
  const earliestTimestamp = new Date(Math.min(...timestamps));
  const latestTimestamp = new Date(Math.max(...timestamps));

  // Calculate the time difference
  const timeDifferenceMs = latestTimestamp - earliestTimestamp;

  // Convert the time difference into the desired format
  const hours = Math.floor(timeDifferenceMs / 3600000);
  const minutes = Math.floor((timeDifferenceMs % 3600000) / 60000);
  const seconds = Math.floor((timeDifferenceMs % 60000) / 1000);

  useEffect(() => {
    retrieveSensorValues(deviceId);
    const interval = setInterval(() => {
      retrieveSensorValues(deviceId);
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Lottie
          source={require('../Loading/Loader.json')}
          autoPlay
          loop
          style={{height: 160, width: 160}}
        />
      </View>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 30,
          textAlign: 'center',
          color: '#0087B2',
          marginBottom: 20,
        }}>
        Live Data
      </Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            padding: 20,

            color: '#0087B2',
          }}>
          ID: {deviceId}
        </Text>

        {/* Activity Chart */}
        <Text
          style={{
            fontWeight: '500',
            fontSize: 18,
            paddingLeft: 20,
            paddingTop: 20,
          }}>
          Activity Chart
        </Text>
        <Text
          style={{
            fontWeight: '500',

            paddingLeft: 20,
            paddingTop: 20,
          }}>
          Device Active: {hours}hr : {minutes}min : {seconds}sec
        </Text>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 30,
          }}>
          <VictoryPie
            data={graphData}
            x="behavior"
            y="percentage"
            height={280} // Set the desired height of the pie
            labels={({datum}) => `${datum.behavior}: ${datum.percentage}%`}
            innerRadius={70}
            style={{
              labels: {
                fontSize: 14,
                fill: '#000',
              },

              data: {
                fillOpacity: 0.9,
                stroke: 'white',
                strokeWidth: 3,
                fill: ({datum}) => {
                  // Customize fill color based on behavior
                  switch (datum.behavior) {
                    case 'Active':
                      return '#2D7A8A';
                    case 'Resting':
                      return '#7AD0D9';
                    case 'Other':
                      return '#DAF6ED';
                    // Add more cases for additional behaviors
                    default:
                      return 'gray';
                  }
                },
              },
            }}
          />
        </View>

        {/* Temperature Graph */}
        <Text
          style={{
            fontWeight: '500',
            fontSize: 18,
            paddingLeft: 20,
            paddingTop: 20,
          }}>
          Temperature Graph
        </Text>
        <VictoryChart
          height={200}
          padding={{top: 30, left: 50, right: 50, bottom: 30}}
          containerComponent={
            <VictoryZoomContainer responsive={false} zoomDimension="x" />
          }
          animate={{
            duration: 2000,
            onLoad: {duration: 2000},
          }}>
          <VictoryArea
            data={tempData}
            interpolation="natural"
            style={{
              data: {
                fill: 'lightblue',
                stroke: 'teal',
              },
            }}
          />
          <VictoryLine
            data={[
              {x: tempData[0]?.x, y: averageTemperature},
              {
                x: tempData[tempData.length - 1]?.x,
                y: averageTemperature,
              },
            ]}
            style={{
              data: {stroke: '#0087B2'},
            }}
          />
        </VictoryChart>

        {/* Humidity Graph */}
        <Text
          style={{
            fontWeight: '500',
            fontSize: 18,
            paddingLeft: 20,
            paddingTop: 20,
          }}>
          Humidity Graph
        </Text>
        <VictoryChart
          height={200}
          padding={{top: 30, left: 50, right: 50, bottom: 30}}
          containerComponent={
            <VictoryZoomContainer responsive={false} zoomDimension="x" />
          }
          animate={{
            duration: 2000,
            onLoad: {duration: 2000},
          }}>
          <VictoryArea
            data={humiData}
            interpolation="natural"
            style={{data: {fill: 'lightblue', stroke: 'teal'}}}
          />
          <VictoryLine
            data={[
              {x: humiData[0]?.x, y: averageHumidity},
              {
                x: humiData[humiData.length - 1]?.x,
                y: averageHumidity,
              },
            ]}
            style={{
              data: {stroke: '#0087B2'},
            }}
          />
        </VictoryChart>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
