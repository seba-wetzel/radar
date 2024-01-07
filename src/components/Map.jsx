import { ProvSource, DepsSource, BsAsSource, RutasSource} from "./Sources.jsx";
import { Markers } from "./Markers.jsx";

import MapGL, { NavigationControl } from "react-map-gl/maplibre";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import mapStyle from "./mapstyle.json";

import AppContext from "../contexts/AppContext.jsx"

import { useLoaderData } from "react-router-dom";

const mapProps = {
    initialViewState: {
        longitude: -72.0, // Coordenada longitudinal de Argentina
        latitude: -40.0, // Coordenada latitudinal de Argentina
        zoom: 2.7, //zoom inicial
        minZoom: 2, // Nivel mínimo de zoom permitido
        maxZoom: 15, // Nivel máximo de zoom permitido
    },
    style: {
        width: "100vw",
        height: " 90vh",
    },
    mapStyle: mapStyle,
};

const style = {
    country: {
        fillColor: "#bacbff",
        fillOpacity: 0.6,
        color: "#2b3bcd",
        weight: 0.2,

    },
    departamentos: {
        fillColor: "#bacbff",
        fillOpacity: 0,
        color: "black",
        weight: 2,
        lineColor: "#198EC8",
        lineWidth: [
            [0, 3],
            [6, 6],
            [14, 9],
            [22, 18],
        ],
    },
    provincias: {
        fillColor: "#bacbff",
        color: "#2b3bcd",
        weight: 2,
        lineColor: "#b2b7f5",
        fillOpacity: 1,
        lineWidth: 2,
    },

    rutas: {
        fillColor: "#bacbff",
        color: "#2b3bcd",
        weight: 2,
        lineColor: "white",
        lineOpacity: 1,
        lineWidth: 2,
    },
};

export default function Map() {
    const {urls} = useLoaderData();
    const {provincias, departamentos, departamentosBsAs, rutas} = urls;


    return (
        <AppContext.Consumer>
            {({filters, mapHandlers, markers}) => (
                <MapGL
                    id="mapa"
                    mapLib={maplibregl}
                    {...mapProps}
                    {...mapHandlers}
                >
                    {/* Capa interactiva para provincias */ }

                    <ProvSource data={provincias} style={style.provincias} />
                    <DepsSource data={departamentos} style={style.departamentos} />
                    <BsAsSource data={departamentosBsAs} style={style.country} />
                    <RutasSource data={rutas} style={style.rutas}/>

                    {markers.data && (
                        <Markers
                            {...markers}
                            tipoFilters={filters.tipo.data}
                            handleTipoFilter={filters.tipo.handle}
                        />
                    )}
                    <NavigationControl position="top-right" />
                </MapGL>
            )}
        </AppContext.Consumer>
    )
}
