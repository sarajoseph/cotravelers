/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, GeoJSON  } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { LatLngTuple, Layer  } from 'leaflet'
import countriesGeoJson from '../assets/countries.geo.json'
import { Feature, GeoJsonProperties, Geometry } from 'geojson'
import { useWorldMap } from '../hooks/useWorldMap'
import { useCallback, useEffect, useMemo, useState } from 'react'

type WorldMapProps = {
  countriesVisited: string[],
  handleClickCountry?: (countryName: string) => Promise<void>
}

export const WorldMap = ({ countriesVisited, handleClickCountry }: WorldMapProps) => {
  const position: LatLngTuple = [15, 0]
  const [zoomLevel, setZoomLevel] = useState<number>(window.innerWidth < 768 ? 1 : 2)
  const data = countriesGeoJson as GeoJSON.FeatureCollection<Geometry, GeoJsonProperties>
  const { countryStyle, onCountryHover, onCountryHoverOut } = useWorldMap(countriesVisited)

  useEffect(() => {
    const handleResize = () => setZoomLevel(window.innerWidth < 768 ? 1 : 2)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // useMemo para almacenar countryStyle solo cuando cambien las propiedades relevantes.
  const memoCountryStyle = useMemo(() => countryStyle, [countryStyle])

  // useCallback para la función handleFeature para evitar que se recree en cada render.
  const handleFeature = useCallback((feature: Feature<Geometry, any>, layer: Layer) => {
    layer.on({
      click: async () => handleClickCountry && await handleClickCountry(feature?.properties?.name),
      mouseover: onCountryHover,
      mouseout: onCountryHoverOut
    })
  }, [handleClickCountry, onCountryHover, onCountryHoverOut])

  return (
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
        style={memoCountryStyle}
        onEachFeature={handleFeature}
      />
    </MapContainer>
  )
}