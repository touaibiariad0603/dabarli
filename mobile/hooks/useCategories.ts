import { useApi } from "@/lib/api"; // your axios instance
import { Category } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useCategories = () => {
    const api = useApi();

  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories");
      return data;
    },
  });
};

export default useCategories;