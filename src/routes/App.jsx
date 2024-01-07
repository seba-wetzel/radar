import React, { useEffect, useState } from "react";
import { Slider } from "@mui/material";
import { useLoaderData, Outlet } from "react-router-dom";

import AppContext from "../contexts/AppContext.jsx";

import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import { motion } from 'framer-motion';
import CloseButton from 'react-bootstrap/CloseButton';
import Footer from "./components/footer.jsx"

import Main2 from "../components/Main2.jsx";
import Popup from "../components/Popup.jsx";
import Filtros from '../components/filtros.jsx'; // Cambia la ruta a tu formulario
import Analisis from '../components/analisis.jsx'

//estilos/////////////////////
const now = new Date()

const emptyFilters = {byId: {}, byName: {}};

function App() {
  const {urls} = useLoaderData();

  const handleTipoFilter = () => {
    const filteredDataByType = filteredDataByTime.filter(event => tipoFilters[event.tipoId]);
    setFilteredData(filteredDataByType);
  };

  const [tipoFilters, setTipoFilters] = useState({
    t1: true,
    t2: true,
    t3: true,

  });
  // Estado para controlar la visibilidad de "Filtros"
  const [casesData, setCasesData] = useState([]);
  const [analisisData, setAnalisisData] = useState({
    min: now,
    max: now,
    tipos: emptyFilters,
    componentes: emptyFilters
  });

  const [filtrosVisible, setFiltrosVisible] = useState(true);

  const [hoveredFeatureId, setHoveredFeatureId] = useState(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);
  const [popupInfo, setPopupInfo] = useState(null);

  const [filteredData, setFilteredData] = useState(casesData);
  const [months, setMonths] = useState(0);
  const [dates, setDates] = useState({min: now, max: now});
  const [monthRange, setMonthRange] = useState([0, 0]);
  const [filteredDataByTime, setFilteredDataByTime] = useState([]);

  const valueLabelFormat = (value) => {
    const diff = months - value;
    const date = new Date()
    date.setMonth(date.getMonth() - diff - 1)
    return `${date.getMonth()}/${date.getFullYear()}`;
  };

  useEffect(() => {
    const {tipos, componentes} = urls.casos;
    const cases = urls.casos.cases.map(c => ({...c, date: new Date(c.date)}));
    const max = new Date(urls.casos.max)
    const min = new Date(urls.casos.min)
    const yearsDiff = max.getFullYear() - min.getFullYear();
    const monthDiff = max.getMonth() - min.getMonth();

    const totalMonths = yearsDiff * 12 + monthDiff + 1;

    setCasesData(cases);
    setAnalisisData({tipos, componentes, min, max, total: cases.length})
    setDates({min, max});
    setMonths(totalMonths);
    setMonthRange([0, totalMonths]);
  }, [])

  useEffect(() => setFilteredData(casesData), [casesData])

  useEffect(() => {
    const from = new Date(dates.min)
    from.setMonth(from.getMonth() + monthRange[0])

    const to = new Date(dates.min)
    to.setMonth(to.getMonth() + monthRange[1])

    const checkDate = (e) => e.date >= from && e.date <= to;
    const newData = casesData.filter(checkDate);
    setFilteredDataByTime(newData);
    // Aplicar también los filtros de tipo a los datos filtrados por tiempo
    const filteredDataByType = newData.filter(event => tipoFilters[event.tipoId]);
    setFilteredData(filteredDataByType);
  }, [monthRange, dates, casesData, tipoFilters]);

  // Función para cambiar la visibilidad de "Filtros"
  const toggleFiltrosVisibility = () => {
    setFiltrosVisible(!filtrosVisible);
  };

  const handleChange = (event) => {
    setMonthRange(event.target.value);
  };


  const handleHover = (event) => {
    setHoveredFeatureId(event.features?.[0]?.id || null);
  };

  const handleLeave = () => setHoveredFeatureId(null);


  // Step 1: Create a state variable for the close button
  const [isCloseButtonClicked, setIsCloseButtonClicked] = useState(false);

  // Step 2: Create a click handler for the close button
  const handleClickCloseButton = () => {
    // Toggle the state when the button is clicked
    setIsCloseButtonClicked(!isCloseButtonClicked);

    // Add any additional logic you want when the button is clicked
  };

  return (
    <AppContext.Provider
    value={{
      filters: {tipo: {handle: handleTipoFilter, set: setTipoFilters, data: tipoFilters}},
      mapHandlers: {onHover: handleHover, onLeave: handleLeave},
      markers: {data: filteredData, setPopupInfo, setMarker: setHoveredMarkerId, selected: hoveredMarkerId}
    }}
    >
    <div className="App">

    {filtrosVisible && (
      <Filtros
        caseCount={filteredData.length}
        handleTipoFilter={handleTipoFilter}
        tipoFilters={tipoFilters}
        setTipoFilters={setTipoFilters}
      >
      </Filtros>
    )}
        <div id='mapGap'></div>
        <div id='botonFiltrosMain'>
          {/* Render different button content based on the state */}
          <CloseButton
            id="closeButton"
            aria-label="Hide"
            onClick={() => { handleClickCloseButton(); toggleFiltrosVisibility(); }}
            className={isCloseButtonClicked ? "transformed-button" : "simple-button"}
          >
            {isCloseButtonClicked ? (
              // Content when the button is clicked
              // You can use any JSX or HTML here
              <div><h5 id= 'botonFiltrosMap'>FILTROS</h5></div>
            ) : (
              // Content when the button is not clicked
              // You can use any JSX or HTML here
              <div>X</div>
            )}
          </CloseButton>
        </div>
        <div id='mapGap'></div>

        <Outlet />
        <div className="slider-container">
          {/* Agrega un botón o elemento para cambiar la visibilidad de Filtros */}
          <Slider
            max={months}
            valueLabelDisplay="auto"
            value={monthRange}
            step={1}
            getAriaValueText={valueLabelFormat}
            valueLabelFormat={valueLabelFormat}
            onChange={handleChange}
            aria-labelledby="non-linear-slider"
          />
          <div id='referenciasFechas'>
            <div>
              <h6 id='fechaInicio'>
                {dates.min.getMonth()}/{dates.min.getFullYear()}
              </h6>
            </div>
            <div>  </div>
            <div>
              <h6 id='fechaCierre'>
                {dates.max.getMonth()}/{dates.max.getFullYear()}
              </h6>
            </div>
          </div>
        </div>
        <ScrollLink id='toMain2Container'
                    to="Main2"             // ID del elemento de destino (Main2)
                    spy={true}             // Activa el modo espía
                    smooth={true}          // Activa el desplazamiento suave
                    duration={500}         // Duración de la animación (en milisegundos)
                    offset={-70} // Ajusta un offset opcional (si tienes un encabezado fijo)
        >
          <div id="toMain2">
            <h4 id='plusBoton'>+</h4>
          </div>
        </ScrollLink>

        {popupInfo && <Popup {...popupInfo} />}

      <Footer />
        <Main2 />
        <Analisis {...analisisData}/>
      </div>
    </AppContext.Provider>
  );
}


export default App;
