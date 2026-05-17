// hooks/useSubCategories.ts
import { useApi } from "@/lib/api";
import { SubCategory } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useSubCategories = () => {
  const api = useApi();

  return useQuery<SubCategory[]>({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data } = await api.get("/subcategories");
      return data;
    },
  });
};

export default useSubCategories;