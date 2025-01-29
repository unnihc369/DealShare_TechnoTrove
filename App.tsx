import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/HomeScreen';
import DetailsScreen from './src/DetailScreen';
import Subcategories from './src/SubCategories';
import Products from './src/Products';
import { Provider } from 'react-redux';
import store from './src/store/store';
import Cart from './src/components/Cart';
import Orders from './src/components/Orders';

export type RootStackParamList = {
  Home: undefined;
  Details: { product: Product };
  SubCategories: { id : string},
  Products: {subCategoryId: string},
  Cart:undefined,
  Orders:undefined,
};

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

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SubCategories" component={Subcategories} options={{ headerShown: false }}/>
        <Stack.Screen name="Products" component={Products} options={{ headerShown: false}}/>
        <Stack.Screen name='Cart' component={Cart} />
        <Stack.Screen name='Orders' component={Orders}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};

export default App;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 25,
//   },
//   tabs:{
//     paddingVertical:10,
//     flexDirection:'row',
//     overflow:'scroll',
//   },
//   button: {
//     paddingVertical: 10,
//     paddingHorizontal: 24,
//     marginRight: 16,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 15,
//     borderWidth: 1,
//     borderColor: '#ccc',
//   },
//   selectedButton: {
//     backgroundColor: '#E29B56', 
//     borderColor: '#E29B56', 
//   },
//   buttonText: {
//     fontSize: 16,
//     color: '#ccc', 
//   },
//   selectedButtonText: {
//     color: '#fff', 
//   },
//   search:{
//     backgroundColor: '#fafafa',
//     padding:15,
//     borderRadius: 8,
//     marginBottom: 5,
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   card: {
//     flex: 1,
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     margin: 8,
//     padding: 16,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//     marginBottom:15,
//   },
//   image: {
//     width: 120,
//     height: 120,
//     resizeMode: 'contain',
//     backgroundColor:'#efedfd',
//     borderRadius:6,
//     margin:'auto',
//   },
//   detailImage: {
//     width: 200,
//     height: 200,
//     resizeMode: 'contain',
//     marginBottom: 16,
//     marginTop:10,
//     marginHorizontal:'auto',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginVertical: 8,
//   },
//   description: {
//     fontSize: 14,
//     color: '#555',
//     marginBottom: 16,
//   },
//   price: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#E29B56',
//   },
//   header1: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     height: 60,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ddd',
//   },
//   headerTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   iconButton: {
//     padding: 8,
//   },
//   iconText: {
//     fontSize: 20,
//   },
//   priceBox:{
//     position: 'absolute', 
//     bottom: 0, 
//     left: 0,
//     right: 0,
//     backgroundColor: '#fff', 
//     fontSize:24,
//     flexDirection:'row',
//     alignItems:'center',
//     gap: 10,
//     padding: 16, 
//     borderTopWidth: 1, 
//     borderTopColor: '#ddd',
//   },
//   readMore: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#007BFF',
//     marginBottom: 16,
//   },
// });
