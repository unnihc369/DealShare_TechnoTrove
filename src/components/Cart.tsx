import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, TextInput } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { updateQuantity, clearCart } from '../store/slices/cartSlice';
import axios from 'axios';

const Cart: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const [currentSkuIndex, setCurrentSkuIndex] = useState<number>(0);
  const [scheduledTime, setScheduledTime] = useState<string>('2025-01-29 11:07'); 

  useEffect(() => {
    const skuToggleInterval = setInterval(() => {
      setCurrentSkuIndex((prevIndex) => (prevIndex + 1) % items.length);
    }, 2000);

    return () => clearInterval(skuToggleInterval);
  }, [items.length]);

  const handleQuantityChange = (skuId: number, quantity: number) => {
    dispatch(updateQuantity({ skuId, quantity }));
  };

  const calculateTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const orderNow = async () => {
    const orderPayload = {
      orderNumber: `ORD${Date.now()}`, // Generate a unique order number
      orderItems: items.map((item) => ({
        productId: item.productId,
        skuId: item.skuId,
        skuName: item.skuName,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image,
      })),
      totalAmount: calculateTotalPrice(),
    };

    try {
      const response = await axios.post('http://10.0.2.2:8080/api/orders', orderPayload);
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Order Successful', 'Your order has been placed successfully!');
        dispatch(clearCart()); // Clear the cart state
      }
    } catch (error) {
      Alert.alert('Order Failed', 'There was an issue placing your order. Please try again later.');
      console.error('Order API Error:', error);
    }
  };

  const scheduleOrder = async () => {
    if (!scheduledTime || !/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(scheduledTime)) {
      Alert.alert('Invalid Time', 'Please enter a valid time in the format YYYY-MM-DD HH:mm.');
      return;
    }

    const formattedTime = scheduledTime.replace(' ', 'T') + ':00';

    console.log('Formatted Scheduled Time:', formattedTime);

    const orderPayload = {
      orderNumber: `ORD${Date.now()}`, // Generate a unique order number
      scheduledTime:formattedTime, // Add the scheduled time
      orderItems: items.map((item) => ({
        productId: item.productId,
        skuId: item.skuId,
        skuName: item.skuName,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image,
      })),
      totalAmount: calculateTotalPrice(),
    };

    try {
      const response = await axios.post('http://10.0.2.2:8080/api/orders/schedules', orderPayload);
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Order Scheduled', 'Your order has been scheduled successfully!');
        dispatch(clearCart()); // Clear the cart state
      }
    } catch (error) {
      Alert.alert('Scheduling Failed', 'There was an issue scheduling your order. Please try again later.');
      console.error('Order API Error:', error);
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>Your cart is empty</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={index} style={styles.carouselItem}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <Text style={styles.itemName}>{item.name} - {item.skuName}</Text>
            <Text style={styles.itemPrice}>${item.price}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>

            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.skuId, item.quantity - 1)}
                style={styles.quantityButton}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => handleQuantityChange(item.skuId, item.quantity + 1)}
                style={styles.quantityButton}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.totalContainer}>
        <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice()}</Text>

        <TouchableOpacity style={styles.editButton} onPress={orderNow}>
          <Text style={styles.editButtonText}>Order Now</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Enter scheduled time (YYYY-MM-DD HH:mm)"
          value={scheduledTime}
          onChangeText={setScheduledTime}
          style={styles.input}
        />



        <TouchableOpacity style={styles.scheduleButton} onPress={scheduleOrder}>
          <Text style={styles.scheduleButtonText}>Schedule Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  carouselItem: {
    alignItems: 'center',
    margin: 'auto',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 200,
    marginBottom: 10
  },
  itemImage: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  itemName: {
    fontSize: 14,
    // fontWeight: 'bold',
    marginVertical: 8,
  },
  itemSku: {
    fontSize: 14,
    color: '#555',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#E29B56',
    margin: 5,
    borderRadius: 5,
  },
  totalContainer: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'column', // Horizontal alignment of children
    alignItems: 'center', // Center items vertically
    justifyContent: 'space-between', // Space between child elements
    gap: 10, // Consistent spacing between children
    width: '100%', // Full width of the container
  },
  totalPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  editButton: {
    backgroundColor: '#FF8C00',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyCartText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  input: { borderWidth: 1, borderColor: 'gray', borderRadius: 5, padding: 10, width: 300, marginBottom: 10 },
  scheduleButton: { backgroundColor: '#2196F3', padding: 15, borderRadius: 5, marginVertical: 10, width: '100%' },
  scheduleButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
});

export default Cart;
