import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';

const Orders: React.FC = () => {
  const [orders, setOrders] = useState([]);
  const [scheduledOrders, setScheduledOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSchedules, setLoadingSchedules] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchScheduledOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://10.0.2.2:8080/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScheduledOrders = async () => {
    setLoadingSchedules(true);
    try {
      const response = await axios.get('http://10.0.2.2:8080/api/orders/schedules');
      setScheduledOrders(response.data);
    } catch (error) {
      console.error('Error fetching scheduled orders:', error);
    } finally {
      setLoadingSchedules(false);
    }
  };

  const cancelOrder = async (orderNumber: string) => {
    try {
      const response = await axios.post(`http://10.0.2.2:8080/api/orders/${orderNumber}/cancel`);
      if (response.status === 200) {
        alert('Order canceled successfully!');
        fetchOrders(); // Refresh the list after canceling
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Failed to cancel the order.');
    }
  };

  const cancelScheduledOrder = async (orderNumber: string) => {
    try {
      const response = await axios.delete(`http://10.0.2.2:8080/api/orders/schedules/cancel/${orderNumber}`);
      if (response.status === 200) {
        alert('Scheduled order canceled successfully!');
        setScheduledOrders(prevScheduledOrders =>
          prevScheduledOrders.filter(order => order.scheduleId !== orderNumber)
        ); // Remove from scheduledOrders state
      }
    } catch (error) {
      console.error('Error canceling scheduled order:', error);
      alert('Failed to cancel the scheduled order.');
    }
  };

  const calculateTimeRemaining = (scheduledTime: string) => {
    const now = new Date();
    const scheduledDate = new Date(scheduledTime);
    const difference = scheduledDate.getTime() - now.getTime();

    if (difference <= 0) {
      return 'Order time has passed';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return `${hours}h ${minutes}m remaining`;
  };

  if (loading || loadingSchedules) {
    return (
      <View style={styles.emptyCartContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
      </View>
    );
  }

  if (orders.length === 0 && scheduledOrders.length === 0) {
    return (
      <View style={styles.emptyCartContainer}>
        <Text style={styles.emptyCartText}>No orders or scheduled orders found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView showsHorizontalScrollIndicator={false}>
        {/* Regular Orders */}
        {orders.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Orders</Text>
            {orders.map((order, index) => (
              <View key={index} style={styles.orderContainer}>
                <Text style={styles.orderNumber}>Order Number: {order.orderNumber}</Text>
                <Text style={styles.orderStatus}>Status: {order.orderStatus}</Text>
                <Text style={styles.totalPrice}>Total Amount: ${order.totalAmount}</Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {order.orderItems.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.carouselItem}>
                      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemSku}>{item.skuName}</Text>
                      <Text style={styles.itemPrice}>${item.price}</Text>
                      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                    </View>
                  ))}
                </ScrollView>

                {order.orderStatus === 'PENDING' && (
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => cancelOrder(order.orderNumber)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel Order</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Scheduled Orders */}
        {scheduledOrders.length > 0 && (
          <View>
            <Text style={styles.sectionHeader}>Scheduled Orders</Text>
            {scheduledOrders.map((order, index) => (
              <View key={index} style={styles.orderContainer}>
                <Text style={styles.orderNumber}>Order Number: {order.orderNumber}</Text>
                <Text style={styles.totalPrice}>Total Amount: ${order.totalAmount}</Text>
                <Text style={styles.scheduledTime}>
                  Scheduled For: {new Date(order.scheduledTime).toLocaleString()}
                </Text>
                <Text style={styles.remainingTime}>
                  {calculateTimeRemaining(order.scheduledTime)}
                </Text>

                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {order.orderItems.map((item, itemIndex) => (
                    <View key={itemIndex} style={styles.carouselItem}>
                      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemSku}>{item.skuName}</Text>
                      <Text style={styles.itemPrice}>${item.price}</Text>
                      <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
                    </View>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => cancelScheduledOrder(order.scheduleId)}
                >
                  <Text style={styles.cancelButtonText}>Cancel Scheduled Order</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  orderContainer: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  scheduledTime: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  remainingTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF8C00',
    marginBottom: 8,
  },
  carouselItem: {
    alignItems: 'center',
    margin: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    width: 200,
  },
  itemImage: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  itemName: {
    fontSize: 14,
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
  totalPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
  },
  cancelButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
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
});

export default Orders;
