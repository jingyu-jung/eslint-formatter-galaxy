import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app.tsx";
import { DetailProvider } from "./detailContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DetailProvider>
      <App />
    </DetailProvider>
  </StrictMode>
);
