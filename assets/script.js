let markersAll = []; //array con todos los markers

//Inicializo el mapa (callback en script google api en index.html)
window.initMap = () => {
    const maimo = { lat: -34.610490, lng: -58.440860 }; //esto es maimo!
    const map = new google.maps.Map(
        document.getElementById('map'),
        {
            zoom: 5, //Zoom
            center: maimo, //Centrado de mapa
            styles: styles, //Estilos de mapa, los agrego en index.html mapaStyles.js
            streetViewControl: false, //Desactivo el street view (chaboncito)
            fullscreenControl: false, //Desactivo el boton de fullscreeen
            mapTypeControlOptions: { //Desactivo los tipos de terreno del mapa (satellite y terrain)
                mapTypeIds: []
            },
            zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER //ubico los controles de zoom
            }
        });
    fetchMarkers(map) //Llamammos a la función que trae el json de markers
    
    //FILTROS
    //Traigo elementos del DOM
    const handleTodos = document.getElementById('todos');
    const handleClaridad = document.getElementById('claridad');
    const handleComodidad = document.getElementById('comodidad');

    //Eventos de click de los filtros
    handleTodos.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('todos');
        marked(handleTodos);
    })
    handleClaridad.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('quality');
        marked(handleClaridad);
    })
    handleComodidad.addEventListener('click', (e) => {
        e.preventDefault();
        addMarkerFiltered('convenience');
        marked(handleComodidad);
    })

    const marked = (buttonname) => {
        document.querySelectorAll('button').forEach((but) =>{
            but.setAttribute('class',null);
        });
        buttonname.setAttribute('class','selected');
    }
    

    //Agrego los markers filtrados según filtro (markerType)
    const addMarkerFiltered = async (markerType) => {
        console.log('clicked filter');
        const data= await fetch('https://tp-2-backend.tas014.now.sh/astronomy_activator');
        const processed= await data.json();
        markersAll.forEach((marker) => {
            //console.log(marker)
            marker.setMap(null); //Quita todos los markers del mapa
        });
        if (markerType!='todos'){
            markersAll.forEach((marker,index) => {
                let modifier;
                if (markerType == 'quality') {
                    modifier=processed[index].quality;
                } else {
                    modifier=processed[index].convenience;
                }
                marker.setMap(map);
                marker.setOpacity(parseInt(modifier)/10);
                console.log(parseInt(modifier)/10);
            })
        } else {
            markersAll.forEach((marker)=>{
                marker.setMap(map);
                marker.setOpacity(1)
            })
        }
    }
}

//Función de asincrónica que trae los markers
const fetchMarkers = async (map) => { 
    try {
        const response = await fetch('https://tp-2-backend.tas014.now.sh/astronomy_activator');
        const json = await response.json();
        console.log(json);
        json.forEach(marker => {
            addMarker(map, marker);
        });
        //console.log(markersAll)
    } catch (error) {
        console.log(error);
    }
}

const specifiedRedirect = (lat,long) => {
    window.open(`https://www.google.com.ar/maps/@${lat},${long},13z`,'_blank')
}

//Función de agregado de un marker
const addMarker = (map, marker) => { 
    //Destructuring de la info del marker
    const {lat, long, quality, convenience} = marker;

    //Armo la infowindow
    const contentString = `
    <div class="contain">
    <div class="markerimage"></div>
    <ul>
    <div>
    <h2>Calidad de cielo</h2>
    <li>${quality}</li>
    </div>
    <div>
    <h2>Conveniencia</h2>
    <li>${convenience}</li>
    </div>
    <button onclick="specifiedRedirect(${lat},${long})" class="viewButton">Ver en detalle</button>
    </ul></div>`;
    const infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    //Iconos
    const icons = {
        'nombre':'assets/images/marker.png'
    }
    //Agrego el marker
    const markerItem = new google.maps.Marker(
        {
            position: {lat: parseInt(lat), lng: parseInt(long)},
            icon: icons['nombre'],
            map: map,
            //customInfo: type
        }
    );
    markerItem.setMap(map);
    //Agrego evento de click en el marker, abre infowindow
    markerItem.addListener('click', function () {
        infowindow.open(map, markerItem);
    });
    //Agrego nuevo marker
    markersAll.push(markerItem);
}