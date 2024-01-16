import { Marker } from "react-map-gl/maplibre";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./Markers.css";

const tipoIdStyles = {
  t1: "amarillo",
  t2: "naranja",
  t3: "rojo",
};

export const Markers = ({
  data,
  setPopupInfo,
  setMarker,
  selected,
  tipoFilters,
}) => {
  const [filteredAndSortedData, setFilteredAndSortedData] = useState([]);

  useEffect(() => {
    const filteredData = data.filter((event) => tipoFilters[event.tipoId]);
    const sortedData = [...filteredData].sort((a, b) => {
      if (a.tipoId === "t3" && b.tipoId !== "t2") return -1;
      if (a.tipoId === "t2" && b.tipoId === "t1") return -1;
      return 1;
    });
    setFilteredAndSortedData(sortedData);
  }, [data, tipoFilters]);

  const renderMarker = (event) => {
    const { coords, title, date, source, id, tipoId, tipo } = event;
    const markerStyle = `circulo ${id === selected ? "hovered" : ""} ${tipoIdStyles[tipoId]}`;

    return (
      <Marker
        key={id}
        longitude={coords.longitude}
        latitude={coords.latitude}
        onMouseEnter={() => setMarker(id)}
        onMouseLeave={() => setMarker(null)}
        onClick={() =>
          setPopupInfo({
            coords: {
              lat: coords.latitude,
              lng: coords.longitude,
            },
            title,
            tipo,
            date,
            source,
          })
        }
      >
        <div className={markerStyle} />
      </Marker>
    );
  };

  return (
    <>
      {filteredAndSortedData.reverse().map((event) => (
        <div key={event.id}>{renderMarker(event)}</div>
      ))}
    </>
  );
};

Markers.propTypes = {
  data: PropTypes.array.isRequired,
  setPopupInfo: PropTypes.func.isRequired,
  setMarker: PropTypes.func.isRequired,
  selected: PropTypes.string.isRequired,
  tipoFilters: PropTypes.array.isRequired,
};
