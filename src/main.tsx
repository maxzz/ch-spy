import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./course-hunter/components/0-all/app";

import "./course-hunter/assets/styles/index.css";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
