(function() {

  L.Control.Elevation = L.Control.extend({
    options : {
      position : 'bottomleft'
    },
    initialize : function(options) {
      L.Util.setOptions(this, options);
    },
    onAdd : function(map) {
      this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
      this._container.innerHTML = "LatLng(####,####)";
      map.on("mousemove", this.update, this);
      return this._container;
    },
    update : function(event) {
      this._container.innerHTML = event.latlng.toString();
    }
  });

  L.control.elevation = function(options) {
    return new L.Control.Elevation(options);
  };

})();