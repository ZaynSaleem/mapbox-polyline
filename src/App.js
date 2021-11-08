// import logo from './logo.svg';
import "./App.css";
import ReactMapGL, {
  GeolocateControl,
  NavigationControl,
  Source,
  Layer,
  Marker,
} from "react-map-gl";
import MapboxAutocomplete from "react-mapbox-autocomplete";
import { FaMapMarkerAlt, FaMapPin, FaRegCircle } from "react-icons/fa";

import { useState } from "react";
// import 'mapbox-gl/dist/mapbox-gl.css';
import "mapbox-gl/dist/mapbox-gl.css";

function App() {
  const geolocateControlStyle = {
    right: 10,
    top: 10,
  };
  const navControlStyle = {
    right: 10,
    top: 10,
  };
  const [viewport, setViewport] = useState({
    longitude: 67.0011,
    latitude: 24.8607,
    zoom: 13,
  });
  const [startPoint, setStartPoint] = useState({
    longitude: 67.0011,
    latitude: 24.8607,
  });

  const [endPoint, setEndPoint] = useState([]);
  // console.log(viewport);
  const [end, setEnd] = useState();
  const [endStyle, setEndStyle] = useState();

  const [lineJson, setLineJson] = useState();
  const [lineLayer, setLineLayer] = useState();

  const geojson = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [startPoint.longitude, startPoint.latitude],
        },
      },
    ],
  };

  const layerStyle = {
    id: "point",
    type: "circle",
    paint: {
      "circle-radius": 10,
      "circle-color": "#007cbf",
    },
  };
  // center: [-122.486052, 37.830348],
  // const geojson = {
  //   type: "Feature",
  //   properties: {},
  //   geometry: {
  //     type: "LineString",
  //     coordinates: [
  //       [-122.483696, 37.833818],
  //       [-122.483696, 37.835818],
  //     ],
  //   },
  // };

  // const layerStyle = {
  //   id: "route",
  //   type: "line",
  //   source: "route",
  //   layout: {
  //     "line-join": "round",
  //     "line-cap": "round",
  //   },
  //   paint: {
  //     "line-color": "#888",
  //     "line-width": 8,
  //   },
  // };

  const getRoute = async (start, end) => {
    if (end && end.length) {
      // console.log(end[0] ," ===");
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/cycling/${start[0]},${
          start[1]
        };${end[0]},${
          end[1]
        }?steps=true&geometries=geojson&access_token=${"pk.eyJ1IjoibXVzdGFmYTQ3IiwiYSI6ImNrdTVhMm10MTRtZ3ozMm5xOXduank3dmoifQ.werjfk2RgOtDvnb5-YxI6A"}`,
        { method: "GET" }
      );
      // console.log(query)
      const json = await query.json();
      console.log(json);
      if (json.routes[0]) {
        const data = json.routes[0];
        // console.log(data)
        const route = data.geometry.coordinates;
        console.log(route);

        setLineJson({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: route,
          },
        });
        if (!lineJson) {
        }
        setLineLayer({
          id: "route",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#3887be",
            "line-width": 5,
            "line-opacity": 0.75,
          },
        });
      } else {
        alert("No Routes Found")
        return false
      }
    } else {
      // console.log("null");
      return false;
    }
  };
  // getRoute()
  const suggestionSelect = (result, lat, lng, text) => {
    console.log([+lat, +lng]);
    let arr = [+lng, +lat];
    if ([+lat, +lng] && [+lat, +lng].length) {
      setEnd({
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: { type: "Point", coordinates: arr },
          },
        ],
      });

      setEndStyle({
        id: "cicle",
        type: "circle",
        paint: {
          "circle-radius": 10,
          "circle-color": "red",
        },
      });
      setEndPoint(arr);
      getRoute([startPoint.longitude, startPoint.latitude], arr);
      // setViewport({
      //   longitude: +lng,
      //   latitude: +lat,
      //   zoom: 12,
      // });
    } else {
      console.log("Empty");
      return false;
    }
  };
  // console.log(endPoint);

  const yourLocate = (result, lat, lng, text) => {
    // console.log([lat, lng]);
    let res = [lng, lat];
    let obj = {
      longitude: +lng,
      latitude: +lat,
    };
    // console.log(obj);
    setViewport({
      longitude: +lng,
      latitude: +lat,
      zoom: 13,
    });
    setStartPoint(obj);
    if (endPoint && endPoint.length) {
      getRoute(res, endPoint);
    }
  };
  // const clickMap = (result) => {
  //   // console.log(result.lngLat);
  //   setEnd({
  //     type: "FeatureCollection",
  //     features: [
  //       {
  //         type: "Feature",
  //         geometry: { type: "Point", coordinates: result.lngLat },
  //       },
  //     ],
  //   });

  //   setEndStyle({
  //     id: "point",
  //     type: "circle",
  //     paint: {
  //       "circle-radius": 10,
  //       "circle-color": "red",
  //     },
  //   });
  //   getRoute(result.lngLat);
  // };

  // console.log(end);
  // const Map = ReactMapboxGl({
  //   accessToken:
  //     "pk.eyJ1IjoibXVzdGFmYTQ3IiwiYSI6ImNrdTVhMm10MTRtZ3ozMm5xOXduank3dmoifQ.werjfk2RgOtDvnb5-YxI6A",
  // });
  return (
    <>
      <ReactMapGL
        {...viewport}
        mapboxApiAccessToken={`pk.eyJ1IjoibXVzdGFmYTQ3IiwiYSI6ImNrdTVhMm10MTRtZ3ozMm5xOXduank3dmoifQ.werjfk2RgOtDvnb5-YxI6A`}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        // center={[-122.4 , 37.8]}
        width="100vw"
        height="100vh"
        mapStyle="mapbox://styles/mapbox/streets-v9"
        // onClick={clickMap}
        {...suggestionSelect}
        // on
      >
        {/* <GeolocateControl
          style={geolocateControlStyle}
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
          auto
        /> */}
        <NavigationControl style={navControlStyle} />
        <Source id="point" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source>
        {end ? (
          <Source id="circle" type="geojson" data={end}>
            <Layer {...endStyle} />
          </Source>
        ) : null}
        {lineJson ? (
          <Source id="route" type="geojson" data={lineJson}>
            <Layer {...lineLayer} />
          </Source>
        ) : null}
        <div className="map-search-box">
          <div className="search-icon">
            <div>
              <FaRegCircle className="ms-2" />
            </div>
            <div>
              <MapboxAutocomplete
                publicKey="pk.eyJ1IjoibXVzdGFmYTQ3IiwiYSI6ImNrdTVhMm10MTRtZ3ozMm5xOXduank3dmoifQ.werjfk2RgOtDvnb5-YxI6A"
                inputClass="form-control search"
                onSuggestionSelect={yourLocate}
                country="pk"
                resetSearch={false}
                placeholder="Your Location"
              />
            </div>
          </div>
          <div className="search-icon">
            <div>
              <FaMapMarkerAlt className="ms-2" />
            </div>
            <div>
              <MapboxAutocomplete
                publicKey="pk.eyJ1IjoibXVzdGFmYTQ3IiwiYSI6ImNrdTVhMm10MTRtZ3ozMm5xOXduank3dmoifQ.werjfk2RgOtDvnb5-YxI6A"
                inputClass="form-control search"
                onSuggestionSelect={suggestionSelect}
                country="pk"
                resetSearch={false}
                placeholder="choose destination"
              />
            </div>
          </div>
        </div>
        {/* <Source id="my-data" type="geojson" data={geojson}>
          <Layer {...layerStyle} />
        </Source> */}
      </ReactMapGL>
    </>
  );
}

export default App;
