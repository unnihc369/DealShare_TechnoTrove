import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { toggleLikeProduct } from '../store/slices/likedProductSlices';

const LikedProducts = ({ navigation }) => {
    const dispatch = useDispatch();
    const likedProducts = useSelector((state: RootState) => state.likedProducts.likedProducts);

    const handleRemove = (product) => {
        dispatch(toggleLikeProduct(product));
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerTitle}>Liked Products</Text>
            {likedProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>You haven't liked any products yet!</Text>
                </View>
            ) : (
                <FlatList
                    data={likedProducts}
                    numColumns={2}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <TouchableOpacity onPress={() => navigation.navigate('Details', { product: item })}>
                                <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
                            </TouchableOpacity>

                            <Text style={styles.name}>
                                {item.name.length > 14 ? `${item.name.slice(0, 14)}...` : item.name}
                            </Text>

                            <Text style={styles.price}>${item.price}</Text>

                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => navigation.navigate('Details', { product: item })}
                            >
                                <Text style={styles.detailsButtonText}>View Details</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.detailsButton}
                                onPress={() => handleRemove(item)}
                            >
                                <Text style={styles.detailsButtonText}>Remove</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
};


const styles = StyleSheet.create({
    container:{
        marginTop:15,
        marginBottom:150,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom:15,
    },
    iconButton: {
        padding: 8,
    },
    iconText: {
        fontSize: 20,
    },
    emptyContainer: {
        flex: 1,
        height:200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 8,
        margin: 8,
        width:100,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        // marginBottom: 15,
    },
    price: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#E29B56',
        marginVertical: 6,
    },
    image: {
        width: 100,
        height: 100,
        backgroundColor: '#efedfd',
        borderRadius: 6,
        margin: 'auto',
    },
    name: {
        fontSize: 16,
        marginTop: 10,
        fontWeight: 'bold',
    },
    detailsButton: {
        marginTop: 10,
        padding: 8,
        backgroundColor: '#E29B56',
        borderRadius: 4,
        alignItems: 'center',
    },
    detailsButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LikedProducts;
