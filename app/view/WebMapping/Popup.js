Ext.define('eafire.view.WebMapping.Popup', 
{

    extend: 'Ext.window.Window',
    alias: 'widget.gx_popup',

	
	        width:200,
			height:255,
			layout:'fit',

            maximizable: true,
            collapsible: true,
	
    insideViewport: true,

    animCollapse: false,

    draggable: false,
    shadow: false,
    unpinnable: true,

    map: true,

    anchored: true,

    panIn: true,

    /**
     * @cfg {OpenLayers.Feature.Vector/OpenLayers.LonLat/OpenLayers.Pixel} location
     * A location for this popup's anchor.
     */
    //location: null,
location: new OpenLayers.LonLat(selected_record_longitude_value,selected_record_latitude_value),
    anchorPosition: "top-right"
	
	});