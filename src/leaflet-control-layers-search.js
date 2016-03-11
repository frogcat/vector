(function() {

  L.Control.Layers.Search = L.Control.Layers.extend({
    onAdd : function(map) {
      location.search.replace("?", "").split("/").forEach(function(key) {
        for ( var a in this._layers) {
          var b = this._layers[a];
          if (b.name === key)
            b.layer.addTo(map);
        }
      }, this);
      map.on("layeradd layerremove", this._save, this);
      return L.Control.Layers.prototype.onAdd.call(this, map);
    },
    onRemove : function(map) {
      map.off("layeradd layerremove", this._save, this);
      L.Control.Layers.prototype.onRemove.call(this, map);
    },
    _save : function() {
      var x = [];
      for ( var a in this._layers) {
        var b = this._layers[a];
        if (this._map.hasLayer(b.layer))
          x.push(b.name);
      }
      if (x.length > 0)
        history.replaceState(null, "", "?" + x.join("/") + location.hash);
    }
  });

  L.control.layers.search = function(baseLayers, overlays, options) {
    return new L.Control.Layers.Search(baseLayers, overlays, options);
  };

})();