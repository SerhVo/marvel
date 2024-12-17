import { createRoot } from "react-dom/client";
import App from "./components/app/App";

import "./style/style.scss";

// const marvelService = new MarvelService();
const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);

