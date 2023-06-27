import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Lottie from 'lottie-react-native';
import {Calendar} from 'react-native-calendars';
import {firebase} from '@react-native-firebase/firestore';
import {
  VictoryArea,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryZoomContainer,
} from 'victory-native';

const RecordsScreen = () => {
  const [deviceId, setDeviceId] = useState('');

  const currentUser = firebase.auth().currentUser;

  const [behaviorData, setBehaviorData] = useState([]);

  const [loading, setLoading] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [humiData, setHumiData] = useState([]);
  const [averageTemperature, setAverageTemperature] = useState(0);
  const [averageHumidity, setAverageHumidity] = useState(0);

  const [selectedDate, setSelectedDate] = useState(null);
  const retrieveSensorValues = async (deviceId, selectedDate) => {
    setLoading(true);
    try {
      const sensorDataRef = firebase
        .firestore()
        .collection('users')
        .doc(currentUser.email)
        .collection('devicesData');
      const deviceDocRef = sensorDataRef.doc(deviceId);

      const deviceDoc = await deviceDocRef.get();

      if (deviceDoc.exists) {
        const sensorValues = deviceDoc.data().sensorValues || [];

        // Filter sensor values based on the selected date
        const filteredValues = sensorValues.filter(value => {
          const timestamp = value.timestamp.toDate(); // Convert Firestore timestamp to JavaScript Date object
          const valueDate = timestamp.toISOString().split('T')[0]; // Extract the date part of the timestamp
          return valueDate === selectedDate;
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
        Alert.alert('Device ID does not exist.');
        setLoading(false);
      }
    } catch (error) {
      Alert.alert('Error retrieving sensor values:', error);
    }
  };

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

  const handleDateSelect = day => {
    setSelectedDate(day.dateString);
    // Call the function to retrieve sensor values for the selected date
    retrieveSensorValues(deviceId, day.dateString);
    console.log(selectedDate);
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

  if (loading) {
    return (
      <SafeAreaView
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
      </SafeAreaView>
    );
  }
  if (tempData.length && humiData.length > 0) {
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
          Records
        </Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{alignItems: 'center', padding: 20}}>
            <TextInput
              style={styles.input}
              placeholder="Device ID"
              value={deviceId}
              onChangeText={text => setDeviceId(text)}
            />
          </View>

          <Calendar
            disableMonthChange={false} // Allow selection of the current day
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {selected: true, selectedColor: '#0087B2'},
            }}
          />
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
              // fontSize: 18,
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
  } else {
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
          Records
        </Text>
        <View style={{alignItems: 'center', padding: 20}}>
          <TextInput
            style={styles.input}
            placeholder="Device ID"
            value={deviceId}
            onChangeText={text => setDeviceId(text)}
          />
        </View>
        <View>
          <Calendar
            disableMonthChange={false} // Allow selection of the current day
            onDayPress={handleDateSelect}
            markedDates={{
              [selectedDate]: {selected: true, selectedColor: '#0087B2'},
            }}
          />

          <Text
            style={{
              fontWeight: 'bold',
              fontSize: 30,
              textAlign: 'center',
              color: '#0087B2',
              marginTop: 100,
            }}>
            No Data Found !
          </Text>
        </View>
      </SafeAreaView>
    );
  }
};

export default RecordsScreen;

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
  input: {
    height: 50,
    width: '50%',
    textAlign: 'center',
    borderWidth: 1,
    borderColor: '#BCCFE3',
    borderRadius: 30,
    marginBottom: 15,
    color: '#0087B2',
  },
});
