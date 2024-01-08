import React, {lazy} from "react";
import ReactDOM from "react-dom/client";
import {loader as getURLs} from './components/Loader.jsx';

import {
  createHashRouter,
  RouterProvider,
  Navigate
} from "react-router-dom";
import "./index.css";
import "./App.css";

import Main2 from "./components/Main2.jsx";
import Conecta from "./components/Conecta.jsx";
import Notas from "./components/notas.jsx";
import Reporta from "./components/reporta.jsx";


import Root from "./routes/Root.jsx";

const App = lazy(() => import("./routes/App"))
const Map = lazy(() => import("./components/Map"))

const loader = urls => async () => ({
  urls: await getURLs(urls),
})

const appLoader = loader({casos: "data/casos.json"});
const mapLoader = loader({
  departamentos: "data/mapsData/departamentos-argentina.json",
  departamentosBsAs: "data/mapsData/departamentos-buenos_aires.json",
  provincias: "data/mapsData/provincias.json",
  rutas: "data/mapsData/rutas.json",
})

const router = createHashRouter([
  {
    path: "/",
    element: <Root/>,
    children:[
      { path:"/map", element:<App/>, children: [
        { path:"/map/:filters?", element:<Map/>, loader: mapLoader}
      ]},
      { path:"/conecta", element:< Conecta/> },
      { path:"/reporta", element:< Reporta/> },
      { path:"/notas", element:< Notas/> },
      { path:"/main2", element:< Main2/> },
      { path:"/", element: <Navigate to="/map" replace />}
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
