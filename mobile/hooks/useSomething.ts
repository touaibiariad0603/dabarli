import { useState, useEffect } from "react";
import { API_URL } from "../constants/api";

export function useExample() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error(err));
  }, []);

  return data;
}