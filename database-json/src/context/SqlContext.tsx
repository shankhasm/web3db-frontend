import React, { createContext, useState, ReactNode } from "react";

type SqlState = {
  query: string;
  results: any;
  runQuery: (query: string, database: string) => void;
};

const initialContext: Partial<SqlState> = {
  query: "",
  results: null,
  runQuery: () => {},
};

export const SqlContext = createContext<Partial<SqlState>>(initialContext);

interface SqlProviderProps {
  children: ReactNode;
}

export const SqlProvider: React.FC<SqlProviderProps> = ({ children }) => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<any>(null);

  const runQuery = async (sqlQuery: string, database: string) => {
    setQuery(sqlQuery);

    const response = await fetch("YOUR_API_ENDPOINT", {
      method: "POST",
      body: JSON.stringify({ query: sqlQuery, database }), // Added the 'database' property
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setResults(data);
  };

  return (
    <SqlContext.Provider value={{ query, results, runQuery }}>
      {children}
    </SqlContext.Provider>
  );
};
