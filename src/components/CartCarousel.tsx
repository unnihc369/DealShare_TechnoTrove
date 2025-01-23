import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store'; 
import { RootStackParamList } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

type CartNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const CartCarousel: React.FC<{ navigation: CartNavigationProp }> = () => {
  const { items } = useSelector((state: RootState) => state.cart); 
  const navigate = useNavigation();
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {items.map((item, index) => (
          <View key={index} style={styles.carouselItem}>

            <Image source={{ uri: item.image }} style={styles.itemImage} />

            <View style={styles.details}>
            <Text style={styles.itemName}>{item.name} - {item.skuName}</Text>
            <Text style={styles.itemQuantity}>Quantity: {item.quantity} - ${item.price}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.totalContainer}>
        <Text style={styles.totalPrice}>Total Price: ${calculateTotalPrice()}</Text>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText} onPress={()=>navigate.navigate('Cart')}>Edit Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:8,
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    backgroundColor:'#ccc',
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: -2 }, 
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  details:{
   width:270,
  },
  carouselItem: {
    alignItems: 'center',
    margin: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    flexDirection:'row',
    gap:15,
    padding:10,
    shadowRadius: 4,
    elevation: 3,
    width: 250
  },
  itemImage: {
    width: 55,
    height: 55,
    resizeMode: 'contain',
  },
  itemName: {
    fontSize: 14,
    fontWeight: 'bold',
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
    // marginTop: 10,
  },
  quantityButton: {
    padding: 10,
    backgroundColor: '#E29B56',
    margin: 5,
    borderRadius: 5,
  },
  totalContainer: {
    marginTop: 2,
    marginBottom:-7,
    padding: 8,
    backgroundColor: '#fff',
    borderTopRightRadius:10,
    borderTopLeftRadius:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    flexDirection:'row',
    gap: 35,
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

export default CartCarousel;
