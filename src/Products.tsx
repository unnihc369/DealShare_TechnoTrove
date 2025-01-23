import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import likedbtn from "../assets/whiteHeart.png";
import likebtn from "../assets/heart.jpg";
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { toggleLikeProduct } from '../src/store/slices/likedProductSlices';

const Products = ({ route, navigation }) => {
    const { subCategoryId } = route.params;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const likedProducts = useSelector((state: RootState) => state.likedProducts.likedProducts);
    
    const isLiked = (productId) => {
        return likedProducts.some((product) => product.id === productId);
    };

    const handleToggleLike = (product) => {
        dispatch(toggleLikeProduct(product));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:8080/api/products/subcategory/${subCategoryId}`);
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [subCategoryId]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Text style={styles.iconText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Products</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.iconText}>🛒</Text>
                </TouchableOpacity>
            </View>

            {/* Product List */}
            <FlatList
                data={products}
                numColumns={2}
                keyExtractor={(item) => item.id.toString()} // Ensure the key is a string
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        {/* Like Button */}
                        <TouchableOpacity
                            style={styles.likeButton}
                            onPress={() => handleToggleLike(item)}
                        >
                            {isLiked(item.id) ? (
                                <Image source={likebtn} style={styles.likebtn} />
                            ) : (
                                <Image source={likedbtn} style={styles.likebtn} />
                            )}
                        </TouchableOpacity>

                        {/* Product Image */}
                        <TouchableOpacity onPress={() => navigation.navigate('Details', { product: item })}>
                            <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
                        </TouchableOpacity>

                        {/* Product Name */}
                        <Text style={styles.name}>
                            {item.name.length > 14 ? `${item.name.slice(0, 14)}...` : item.name}
                        </Text>

                        {/* Product Price */}
                        <Text style={styles.price}>${item.price}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 60,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    iconButton: {
        padding: 8,
    },
    iconText: {
        fontSize: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
    },
    loadingText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 8,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        marginBottom: 15,
    },
    likeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        borderRadius: 50,
        padding: 2,
        height: 18,
        width: 18,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
        marginBottom: 15,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E29B56',
        marginVertical: 6,
    },
    likebtn: {
        height: 18,
        width: 18,
        borderRadius: 50,
        backgroundColor: "#000",
    },
    likeIcon: {
        fontSize: 16,
        color: '#ccc',
    },
    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        backgroundColor: '#efedfd',
        borderRadius: 6,
        margin: 'auto',
    },
    name: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
    },
});

export default Products;
