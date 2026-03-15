import { useEffect } from "react";
import { useRouter } from "expo-router";
import { getToken } from "../lib/storage";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      const token = await getToken();
      if (token) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };
    checkToken();
  }, []);

  return null;
}