import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, useFonts } from '@expo-google-fonts/inter';
import { router } from 'expo-router';
import { ArrowLeft, ChevronDown, Minus, Plus, Search, ShoppingCart, SlidersHorizontal, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../../core/context/CartContext';
import { getProducts, Product } from '../../core/services/productService';


// --- Modern Color Palette ---
const Colors = {
  primary: '#0D47A1',
  primaryDark: '#0B3A81',
  primaryLight: '#1E88E5',
  primaryLighter: '#E3F2FD',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  text: '#1D3557',
  textSecondary: '#6C757D',
  border: '#EAECEF',
  white: '#FFFFFF',
  error: '#D32F2F',
  errorLight: '#FFEBEE',
  accent: '#F59E0B',
};


// --- Filter Chip Component ---
const FilterChip = ({ icon, label, hasDropdown }) => (
  <TouchableOpacity style={styles.chip}>
    {icon}
    <Text style={styles.chipText}>{label}</Text>
    {hasDropdown && <ChevronDown size={16} color={Colors.textSecondary} style={{ marginLeft: 4 }} />}
  </TouchableOpacity>
);


export default function ProductsScreen() {
  const insets = useSafeAreaInsets();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalQuantity, setModalQuantity] = useState(1); // Default quantity to 1
  const [searchQuery, setSearchQuery] = useState('');


  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Handle error (show error message)
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);



  let [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <View style={styles.loadingContainer} />;
  }

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setModalQuantity(1); // Reset quantity to 1 when modal opens
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const adjustModalQuantity = (type) => {
    if (type === 'increase') {
      setModalQuantity(prev => prev + 1);
    } else if (type === 'decrease') {
      // Prevent quantity from going below 1
      setModalQuantity(prev => (prev > 1 ? prev - 1 : 1));
    }
  };

  const getModalTotalPrice = () => {
    if (!selectedProduct) return 0;
    return (selectedProduct.price * modalQuantity);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header with solid blue color */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()} style={styles.headerIcon}>
            <ArrowLeft size={26} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Products</Text>
        </View>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.push('/customer/cart')}>
          <ShoppingCart size={26} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsContainer}>
        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a cylinder..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipContainer}>
          <FilterChip icon={<SlidersHorizontal size={16} color={Colors.textSecondary} />} label="Filters" />
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {filteredProducts.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={[styles.productCard, !product.inStock && styles.outOfStockCard]}
            onPress={() => product.inStock && openProductModal(product)}
            disabled={!product.inStock}
          >
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription} numberOfLines={2}>{product.description}</Text>
              <View style={styles.priceContainer}>
                <Text style={styles.price}>₹{product.price}</Text>
                {product.originalPrice && <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>}
              </View>
            </View>
            {product.inStock ? (
              <View style={styles.addButton}>
                <Plus size={22} color={Colors.white} />
              </View>
            ) : (
              <View style={styles.outOfStockBadge}>
                <Text style={styles.outOfStockText}>Unavailable</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- REFINED Product Details Modal --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        statusBarTranslucent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={{ flex: 1 }} onPress={closeModal} />
          <View style={styles.modalContent}>
            <View style={styles.modalHandle} />
            <Image source={{ uri: selectedProduct?.image }} style={styles.modalHeroImage} />

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <X size={24} color={Colors.text} />
            </TouchableOpacity>

            {selectedProduct && (
              <>
                <ScrollView style={styles.modalScrollView}>
                  <View style={styles.modalInfoContainer}>
                    <Text style={styles.modalTitle}>{selectedProduct.name}</Text>
                    <Text style={styles.modalDescription}>{selectedProduct.description}</Text>
                  </View>
                </ScrollView>

                <View style={styles.quantitySection}>
                  <View style={styles.modalQuantitySelector}>
                    <TouchableOpacity style={styles.modalQuantityButton} onPress={() => adjustModalQuantity('decrease')}>
                      <Minus size={20} color={Colors.white} />
                    </TouchableOpacity>
                    <Text style={styles.modalQuantityText}>{modalQuantity}</Text>
                    <TouchableOpacity style={styles.modalQuantityButton} onPress={() => adjustModalQuantity('increase')}>
                      <Plus size={20} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.modalActionContainer, { paddingBottom: insets.bottom + 10 }]}>
                  <View>
                    <Text style={styles.totalLabel}>Total Price</Text>
                    <Text style={styles.totalAmount}>₹{getModalTotalPrice()}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.modalAddButton}
                    onPress={() => {
                      addToCart(selectedProduct, modalQuantity);
                      closeModal();
                    }}
                  >
                    <Text style={styles.modalAddButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- Stylesheet ---
const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background },
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary, // Solid color
    paddingBottom: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: { padding: 8 },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter_600SemiBold',
    color: Colors.white,
    marginLeft: 12,
  },

  controlsContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: { marginRight: 12 },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
    color: Colors.text,
  },
  chipContainer: {
    paddingTop: 16,
    paddingHorizontal: 16,
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 6,
  },
  chipText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: Colors.textSecondary,
  },

  content: { padding: 20, paddingBottom: 40 },
  productCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.07,
    shadowRadius: 15,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(224, 224, 224, 0.5)',
  },
  outOfStockCard: { opacity: 0.7, shadowOpacity: 0.05 },
  productImage: {
    width: 80,
    height: 110,
    borderRadius: 18,
    marginRight: 16,
  },
  productInfo: { flex: 1 },
  productName: {
    fontSize: 17,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginBottom: 4
  },
  productDescription: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: Colors.primary,
    marginRight: 8
  },
  originalPrice: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  outOfStockBadge: {
    backgroundColor: Colors.errorLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 10,
  },
  outOfStockText: { fontSize: 12, color: Colors.error, fontFamily: 'Inter_600SemiBold' },

  // --- REFINED MODAL STYLES ---
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 48,
    height: 5,
    backgroundColor: Colors.border,
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 12,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    borderRadius: 100,
    padding: 6,
    zIndex: 10,
  },
  modalHeroImage: {
    width: 160,
    height: 240,
    resizeMode: 'cover',
    alignSelf: 'center',
  },
  modalScrollView: {
    maxHeight: 150,
  },
  modalInfoContainer: {
    padding: 20,
    paddingBottom: 12,
  },
  modalTitle: {
    fontSize: 24,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    alignSelf: 'center',
    marginBottom: 12
  },
  modalDescription: {
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  quantitySection: {
    marginTop: 4,
    paddingHorizontal: 20,
    marginBottom: 20,
    // paddingVertical: 24,
    alignItems: 'center',
  },
  modalQuantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalQuantityButton: {
    width: 42,
    height: 42,
    borderRadius: 24, // Circle
    backgroundColor: Colors.primary, // Changed to blue
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  modalQuantityText: {
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
    marginHorizontal: 26,
  },
  modalActionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: Colors.textSecondary,
  },
  totalAmount: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    color: Colors.text,
  },
  modalAddButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  modalAddButtonText: {
    color: Colors.white,
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
  },
});

