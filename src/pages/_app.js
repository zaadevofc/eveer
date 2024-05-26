import Session from "../session";
import { cache } from "../utils/tools";
import "../../styles/globals.css";

function MyApp({ Component, pageProps }) {
  cache.clear();
  return (
    <>
      <Session>
        <Component {...pageProps} />
      </Session>
    </>
  );
}

export default MyApp;
