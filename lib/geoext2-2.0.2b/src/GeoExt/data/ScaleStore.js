Ext.define("GeoExt.data.ScaleStore",{requires:["GeoExt.data.ScaleModel","GeoExt.panel.Map"],extend:"Ext.data.Store",model:"GeoExt.data.ScaleModel",map:null,constructor:function(n){n=n||{};var t=n.map instanceof GeoExt.panel.Map?n.map.map:n.map;delete n.map;this.callParent([n]);t&&this.bind(t)},bind:function(n){this.map=n instanceof GeoExt.panel.Map?n.map:n;this.map.events.register("changebaselayer",this,this.populateFromMap);this.map.baseLayer?this.populateFromMap():this.map.events.register("addlayer",this,this.populateOnAdd)},unbind:function(){this.map&&(this.map.events&&(this.map.events.unregister("addlayer",this,this.populateOnAdd),this.map.events.unregister("changebaselayer",this,this.populateFromMap)),delete this.map)},populateOnAdd:function(n){n.layer.isBaseLayer&&(this.populateFromMap(),this.map.events.unregister("addlayer",this,this.populateOnAdd))},populateFromMap:function(){for(var t,i=[],r=this.map.baseLayer.resolutions,u=this.map.baseLayer.units,n=r.length-1;n>=0;n--)t=r[n],i.push({level:n,resolution:t,scale:OpenLayers.Util.getScaleFromResolution(t,u)});this.loadData(i)},destroy:function(){this.unbind();this.callParent(arguments)}})