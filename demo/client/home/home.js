/**
 * Created by kenta on 6/3/17.
 */

Template.home.viewmodel({
    mapLoaded: false,
    onCreated() {
        const self = this;
        GoogleMaps.ready("sourceMap", map => {
            self.mapLoaded(map);
        })
    },
    autorun() {
        let map;
        if (map = this.mapLoaded()) {
            const latLng = Geolocation.latLng();
            if (!latLng)
                return;

            let marker;

            if (!marker) {
                marker = new google.maps.Marker({
                    position: new google.maps.LatLng(latLng.lat, latLng.lng),
                    draggable: true,
                    map: map.instance
                });

                map.instance.setCenter(marker.getPosition());
                map.instance.setZoom(3);
            }
        }
    },
    onRendered() {
        GoogleMaps.load({key: "AIzaSyCUCn4eDg_EV0vn1oFoOzSUS-N_ORPSO9k"});
    },
    sourceMapOptions() {
        if (GoogleMaps.loaded()) {
            return {
                center: new google.maps.LatLng(-37.8136, 144.9631),
                zoom: 8
            };
        }
    }
})