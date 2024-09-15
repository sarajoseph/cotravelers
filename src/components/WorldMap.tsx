/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, GeoJSON  } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngTuple  } from 'leaflet'
import countriesGeoJson from '../../public/countries.geo.json'
import { GeoJsonProperties, Geometry } from 'geojson'
import { useWorldMap } from '../hooks/useWorldMap'
import { useEffect, useState } from 'react'

export const WorldMap = ({countriesVisited, handleClickCountry}: {countriesVisited: string[], handleClickCountry?: (countryName: string) => Promise<void>}) => {
  const position: LatLngTuple = [0, 0]
  const [zoomLevel, setZoomLevel] = useState<number>(2)
  const data = countriesGeoJson as GeoJSON.FeatureCollection<Geometry, GeoJsonProperties>
  const { countryStyle, onCountryHover, onCountryHoverOut } = useWorldMap(countriesVisited)
  
  useEffect(() => {
    const handleResize = () => setZoomLevel(window.innerWidth < 768 ? 1 : 2)
    handleResize()

    // Agregar event listener para detectar cambios de tamaño de pantalla
    window.addEventListener('resize', handleResize)

    // Limpiar el event listener cuando el componente se desmonta
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div style={{ height: '100vh', width: '100%', maxHeight: '500px' }}>
      <MapContainer
        center={position}
        zoom={zoomLevel}
        className='custom-map'
        scrollWheelZoom={false}
        dragging={false}
        zoomControl={false}
        doubleClickZoom={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <GeoJSON
          data={data}
          style={countryStyle}
          onEachFeature={(feature, layer) => {
            layer.on({
              click: () => handleClickCountry && handleClickCountry(feature?.properties?.name),
              mouseover: onCountryHover,
              mouseout: onCountryHoverOut
            })
          }}
        />
      </MapContainer>
    </div>
  )
}