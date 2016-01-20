/* jshint plusplus: false */
/* globals L */
L.Control.SimpleMarkers = L.Control.extend({
    options: {
        position: 'topleft',
        add_control: true,
        delete_control: true
    },
    map: undefined,
    markerList: [],
    
    onAdd: function (map) {
        "use strict";
        this.map = map;
        var marker_container = L.DomUtil.create('div', 'marker_controls');

        if (this.options.add_control) {
            var add_marker_div = L.DomUtil.create('div', 'add_marker_control', marker_container);
            add_marker_div.title = 'Add a marker';
            L.DomEvent.addListener(add_marker_div, 'click', L.DomEvent.stopPropagation)
                .addListener(add_marker_div, 'click', L.DomEvent.preventDefault)
                .addListener(add_marker_div, 'click', this.enterAddMarkerMode.bind(this));
        }
        if (this.options.delete_control) {
            var del_marker_div = L.DomUtil.create('div', 'del_marker_control', marker_container);
            del_marker_div.title = 'Delete a marker';


            L.DomEvent.addListener(del_marker_div, 'click', L.DomEvent.stopPropagation)
                .addListener(del_marker_div, 'click', L.DomEvent.preventDefault)
                .addListener(del_marker_div, 'click', this.enterDelMarkerMode.bind(this));
        }

        return marker_container;
    },

    enterAddMarkerMode: function () {
        "use strict";
        if (this.markerList !== '') {
            for (var marker = 0; marker < this.markerList.length; marker++) {
                if (typeof(this.markerList[marker]) !== 'undefined') {
                    this.markerList[marker].removeEventListener('click', this.onMarkerClickDelete.bind(this));
                }
            }
        }
        this.map._container.style.cursor = 'crosshair';
        this.map.addEventListener('click', this.onMapClickAddMarker.bind(this));
    },

    enterDelMarkerMode: function () {
        "use strict";
        for (var marker = 0; marker < this.markerList.length; marker++) {
            if (typeof(this.markerList[marker]) !== 'undefined') {
                this.markerList[marker].addEventListener('click', this.onMarkerClickDelete.bind(this));
                this.map._container.style.cursor = 'crosshair';
            }
        }
    },

    onMapClickAddMarker: function (e) {
        "use strict";
        this.map.removeEventListener('click');
        this.map._container.style.cursor = 'auto';

        var popupContent =  "You clicked on the map at " + e.latlng.toString();
        var the_popup = L.popup({maxWidth: 160, closeButton: false});
        the_popup.setContent(popupContent);

        var marker = L.marker(e.latlng);
        marker.addTo(this.map);
        marker.bindPopup(the_popup).openPopup();
        this.markerList.push(marker);

        return false;
    },

    onMarkerClickDelete: function (e) {
        "use strict";
        this.map._container.style.cursor = 'auto';
        this.map.removeLayer(this);
        var marker_index = this.markerList.indexOf(this);
        delete this.markerList[marker_index];

        for (var marker = 0; marker < this.markerList.length; marker++) {
            if (typeof(this.markerList[marker]) !== 'undefined') {
                this.markerList[marker].removeEventListener('click', this.onMarkerClickDelete.bind(this));
            }
        }
        return false;
    }
});
