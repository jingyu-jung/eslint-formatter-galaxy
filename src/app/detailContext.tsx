import { createContext, useState, useContext, useMemo } from "react";

interface DetailContextValue {
  tab: "all" | "warnings" | "errors";
  changeTab: (tab: "all" | "warnings" | "errors") => void;
  searchTerm: string;
  changeSearchTerm: (searchTerm: string) => void;
}

const DetailContext = createContext<DetailContextValue | null>(null);

const DetailProvider = ({ children }: { children: React.ReactNode }) => {
  const [tab, setTab] = useState<"all" | "warnings" | "errors">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const value = useMemo(() => {
    return {
      searchTerm,
      changeSearchTerm: setSearchTerm,
      tab,
      changeTab: setTab,
    };
  }, [searchTerm, tab]);

  return (
    <DetailContext.Provider value={value}>{children}</DetailContext.Provider>
  );
};

const useDetail = () => {
  const searchTerm = useContext(DetailContext);
  if (!searchTerm) {
    throw new Error("useDetail must be used within a DetailProvider");
  }

  return searchTerm;
};

export { DetailProvider, useDetail };
