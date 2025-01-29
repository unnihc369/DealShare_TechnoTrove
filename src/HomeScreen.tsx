import React, { useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import axios from 'axios';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../App';
import likedbtn from "../assets/whiteHeart.png";
import likebtn from "../assets/heart.jpg";
import mobile from "../assets/iphone.jpg";
import searchIcon from "../assets/search.png";
import LikedProducts from './components/LikedProducts';
import CartCarousel from './components/CartCarousel';
import Cart from './components/Cart';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from './store/store';
import { toggleLikeProduct } from './store/slices/likedProductSlices';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  subCategoryId: number;
  launchDate: string;
  status: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  price: number;
  imageUrls: string[];
}


const HomeScreen: React.FC<{ navigation: HomeScreenNavigationProp }> = ({ navigation }) => {
  const [selectedButton, setSelectedButton] = useState<string>('All');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, SetCategories] = useState({});
  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const dispatch = useDispatch();


  const likedProducts = useSelector((state: RootState) => state.likedProducts.likedProducts);
  const { items } = useSelector((state: RootState) => state.cart);
  const [searchText, setSearchText] = useState("");
  const [searchedText, setSearchedText] = useState("");

  const handleInputChange = (text: string) => {
    setSearchText(text);
  };

  const handleSearchSubmit = async () => {

    if (searchText.trim()) {

      try {
        const formattedSearchText = searchText.toLowerCase()
          .split(" ")
          .filter((word) => word.trim() !== "")
          .join("");
        console.log(formattedSearchText)
        const response = await axios.get(
          `http://10.0.2.2:8080/api/products/search?tag=${formattedSearchText}`
        );
        setSearchedText(searchText);
        setSearchResults(response.data);
        setIsSearchActive(true);
      } catch (error) {
        console.error("Error searching products:", error);
      }
    }
  };

  const isLiked = (productId) => {
    return likedProducts.some((product) => product.id == productId);
  };

  const handleToggleLike = (product) => {
    dispatch(toggleLikeProduct(product));
  };

  const handlePress = (title: string) => {
    setSelectedButton(title);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:8080/api/variants/frequent-products/2');
        const fetchedProducts = response.data.map((product: any) => ({
          id: product.id.toString(),
          name: product.name,
          description: product.description,
          categoryId: product.categoryId,
          subCategoryId: product.subCategoryId,
          launchDate: product.launchDate,
          status: product.status,
          tags: JSON.parse(product.tags),
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
          price: product.price,
          imageUrls: product.imageUrls,
        }));

        setProducts(fetchedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const buttons = ['All', 'Mobile', 'Laptop', 'Home Applications'];

  const likeBtn = '../assests/whiteHeart.png'

  interface Category {
    id: string;
    name: string;
    imageUrl: string;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:8080/api/categories');
        SetCategories(response.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.headTitle}>TechnoTrove</Text>
      <View style={styles.searchBar}>
        <TextInput style={styles.search} onChangeText={handleInputChange} placeholder="Search here.." />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearchSubmit}>
          <Image source={searchIcon} style={styles.searchIc} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isSearchActive && (
          <View>
            <Text style={styles.header}>Search Results for "{searchedText}"</Text>
            {searchResults.length > 0 ? (
              <FlatList
                data={searchResults}
                numColumns={2}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.card}>
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

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('Details', { product: item })
                      }
                    >
                      <Image
                        source={{ uri: item.imageUrls[0] }}
                        style={styles.image}
                      />
                    </TouchableOpacity>

                    <Text style={styles.name}>
                      {item.name.length > 14
                        ? `${item.name.slice(0, 14)}...`
                        : item.name}
                    </Text>

                    <Text style={styles.price}>{item.price}</Text>
                  </View>
                )}
              />
            ) : (
              <Text style={styles.noResultsText}>No results found.</Text>
            )}
          </View>
        )}


        {/* Filter buttons */}
        <View style={styles.tabs}>
          <FlatList
            data={buttons}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.button, selectedButton === item && styles.selectedButton]}
                onPress={() => handlePress(item)}
              >
                <Text
                  style={[
                    styles.buttonText,
                    selectedButton === item && styles.selectedButtonText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <Text style={styles.header}>Popular Products</Text>
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
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

              <TouchableOpacity onPress={() => navigation.navigate('Details', { product: item })}>
                <Image source={{ uri: item.imageUrls[0] }} style={styles.image} />
              </TouchableOpacity>

              <Text style={styles.name}>
                {item.name.length > 14 ? `${item.name.slice(0, 14)}...` : item.name}
              </Text>

              <Text style={styles.price}>{item.price}</Text>
            </View>
          )}
        />

        {/* Categories Section */}
        <Text style={styles.header}>Categories</Text>
        <FlatList
          data={categories}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('SubCategories', { id: item.id })}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.image} />
              <Text style={styles.name}>
                {item.name.length > 14 ? `${item.name.slice(0, 14)}...` : item.name}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.containerOrder}>
          <Text style={styles.title}>Want to see your previous orders?</Text>
          <TouchableOpacity style={styles.buttonOrders} onPress={()=>navigation.push('Orders')}>
            <Text style={styles.buttonTextOrders}>View Orders</Text>
          </TouchableOpacity>
        </View>

        {/* Liked Products Section */}
        <LikedProducts navigation={navigation} />
      </ScrollView>

      {/* Conditionally render Cart Carousel if there are items in the cart */}
      {items.length !== 0 && <CartCarousel />}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 25,
  },
  searchBar: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: 10
  },
  tabs: {
    padding: 8,
    flexDirection: 'row',
    overflow: 'scroll',
  },
  headTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  searchIc: {
    height: 20,
    width: 20,
    margin: 6,
    borderRadius: 8
  },
  searchBtn: {
    backgroundColor: '#fff',
    borderRadius: 8
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ccc',
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
  liked: {
    color: 'red',
  },
  selectedButton: {
    backgroundColor: '#E29B56',
    borderColor: '#E29B56',
  },
  buttonText: {
    fontSize: 16,
    color: '#ccc',
  },
  selectedButtonText: {
    color: '#fff',
  },
  search: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 5,
    width: 320,
  },
  header: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  detailImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 16,
    marginTop: 10,
    marginHorizontal: 'auto',
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E29B56',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  quantityButtonRight: {
    borderWidth: 1,
    borderColor: '#E29B56',
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  quantityButtonLeft: {
    borderWidth: 1,
    borderColor: '#E29B56',
    borderRadius: 4,
    padding: 4,
    marginHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  quantityButtonText: {
    fontSize: 16,
    color: '#E29B56',
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  containerOrders: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  buttonOrders: {
    backgroundColor: '#FF8C00',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonTextOrders: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

