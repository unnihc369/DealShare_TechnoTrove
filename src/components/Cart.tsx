import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store'; 
import { updateQuantity } from '../store/slices/cartSlice';  
import { CartItem } from '../store/slices/cartSlice';  

const Cart: React.FC = () => {
  const { items } = useSelector((state: RootState) => state.cart); 
  const dispatch = useDispatch();

  const [currentSkuIndex, setCurrentSkuIndex] = useState<number>(0); 

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
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Order Now</Text>
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
    flexDirection:'row',
    gap:15,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
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
});

export default Cart;
