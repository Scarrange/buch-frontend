import React, { createContext, useContext } from "react";

const AuthContext = createContext<{ loggedIn: boolean } | undefined>(undefined);

export const AuthProvider = ({
  children,
  loggedIn,
}: {
  children: React.ReactNode;
  loggedIn: boolean;
}) => {
  return (
    <AuthContext.Provider value={{ loggedIn }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
