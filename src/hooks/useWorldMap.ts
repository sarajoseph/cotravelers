import { Feature, Geometry, GeoJsonProperties } from 'geojson'
import { LeafletMouseEvent } from 'leaflet'
import { useState } from 'react'

export const useWorldMap = (countriesVisited: string[]) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null)

  const countryStyle = (feature?: Feature<Geometry, GeoJsonProperties>) => {
    if (!feature) return {}
    const countryName = feature.properties?.name
    return {
      color: countriesVisited?.includes(countryName) ? '#3d9119' : '#d1c1a2',
      weight: 2,
      opacity: 0,
      fillOpacity: getFillOpacity(countryName)
    }
  }

  const getFillOpacity = (countryName: string) => {
    const opacityNoSelectedCountry: number = 0.2
    const opacitySelectedCountry: number = 0.3

    // Opacity when hover is in no selected country
    if (hoveredCountry === countryName && countriesVisited !== undefined && !countriesVisited.includes(countryName)) {
      return opacityNoSelectedCountry + 0.4

    // Opacity when hover is in selected country
    } else if (hoveredCountry === countryName && countriesVisited !== undefined && countriesVisited.includes(countryName)) {
      return opacitySelectedCountry + 0.1

    // Opacity in selected country
    } else if (countriesVisited !== undefined && countriesVisited.includes(countryName)) {
      return opacitySelectedCountry

    // Opacity in no selected country and default
    } else {
      return opacityNoSelectedCountry
    }
  }

  // Muestra el nombre del país al hacer hover
  const onCountryHover = (e: LeafletMouseEvent) => {
    const countryName = e.target.feature.properties.name
    setHoveredCountry(countryName)
    e.target.bindPopup(countryName, {
      className: 'custom-map-css',
      closeButton: false,
      closeOnClick: false
    }).openPopup()
  }

  // No muestra nombre de país al quitar el hover
  const onCountryHoverOut = (e: LeafletMouseEvent) => {
    setHoveredCountry(null)
    e.target.closePopup()
  }

  return {
    countryStyle,
    onCountryHover,
    onCountryHoverOut
  }
}