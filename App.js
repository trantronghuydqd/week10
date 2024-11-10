import React, { createContext, useState, useContext, useEffect } from "react";
import {
    View,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

const lorem =
    "biểu tượng trái tim màu trắng. Biểu tượng trên thẻ chơi cho trái tim. Thay thế phong cách cho từ tình yêu";
const Stack = createStackNavigator();
const ProductContext = createContext();
// const PRODUCTS = [
//   {
//     id: 1,
//     name: "product1",
//     price: 1000,
//     category: "cate1",
//     image: "./assets/product1.png"
//   },
//   {
//     id: 2,
//     name: "product2",
//     price: 2000,
//     category: "cate2",
//     image: "./assets/product2.png"
//   },
//   {
//     id: 3,
//     name: "product3",
//     price: 3000,
//     category: "cate3",
//     image: "./assets/product3.png"
//   },
// ]

const mapImage = (nameProduct) => {
    switch (nameProduct) {
        case "product1":
            return require("./assets/product1.png");
        case "product2":
            return require("./assets/product2.png");
        case "product3":
            return require("./assets/product3.png");
        case "product4":
            return require("./assets/product4.png");
        case "product5":
            return require("./assets/product5.png");
        case "product6":
            return require("./assets/product6.png");
    }
};

const HomeScreen = ({ navigation }) => {
    return (
        <View
            style={{
                flex: 1,
                margin: 10,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text
                style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    color: "red",
                    marginBottom: 50,
                }}
            >
                Welcome to my store
            </Text>
            <Image
                source={mapImage("product1")}
                style={{ width: 200, height: 200, margin: 50 }}
            ></Image>
            <TouchableOpacity
                onPress={() => navigation.navigate("Products")}
                style={{
                    color: "white",
                    backgroundColor: "black",
                    borderRadius: 50,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    marginTop: 50,
                    fontSize: 20,
                }}
            >
                <Text style={{ color: "white" }}>Get started</Text>
            </TouchableOpacity>
        </View>
    );
};

const Products = ({ navigation }) => {
    const { products, fetchProducts } = useProducts();
    const [cateSelec, setCateSelec] = useState("All");
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            fetchProducts();
        });

        return unsubscribe;
    }, [navigation]);

    const cates = ["All", ...new Set(products.map((pro) => pro.category))];

    const filterCateSelec = products.filter((pro) => {
        if (cateSelec === "All") return true;
        return pro.category === cateSelec;
    });

    const disPlayProducts = showAll
        ? filterCateSelec
        : filterCateSelec.slice(0, 4);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{
                flex: 1,
                margin: 10,
                backgroundColor: "white",
                padding: 10,
            }}
            onPress={() => navigation.navigate("ProductDetails", { item })}
        >
            <Image
                style={{ width: 100, height: 100 }}
                source={mapImage(item.name)}
            />
            <Text>{item.name}</Text>
            <Text>{item.price}</Text>
            <TouchableOpacity style={{ position: "absolute", top: 2, left: 5 }}>
                <Text style={{ fontSize: 30 }}>♡</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <Text
                style={{ fontWeight: "bold", fontSize: 24, marginVertical: 20 }}
            >
                Danh sách sản phẩm
            </Text>
            <View style={{ flexDirection: "row", marginBottom: 10 }}>
                {cates.map((cate) => (
                    <TouchableOpacity
                        key={cate}
                        onPress={() => setCateSelec(cate)}
                        style={{
                            paddingHorizontal: 20,
                            borderRadius: 50,
                            borderWidth: 1,
                            marginHorizontal: 5,
                        }}
                    >
                        <Text>{cate}</Text>
                    </TouchableOpacity>
                ))}
                <View>
                    <TouchableOpacity onPress={() => setShowAll(true)}>
                        <Text>See all</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={disPlayProducts}
                renderItem={renderItem}
                numColumns={2}
                style={{ marginBottom: 10 }}
                keyExtractor={(item) => item.id}
            />
            <View
                style={{
                    marginBottom: 50,
                    borderRadius: 50,
                    borderWidth: 1,
                    padding: 10,
                }}
            >
                <TouchableOpacity
                    onPress={() => navigation.navigate("AddProduct")}
                >
                    <Text>Thêm sản phẩm</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const AddProduct = ({ navigation }) => {
    const { addProduct } = useProducts();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState("");

    const handleAddProduct = async () => {
        if (!name || !price || !category) {
            alert("Vui lòng điền đầy đủ thông tin!");
            return;
        }

        const newProduct = {
            name,
            price: Number(price),
            category,
            image,
        };

        const success = await addProduct(newProduct);

        if (success) {
            alert("Thêm sản phẩm thành công!");
            navigation.goBack();
        } else {
            alert("Có lỗi xảy ra khi thêm sản phẩm!");
        }
    };

    return (
        <View style={{ padding: 20, alignItems: "center" }}>
            <Text
                style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
            >
                Thêm sản phẩm mới
            </Text>

            <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>Tên sản phẩm:</Text>
                <TextInput
                    value={name}
                    onChangeText={setName}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 5,
                        padding: 10,
                    }}
                    placeholder="VD: product6"
                />
            </View>

            <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>Giá:</Text>
                <TextInput
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 5,
                        padding: 10,
                    }}
                    placeholder="VD: 20000"
                />
            </View>

            <View style={{ marginBottom: 15 }}>
                <Text style={{ marginBottom: 5 }}>Danh mục:</Text>
                <TextInput
                    value={category}
                    onChangeText={setCategory}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 5,
                        padding: 10,
                    }}
                    placeholder="VD: Xe hơi"
                />
            </View>

            <View style={{ marginBottom: 20 }}>
                <Text style={{ marginBottom: 5 }}>Tên hình ảnh:</Text>
                <TextInput
                    value={image}
                    onChangeText={setImage}
                    style={{
                        borderWidth: 1,
                        borderColor: "#ddd",
                        borderRadius: 5,
                        padding: 10,
                    }}
                    placeholder="VD: product6"
                />
            </View>

            <TouchableOpacity
                onPress={handleAddProduct}
                style={{
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 50,
                    alignItems: "center",
                }}
            >
                <Text style={{ color: "black" }}>Thêm sản phẩm</Text>
            </TouchableOpacity>
        </View>
    );
};

const ProductDetails = ({ route, navigation }) => {
    const [cart, setCart] = useState([]);
    const { item } = route.params;
    return (
        <View style={{ margin: 10 }}>
            <Image
                style={{ width: 300, height: 300, marginBottom: 10 }}
                source={mapImage(item.name)}
            ></Image>
            <Text
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}
            >
                {item.name}
            </Text>
            <Text style={{ fontSize: 20, marginBottom: 10 }}>{lorem}</Text>
            <Text
                style={{ fontWeight: "bold", fontSize: 20, marginBottom: 10 }}
            >
                {item.price}
            </Text>
            <View
                style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <TouchableOpacity>
                    <Text style={{ fontSize: 30 }}>♡</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        fontWeight: "bold",
                        fontSize: 20,
                        borderWidth: 1,
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: 5,
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                    }}
                    onPress={() => {
                        setCart([...cart, item]),
                            navigation.navigate("CartScreen", {
                                cart: [...cart, item],
                            });
                    }}
                >
                    <Text style={{ color: "white" }}>Nhấn để mua</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const CartScreen = ({ route, navigation }) => {
    const [cartItems, setCartItems] = useState(
        route.params.cart.map((item) => ({
            ...item,
            quantity: 1,
        }))
    );

    const updateQuantity = (itemId, change) => {
        setCartItems((prevItems) =>
            prevItems.map((item) => {
                if (item.id === itemId) {
                    const newQuantity = item.quantity + change;
                    // Đảm bảo số lượng không nhỏ hơn 1
                    return {
                        ...item,
                        quantity: newQuantity < 1 ? 1 : newQuantity,
                    };
                }
                return item;
            })
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
        );
    };

    const renderCartItem = ({ item }) => (
        <View>
            <Image source={item.image} />
            <View>
                <Text>
                    {item.name} {item.origin}
                </Text>
                <Text>$ {item.price}</Text>
            </View>
            <View>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                    <Text>-</Text>
                </TouchableOpacity>
                <Text>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                    <Text>+</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView>
            <View>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text>Back</Text>
                </TouchableOpacity>
                <Text>My Basket</Text>
                <View />
            </View>

            <FlatList
                data={cartItems}
                renderItem={renderCartItem}
                keyExtractor={(item) => item.id}
            />

            <View>
                <Text>Total:</Text>
                <Text>$ {calculateTotal().toFixed(2)}</Text>
            </View>

            <TouchableOpacity>
                <Text>Payment</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            const response = await fetch(
                "https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS"
            );
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi khi tải sản phẩm:", error);
        }
    };

    const addProduct = async (newProduct) => {
        try {
            const response = await fetch(
                "https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newProduct),
                }
            );

            if (response.ok) {
                const addedProduct = await response.json();
                setProducts([...products, addedProduct]);
                return true;
            }
            return false;
        } catch (error) {
            console.error("Error:", error);
            return false;
        }
    };

    return (
        <ProductContext.Provider
            value={{ products, fetchProducts, addProduct }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error(
            "useProducts phải được sử dụng trong một ProductProvider"
        );
    }
    return context;
};

export default function App() {
    return (
        <ProductProvider>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen name="HomeSrceen" component={HomeScreen} />
                    <Stack.Screen name="Products" component={Products} />
                    <Stack.Screen name="AddProduct" component={AddProduct} />
                    <Stack.Screen
                        name="ProductDetails"
                        component={ProductDetails}
                    />
                    <Stack.Screen name="CartScreen" component={CartScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </ProductProvider>
    );
}

// const styles = StyleSheet.create();

/**
 */
