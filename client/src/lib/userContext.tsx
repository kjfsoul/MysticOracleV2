import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "./supabase-client";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [traits, setTraits] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase
          .from("user_traits")
          .select("*")
          .eq("user_id", user.id)
          .single();
        setTraits(data);
      }
    };
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, traits }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
