import ProductsGrid from "@/components/ProductsGrid";
import SafeScreen from "@/components/SafeScreen";
import useCategories from "@/hooks/useCategories";
import useProducts from "@/hooks/useProducts";
import useSubCategories from "@/hooks/useSubCategories";
import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

const ShopScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);

  const { data: products, isLoading, isError } = useProducts();
  const { data: categories } = useCategories();
  const { data: subcategories } = useSubCategories();
console.log("subcategories:", subcategories);

  const filteredSubCategories = useMemo(() => {
    if (!subcategories || !selectedCategory) return [];
    return subcategories.filter((s) => s.category._id === selectedCategory);
  }, [subcategories, selectedCategory]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let filtered = products;

    if (selectedCategory !== null) {
      filtered = filtered.filter((p) => p.category._id === selectedCategory);
    }

    if (selectedSubCategory !== null) {
      filtered = filtered.filter((p) => p.subcategory._id === selectedSubCategory);
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [products, selectedCategory, selectedSubCategory, searchQuery]);

  const handleCategorySelect = (id: string | null) => {
    setSelectedCategory(id);
    setSelectedSubCategory(null);
  };

  return (
    <SafeScreen>
      <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View className="px-6 pb-4 pt-6">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-text-primary text-3xl font-bold tracking-tight">Shop</Text>
              <Text className="text-text-secondary text-sm mt-1">Browse all products</Text>
            </View>
            <TouchableOpacity className="   bg-surface-glass backdrop-blur-md border border-surface-border p-3 rounded-full" activeOpacity={0.7}>
              <Ionicons name="options-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* SEARCH BAR */}
          <View className="
           bg-surface-glass
            backdrop-blur-md
            border border-surface-border
            flex-row items-center px-5 py-4 rounded-xl2
            shadow-soft
            ">
            <Ionicons color="#666" size={22} name="search" />
            <TextInput
              placeholder="Search for products"
              placeholderTextColor="#666"
              className="flex-1 ml-3 text-base text-text-primary"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* CATEGORY FILTER */}
        <View className="mb-4">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            <TouchableOpacity
              onPress={() => handleCategorySelect(null)}
              style={{
                width: 80, height: 80,
                overflow: "hidden", borderRadius: 16,
                borderWidth: selectedCategory === null ? 0 : 1,
                borderColor: "#2a2a2a",
                backgroundColor: selectedCategory === null ? "#F5A623" : "#1a1a1a",
                alignItems: "center", justifyContent: "center",
              }}
              activeOpacity={0.7}
            >
              <Ionicons
                name="grid-outline"
                size={36}
                color={selectedCategory === null ? "#121212" : "#fff"}
              />
            </TouchableOpacity>

            {categories?.map((category) => {
              const isSelected = selectedCategory === category._id;
              return (
                <TouchableOpacity
                  key={category._id}
                  onPress={() => handleCategorySelect(category._id)}
                  style={{
                    width: 80, height: 80,
                    overflow: "hidden", borderRadius: 16,
                    borderWidth: isSelected ? 0 : 1,
                    borderColor: "#2a2a2a",
                    backgroundColor: isSelected ? "#F5A623" : "#1a1a1a",
                  }}
                  activeOpacity={0.7}
                >
                  <Image
                    source={{ uri: category.images[0] }}
                    style={{ width: 80, height: 80 }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SUBCATEGORY FILTER */}
        {selectedCategory && filteredSubCategories.length > 0 && (
          <View className="mb-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => setSelectedSubCategory(null)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 8,
                  borderRadius: 20, borderWidth: 1,
                  borderColor: selectedSubCategory === null ? "#F5A623" : "#2a2a2a",
                  backgroundColor: selectedSubCategory === null ? "#F5A623" : "#1a1a1a",
                }}
                activeOpacity={0.7}
              >
                <Text style={{ color: selectedSubCategory === null ? "#121212" : "#fff", fontWeight: "600", fontSize: 13 }}>
                  All
                </Text>
              </TouchableOpacity>

              {filteredSubCategories.map((sub) => {
                const isSelected = selectedSubCategory === sub._id;
                return (
                  <TouchableOpacity
                    key={sub._id}
                    onPress={() => setSelectedSubCategory(sub._id)}
                    style={{
                      paddingHorizontal: 16, paddingVertical: 8,
                      borderRadius: 20, borderWidth: 1,
                      borderColor: isSelected ? "#F5A623" : "#2a2a2a",
                      backgroundColor: isSelected ? "#F5A623" : "#1a1a1a",
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: isSelected ? "#121212" : "#fff", fontWeight: "600", fontSize: 13 }}>
                      {sub.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* PRODUCTS */}
        <View className="px-6 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-text-primary text-lg font-bold">Products</Text>
            <Text className="text-text-secondary text-sm">{filteredProducts.length} items</Text>
          </View>
          <ProductsGrid products={filteredProducts} isLoading={isLoading} isError={isError} />
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

export default ShopScreen;