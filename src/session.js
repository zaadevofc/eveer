import { SessionProvider } from "next-auth/react";
import Provider from "./provider";

const Session = ({ children }) => {
  return (
    <SessionProvider>
      <Provider>{children}</Provider>
    </SessionProvider>
  );
};

export default Session