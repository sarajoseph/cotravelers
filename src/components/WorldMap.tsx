/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, GeoJSON  } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngTuple  } from 'leaflet'
import countriesGeoJson from '../../public/countries.geo.json'
import { GeoJsonProperties, Geometry } from 'geojson'
import { useWorldMap } from '../hooks/useWorldMap'

export const WorldMap = ({countriesVisited, handleClickCountry}:
  {countriesVisited: string[], handleClickCountry?: (countryName: string) => Promise<void>}) => {
  const position: LatLngTuple = [0, 0]
  const zoomLevel = 2.49
  const data = countriesGeoJson as GeoJSON.FeatureCollection<Geometry, GeoJsonProperties>
  const { countryStyle, onCountryHover, onCountryHoverOut } = useWorldMap(countriesVisited)
  return (
    <div style={{ height: '500px', width: '100%' }}>
      <MapContainer
        center={position}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
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