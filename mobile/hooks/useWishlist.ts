import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const useWishlist = () => {
  const api = useApi();
  const queryClient = useQueryClient();

const {
  data: wishlist,
  isLoading,
  isError,
  error,
} = useQuery({
  queryKey: ["wishlist"],
  queryFn: async () => {
    console.log("📋 Fetching wishlist...");
    try {
      const { data } = await api.get<{ wishlist: Product[] }>("/users/wishlist");
      console.log("📋 Wishlist response:", data);
      return data.wishlist;
    } catch (error: any) {
      console.error("📋 Wishlist fetch FAILED:", error?.response?.status, error?.response?.data);
      throw error;
    }
  },
});

  const addToWishlistMutation = useMutation({
  mutationFn: async (productId: string) => {
    console.log("➕ Adding:", productId);
    const { data } = await api.post("/users/wishlist", { productId });
    console.log("✅ Response:", data);
    return data.wishlist;
  },
  onSuccess: (data) => {
    console.log("🔄 Invalidating wishlist, new data:", data);
    queryClient.invalidateQueries({ queryKey: ["wishlist"] });
  },
  onError: (error: any) => {
    console.error("❌ FAILED:", error?.response?.status, error?.response?.data);
  },
});

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ wishlist: string[] }>(`/users/wishlist/${productId}`);
      return data.wishlist;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] }),
  });

const isInWishlist = (productId: string) => {
  console.log("🔍 Wishlist:", wishlist);
  console.log("🔍 Looking for:", productId);
  console.log("🔍 IDs in wishlist:", wishlist?.map((p) => p._id));
  return wishlist?.some((product) => product._id === productId) ?? false;
};




  const toggleWishlist = (productId: string) => {
    if (isInWishlist(productId)) {
      removeFromWishlistMutation.mutate(productId);
    } else {
      addToWishlistMutation.mutate(productId);
    }
  };

  const isWishlistPending = (productId: string) => {
  const pendingId = addToWishlistMutation.variables || removeFromWishlistMutation.variables;
  return (
    (addToWishlistMutation.isPending || removeFromWishlistMutation.isPending) &&
    pendingId === productId
  );
};

  return {
    wishlist: wishlist || [],
    isLoading,
    isError,
    wishlistCount: wishlist?.length || 0,
    isInWishlist,
    toggleWishlist,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    isAddingToWishlist: addToWishlistMutation.isPending,
    isRemovingFromWishlist: removeFromWishlistMutation.isPending,
    isWishlistPending, 
  };
};

export default useWishlist;