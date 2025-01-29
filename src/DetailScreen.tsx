import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, updateQuantity } from '../src/store/slices/cartSlice';
import { RootState } from '../src/store/store';
import iphone15 from "../assets/iphone15grey.jpg";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;

const DetailsScreen: React.FC<{ route: DetailsScreenRouteProp; navigation: any }> = ({
  route,
  navigation,
}) => {
  const { product } = route.params;
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [variants, setVariants] = useState<any[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>(product.imageUrls[0]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [remainingTime, setRemainingTime] = useState<string>('');
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchVariants();
    fetchRelatedProducts();
  }, []);

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/products/subcategory/${product.subCategoryId}`);
      const data = await response.json();
      const filteredProducts = data.filter((p: any) => p.id != product.id); 
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  useEffect(() => {
    const launchDate = new Date(product.launchDate);  

    if (launchDate > new Date()) {
      const timer = setInterval(() => {
        updateRemainingTime(launchDate);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [product.launchDate]);

  interface CartItem {
    productId: number;
    skuId: number;
    name: string;
    skuName: string;
    price: number;
    quantity: number;
    image: string;
    productName: string;
  }

  const updateRemainingTime = (launchDate: Date) => {
    const now = new Date();
    const diff = launchDate.getTime() - now.getTime();

    if (diff <= 0) {
      setRemainingTime('');
      return;
    }

    const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
    const days = Math.floor((diff % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    setRemainingTime(
      `${months > 0 ? months + 'm ' : ''}${days}d ${hours}h ${minutes}m ${seconds}s`
    );
  };

  useEffect(() => {
    const variantQuantities: Record<number, number> = {};
    cartItems.forEach((item) => {
      variantQuantities[item.skuId] = item.quantity;
    });
    setQuantities(variantQuantities);
  }, [cartItems]);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/variants/product/${product.id}`);
      const data = await response.json();
      const sortedVariants = data.sort((a: any, b: any) => a.price - b.price);
      setVariants(sortedVariants);
      setSelectedVariant(sortedVariants[0]);
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementQuantity = (skuId: number) => {
    const currentQuantity = quantities[skuId] || 0;
    if (currentQuantity === 0)
      handleAddToCart();
    dispatch(updateQuantity({ skuId, quantity: currentQuantity + 1 }));
  };

  const decrementQuantity = (skuId: number) => {
    const currentQuantity = quantities[skuId] || 0;
    if (currentQuantity > 1) {
      dispatch(updateQuantity({ skuId, quantity: currentQuantity - 1 }));
    } else {
      dispatch(updateQuantity({ skuId, quantity: 0 }));
    }
  };

  const handleAddToCart = () => {
    if (selectedVariant) {
      const currentQuantity = quantities[selectedVariant.skuId] || 0;
      if (currentQuantity === 0) {
        dispatch(
          addToCart({
            productId: product.id,
            skuId: selectedVariant.skuId,
            name: product.name,
            skuName: selectedVariant.name,
            price: selectedVariant.price,
            quantity: 1,
            image: selectedVariant.image ? selectedVariant.image : product.imageUrls[0],
            productName: product.name
          })
        );
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Text style={styles.iconText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Product Details</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>🛒</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {selectedImage && <Image source={{ uri: selectedImage }} style={styles.detailImage} />}
          <View style={styles.imageToggleContainer}>
            {product.imageUrls.map((url, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.imageToggleButton,
                  selectedImage === url && styles.imageToggleSelected,
                ]}
                onPress={() => setSelectedImage(url)}
              />
            ))}
          </View>

          {remainingTime && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>Launching in {remainingTime}</Text>
            </View>
          )}

          {selectedVariant ? (
            <>  
              <Text style={styles.name}>{product.name} - {selectedVariant.name}</Text>
              <Text style={styles.description}>{selectedVariant.description || product.description}</Text>

              <View style={styles.thumbnailRow}>
                {variants.map((variant) => (
                  <TouchableOpacity
                    key={variant.skuId}
                    onPress={() => setSelectedVariant(variant)}
                    style={[
                      styles.thumbnailContainer,
                      selectedVariant.skuId === variant.skuId && styles.selectedThumbnail,
                    ]}
                  >
                    <Image source={variant.image} style={styles.thumbnail} />
                  </TouchableOpacity>
                ))}
              </View>

              <Text>Stocks Left: {selectedVariant.stocksLeft}</Text>
    
            </>
          ) : (
            <>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.description}>{product.description}</Text>
            </>
          )}


          
        </View>

        <View style={styles.relatedContainer}>
          <Text style={styles.relatedTitle}>You may also like</Text>
          {relatedProducts.map((relatedProduct) => (
            <TouchableOpacity
              key={relatedProduct.id}
              style={styles.relatedProduct}
              onPress={() =>
                navigation.push('Details', { product: relatedProduct })
              }
            >
              <Image
                source={{ uri: relatedProduct.imageUrls[0] }}
                style={styles.relatedImage}
              />
              <Text style={styles.relatedName}>{relatedProduct.name}</Text>
              <Text style={styles.relatedPrice}>${relatedProduct.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <View style={styles.priceBox}>
        <View>
          <Text style={styles.priceText}>Price:</Text>
          <Text style={styles.price}>
            ${selectedVariant ? selectedVariant.price : product.price}
          </Text>
        </View>

        {!remainingTime && <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => decrementQuantity(selectedVariant?.skuId || product.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.quantityText}>
            {quantities[selectedVariant?.skuId || product.id] || 0}
          </Text>
          <TouchableOpacity
            onPress={() => incrementQuantity(selectedVariant?.skuId || product.id)}
            style={styles.quantityButton}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>}
      </View>
    </View>
  );
};


export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333333',
  },
  iconButton: {
    padding: 8,
  },
  iconText: {
    fontSize: 20,
    color: '#007BFF',
  },
  priceBox: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  priceText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E29B56',
  },
  detailImage: {
    width: '100%',
    height: 250,
    resizeMode: 'contain',
    marginVertical: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333333',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 16,
  },
  thumbnailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  thumbnailContainer: {
    marginHorizontal: 6,
    padding: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: '#f9f9f9',
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedThumbnail: {
    borderColor: '#E29B56',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 6,
  },
  containerPro: {
    padding: 15,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    marginVertical: 15,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  noVariantText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999999',
    marginVertical: 10,
  },
  imageToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  imageToggleButton: {
    marginHorizontal: 5,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFDAB9',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageToggleSelected: {
    backgroundColor: '#FF8C00',
    borderColor: '#FF4500',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
    marginVertical: 10,
    textAlign: 'center',
  },
  banner: {
    backgroundColor: '#FFF7E3',
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginVertical: 15,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e8e8e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555555',
    marginHorizontal: 5,
  },
  banner: {
    backgroundColor: '#FFF7E3',
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bannerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    textAlign: 'center',
  },
  relatedContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  relatedProduct: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  relatedImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 10,
  },
  relatedName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  relatedPrice: {
    fontSize: 14,
    color: '#666',
  },  
});

