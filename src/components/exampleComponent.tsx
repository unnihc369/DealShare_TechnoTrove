import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { increment, decrement, setValue } from '../store/slices/exampleSlice';

const ExampleComponent = () => {
  const value = useSelector((state: RootState) => state.example.value);
  const dispatch = useDispatch();

  return (
    <View style={styles.container}>
      <Text style={styles.value}>Value: {value}</Text>
      <Button title="Increment" onPress={() => dispatch(increment())} />
      <Button title="Decrement" onPress={() => dispatch(decrement())} />
      <Button title="Set to 10" onPress={() => dispatch(setValue(10))} />
    </View>
  );
};

export default ExampleComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: 24,
    marginBottom: 16,
  },
});
