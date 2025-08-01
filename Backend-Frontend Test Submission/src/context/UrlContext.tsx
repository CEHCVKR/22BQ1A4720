// src/context/UrlContext.tsx

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of a click tracking object
export type ClickData = {
  timestamp: Date;
  userAgent: string;
  referrer: string;
};

// Define the shape of a single shortened URL object
export type ShortenedUrl = {
  id: string;
  longURL: string;
  shortCode: string;
  createdAt: Date;
  expiresAt: Date;
  clicks: ClickData[];
};

// Define the shape of the context's value
type UrlContextType = {
  urls: ShortenedUrl[];
  addUrls: (newUrls: ShortenedUrl[]) => void;
  updateUrlClicks: (urlId: string, clickData: ClickData) => void;
  deleteUrl: (urlId: string) => void;
};

// Create the context
const UrlContext = createContext<UrlContextType | undefined>(undefined);

// Create the provider component
export function UrlProvider({ children }: { children: ReactNode }) {
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);

  const addUrls = (newUrls: ShortenedUrl[]) => {
    setUrls(prevUrls => [...prevUrls, ...newUrls]);
  };

  const updateUrlClicks = (urlId: string, clickData: ClickData) => {
    setUrls(prevUrls => 
      prevUrls.map(url => 
        url.id === urlId 
          ? { ...url, clicks: [...url.clicks, clickData] }
          : url
      )
    );
  };

  const deleteUrl = (urlId: string) => {
    setUrls(prevUrls => prevUrls.filter(url => url.id !== urlId));
  };

  return (
    <UrlContext.Provider value={{ urls, addUrls, updateUrlClicks, deleteUrl }}>
      {children}
    </UrlContext.Provider>
  );
}

// Create a custom hook for easy access
export function useUrlContext() {
  const context = useContext(UrlContext);
  if (context === undefined) {
    throw new Error('useUrlContext must be used within a UrlProvider');
  }
  return context;
}

