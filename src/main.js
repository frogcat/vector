require('./leaflet-control-elevation.js');
require('./leaflet-control-layers-search.js');
require('./leaflet-tilelayer-geojson.js');
var japanese = require('japanese');
require('leaflet-hash');

(function(window) {

  if (!location.search || location.search == "")
    history.replaceState(null, "", "?ortho" + location.hash);
  if (!location.hash || location.hash == "")
    history.replaceState(null, "", location.search + "#15/35.6707/139.7852");

  var tmpl = "http://cyberjapandata.gsi.go.jp/xyz/{id}/{z}/{x}/{y}.{extension}";
  var baseLayers = {};
  var overlays = {};

  baseLayers["ortho"] = L.tileLayer(tmpl, {
    id: "ort",
    extension: "jpg"
  });

  baseLayers["default"] = L.tileLayer(tmpl, {
    id: "std",
    extension: "png"
  });

  baseLayers["relief"] = L.tileLayer(tmpl, {
    minZoom: 5,
    maxNativeZoom: 15,
    maxZoom: 17,
    id: "relief",
    extension: "png"
  });

  overlays["river"] = L.tileLayer.geoJson(tmpl, {
    zoom: 16,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_rvrcl",
    extension: "geojson"
  }, function(json) {
    return [L.geoJson(json, {
      className: "geojson-rvrcl"
    }), L.geoJson(json, {
      className: "geojson-rvrcl-shadow",
      pane: "tilePane"
    })];
  });

  overlays["road"] = L.tileLayer.geoJson(tmpl, {
    zoom: 16,
    maxZoom: 20,
    minZoom: 16,
    id: "experimental_rdcl",
    extension: "geojson"
  }, function(json) {
    return [L.geoJson(json, {
      className: "geojson-rdcl"
    }), L.geoJson(json, {
      className: "geojson-rdcl-shadow",
      pane: "tilePane"
    })];
  });

  overlays["railway"] = L.tileLayer.geoJson(tmpl, {
    zoom: 16,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_railcl",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      if (b.properties.snglDbl == "駅部分") {
        a.push(L.geoJson(b, {
          className: "geojson-railcl-eki"
        }));
        a.push(L.geoJson(b, {
          className: "geojson-railcl-eki-shadow",
          pane: "tilePane"
        }));
      } else if (b.properties.type == "普通鉄道（ＪＲ）") {
        a.push(L.geoJson(b, {
          className: "geojson-railcl-jr"
        }));
        a.push(L.geoJson(b, {
          className: "geojson-railcl-jr-shadow",
          pane: "tilePane"
        }));
      } else {
        a.push(L.geoJson(b, {
          className: "geojson-railcl"
        }));
        a.push(L.geoJson(b, {
          className: "geojson-railcl-shadow",
          pane: "tilePane"
        }));
      }
    });
    return a;
  });

  overlays["anno-ja"] = L.tileLayer.geoJson(tmpl, {
    zoom: 15,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_anno",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      a.push(L.marker(L.GeoJSON.coordsToLatLng(b.geometry.coordinates), {
        icon: L.divIcon({
          className: "geojson-anno",
          html: b.properties.knj
        })
      }));
    });
    return a;
  });

  overlays["anno-kana"] = L.tileLayer.geoJson(tmpl, {
    zoom: 15,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_anno",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      a.push(L.marker(L.GeoJSON.coordsToLatLng(b.geometry.coordinates), {
        icon: L.divIcon({
          className: "geojson-anno",
          html: b.properties.kana
        })
      }));
    });
    return a;
  });

  overlays["anno-en"] = L.tileLayer.geoJson(tmpl, {
    zoom: 15,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_anno",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      a.push(L.marker(L.GeoJSON.coordsToLatLng(b.geometry.coordinates), {
        icon: L.divIcon({
          className: "geojson-anno",
          html: japanese.romanize(b.properties.kana)
        })
      }));
    });
    return a;
  });

  var map = L.map("map", L.extend({
    maxZoom: 20,
    minZoom: 8
  }, L.Hash.parseHash(location.hash)));
  map.zoomControl.setPosition("bottomright");
  map.attributionControl.addAttribution("<a href='http://maps.gsi.go.jp/development/'>地理院タイル</a>");

  L.hash(map);
  L.control.layers.search(baseLayers, overlays).addTo(map);
  L.control.elevation().addTo(map);

})(window);