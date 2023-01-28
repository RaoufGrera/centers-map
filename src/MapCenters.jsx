import 'mapbox-gl/dist/mapbox-gl.css';
import React, { useCallback, useEffect, useRef, useState, Component } from 'react';
import Select, { createFilter } from "react-select";
import { FixedSizeList as List } from "react-window";


import MapRef, { Map, Marker, Popup, GeolocateControl, NavigationControl } from 'react-map-gl';

import myData from './assets/centers2023.json';
const options = [];

myData.forEach(e => {
    options.push({
        id: e.id,
        value: e.id.toString(),
        label: e.name + " [ " + e.office + " ]",
        longitude: e.longitude,
        latitude: e.latitude

    }); //l
})

const height = 35;

class MenuList extends Component {
    render() {
        const { options, children, maxHeight, getValue } = this.props;
        const [value] = getValue();
        const initialOffset = options.indexOf(value) * height;

        return (
            <List
                height={maxHeight}
                itemCount={children.length}
                itemSize={height}
                initialScrollOffset={initialOffset}
            >
                {({ index, style }) => <div style={style}>{children[index]}</div>}
            </List>
        );
    }
}

export default function MapCenters() {


    const MAPBOX_TOKEN = 'pk.eyJ1IjoicmFvdWZnciIsImEiOiJja3Jnbm9kNHEybGlqMnpwOGJjOXFvb3UxIn0.cjUUHrB8swfMk3QojQbQFA'; // Set your mapbox token here


    const [popupInfo, setPopupInfo] = useState(null);

    const mapRef = useRef(MapRef);
    const [urlGoogle, setUrlGoogle] = useState(null)

    const onClick = useCallback(event => {
        const latlong = event.lngLat.wrap();
        console.log(event.lngLat.wrap());
        const feature = event.features && event.features[0];
        if (feature) {
            //window.alert(`Clicked layer ${feature.layer.id}`); // eslint-disable-line no-alert


            mapRef.current?.flyTo({ center: [feature.properties.longitude, feature.properties.latitude], duration: 2000, zoom: 16.3 });
            setUrlGoogle(`https://www.google.com/maps/dir/?api=1&destination=${feature.properties.latitude},${feature.properties.longitude}`)
            SetSelectValue(feature.properties.id.toString());
            console.log(feature.properties);
            setPopupInfo(feature.properties);
        }
    }, []);
    const [selectValue, SetSelectValue] = useState("0");
    const [style, setstyle] = useState("mapbox://styles/raoufgr/ckrfl2kb54ik717nrghiaqyhv");
    const [cursor, setCursor] = useState('auto');
    const [data, setData] = useState([]);
    const onMouseEnter = useCallback(() => setCursor('pointer'), []);
    const onMouseLeave = useCallback(() => setCursor('auto'), []);
    // const [centers, setCenters] = useState([]);
    function fillData() {
        const items = [];

        myData.forEach(e => {
            items.push({
                id: e.id,
                value: e.id.toString(),
                label: e.name + " [ " + e.office + " ]",
                longitude: e.longitude,
                latitude: e.latitude

            }); //l
        })

        //console.log("r", relatedCounties[i].properties)

        // setCenters(items);
    }

    useEffect(() => {
        //fillData()
    }, [])

    const query = (e) => {

        const enodata = options.filter(word => word?.value == e.value);

        SetSelectValue(e.value)
        if (enodata.length != 0) {
            const feature = enodata[0];
            mapRef.current?.flyTo({ center: [feature.longitude, feature.latitude], duration: 2000, zoom: 16.3 });
            // setPopupInfo(feature.properties);
        }
    }

    return (<>

        <Map
            ref={mapRef}
            style={{ position: "absolute", width: "100%", height: "100%" }}
            initialViewState={{
                latitude: 28.549256,
                longitude: 17.5409206307,
                bearing: 0,
                pitch: 20,
                zoom: 5.3
            }}
            cursor={cursor}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            mapStyle={style}
            mapboxAccessToken={MAPBOX_TOKEN}
            interactiveLayerIds={["centers"]}
            onClick={(e) => onClick(e)}

        //  onMouseOver={onMouseOver}
        //  onLoad={() => onloadMap()}
        //  onMouseDown={() => setPopupInfo(null)}
        >
            {popupInfo && (
                <Marker


                    anchor="bottom"
                    longitude={popupInfo.longitude}
                    latitude={popupInfo.latitude}

                >

                    <Popup
                        longitude={popupInfo.longitude}
                        latitude={popupInfo.latitude}

                        closeButton={false}
                        closeOnClick={false}
                        className="rtl"
                    >

                        <button onClick={() => setPopupInfo(null)} type="button" className="absolute top-2 left-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" data-modal-hide="authentication-modal">
                            <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            <span className="sr-only">Close modal</span>
                        </button>
                        <div className="px-2 py-3 md:px-4 text-base border-b rounded-t dark:border-gray-600">
                            <span >المركز</span>
                            <span className="bg-yellow-100 text-yellow-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{popupInfo.id}</span>

                        </div>
                        <div className="p-2 text-base">

                            <ul>
                                <li><span> {popupInfo.name}</span></li>

                            </ul>


                        </div>
                        <div className=" p-3 flex flex-col border-t content-center border-gray-200 rounded-b dark:border-gray-600">
                            <a href={urlGoogle} target="_blank" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Google map</a>
                        </div>


                    </Popup>



                </Marker>
            )}

            <GeolocateControl position="top-left" />
            <NavigationControl position="top-left" />
        </Map>
        <div className='flex mt-2 justify-center '>

            <Select
                className='w-1/2 rtl'
                filterOption={createFilter({ ignoreAccents: false })} // this makes all the difference!
                components={{ MenuList }}
                value={options.filter(function (option) {
                    return option.value === selectValue;
                })}
                onChange={(e) => query(e)}
                options={options}
            />
        </div>
        <div className='absolute bottom-0 left-0 bg-white p-2 rtl text-sm	border-l-red-400'>
            تم استخدام المراكز الانتخابية من الموقع الخاص بالمفوضية الوطنية العليا للانتخابات https://centers.hnec.ly/
        </div>

    </>);
}

