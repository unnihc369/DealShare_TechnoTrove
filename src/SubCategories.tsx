import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import mobile from "../assets/iphone.jpg";

const Subcategories = ({ route, navigation }) => {
    const { id } = route.params;
    const [subcategories, setSubcategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSubcategories = async () => {
            try {
                const response = await axios.get(`http://10.0.2.2:8080/api/subcategories/category/${id}`);
                setSubcategories(response.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Text style={styles.iconText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Sub Category</Text>
                <TouchableOpacity style={styles.iconButton}>
                    <Text style={styles.iconText}>🛒</Text>
                </TouchableOpacity>
            </View>
            
            <FlatList
                data={subcategories}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => navigation.navigate('Products', { subCategoryId: item.id })}
                    >
                        <Image source={{uri:item.imageUrl}} style={styles.image} />
                        <Text style={styles.name}>
                            {item.name.length > 14 ? item.name.slice(0, 14) + '...' : item.name}
                        </Text>
                    </TouchableOpacity>
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
    image: {
        width: 120,
        height: 120,
        resizeMode: 'contain',
        backgroundColor: '#efedfd',
        borderRadius: 6,
        margin: 'auto',
    },
    name: {
        fontSize: 14,
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default Subcategories;
