import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import "./map.css";

interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
    children?: React.ReactNode;
}

const defaults = {
    zoom: 13,
}

const Map = (props: MapProps) => {
    const { zoom = defaults.zoom, posix, children } = props;

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            className="leaflet-container"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {children}
        </MapContainer>
    )
}

export default Map;