(function() {

  var ajax = {
    queue: [],
    load: function(url) {
      var obj = null;
      this.queue.forEach(function(a) {
        obj = (a.url == url ? a : obj);
      });
      if (!obj) {
        obj = {
          url: url
        };
        obj.promise = new Promise(function(resolve, reject) {
          obj.resolve = resolve;
          obj.reject = reject;
        });
        this.queue.push(obj);
        if (this.queue.length == 1)
          this.next();
      }
      return obj.promise;
    },
    next: function() {
      var obj = this.queue.shift();
      if (!obj)
        return;
      var x = new XMLHttpRequest();
      x.onreadystatechange = function() {
        if (x.readyState == 4) {
          obj.resolve(x.status == 200 ? x.responseText : null);
          ajax.next();
        }
      };
      x.open("get", obj.url, true);
      x.send();
    }
  };

  L.TileLayer.GeoJSON = L.LayerGroup.extend({
    options: {
      minZoom: 16,
      maxZoom: 16,
      zoom: 16
    },
    initialize: function(tmpl, options, geojson2layers) {
      L.Util.setOptions(this, options);
      this._tmpl = tmpl;
      this._geojson2layers = geojson2layers;
      L.LayerGroup.prototype.initialize.call(this);
    },
    onAdd: function(map) {
      L.LayerGroup.prototype.onAdd.call(this, map);
      this.update();
    },
    onRemove: function(map) {
      L.LayerGroup.prototype.onRemove.call(this, map);
    },
    getEvents: function() {
      return {
        "moveend": this.update,
        "zoomend": this.update
      };
    },

    update: function(event) {

      var map = this._map;
      var opt = this.options;
      var geojson2layers = this._geojson2layers;

      if (map.getZoom() > opt.maxZoom || map.getZoom() < opt.minZoom) {
        this.clearLayers();
        return;
      }

      var zoom = opt.zoom;
      var box = map.getBounds();
      var sw = map.project(box.getSouthWest(), zoom - 8).floor();
      var ne = map.project(box.getNorthEast(), zoom - 8).ceil();
      var coords = [];
      for (var y = ne.y - 1; y <= sw.y; y++) {
        for (var x = sw.x; x < ne.x; x++) {
          var coord = L.point(x, y);
          coord.z = zoom;
          coords.push(coord);
        }
      }

      var layers = {};
      for (var key in this._layers) {
        var layer = this._layers[key];
        layers[layer.coords] = layer;
      }

      coords.forEach(function(c) {
        var key = c.toString();
        if (layers[key]) {
          delete layers[key];
          return;
        }

        var layer = L.layerGroup();
        this.addLayer(layer);
        layer.coords = key;

        var that = this;
        ajax.load(L.Util.template(that._tmpl, L.extend(c, opt))).then(function(txt) {
          var json = JSON.parse(txt);
          if (!json)
            return;
          geojson2layers(json).forEach(function(a) {
            layer.addLayer(a);
          });
        });

      }, this);

      for (var key in layers) {
        this.removeLayer(layers[key]);
      }
    }
  });

  L.tileLayer.geoJson = function(tmpl, options, geojson2layers) {
    return new L.TileLayer.GeoJSON(tmpl, options, geojson2layers);
  };

})();
