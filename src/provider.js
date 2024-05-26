import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import NextNProgress from "nextjs-progressbar";
import { createContext, useState } from "react";
import Loading from "./components/Loading";

import "swagger-ui-react/swagger-ui.css";
import "rsuite/dist/rsuite-no-reset.min.css";

const queryClient = new QueryClient();
export const SystemContext = createContext();

const Provider = ({ children }) => {
  const [aside, setAside] = useState(false);
  const { status } = useSession();

  if (status == "loading") return <Loading />;
  return (
    <>
      <SystemContext.Provider value={{ aside, setAside }}>
        <QueryClientProvider client={queryClient}>
          <NextNProgress />
          {children}
        </QueryClientProvider>
      </SystemContext.Provider>
    </>
  );
};

export default Provider;
