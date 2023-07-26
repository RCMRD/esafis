
var latest_fire_layer, last_48hr_fire_layer, conservation_areas_layer, mark; 
Ext.define('eafire.view.WebMapping.GeoExtMapPanel', 
{
	extend: 'GeoExt.panel.Map',
	alias: 'widget.GeoExtMapPanel',
	id: 'GeoExtMapPanelId',
	border: 'false',
	layout: 'fit',
	region: 'center',
	width: '100%',
	height:'100%',
	center: '29.577899,3.443310',
	zoom: 11,
	initComponent: function() 
	{
		var me = this,
		items = [],
		ctrl;

		map = new OpenLayers.Map('map', options);
		map.addControl(new OpenLayers.Control.LayerSwitcher());
		map.addControl(new OpenLayers.Control.Navigation({dragPanOptions: {enableKinetic: true}})); 
		map.addControl(new OpenLayers.Control.Scale());
		map.addControl(new OpenLayers.Control.LoadingPanel()); 

	//	map.addControl(new OpenLayers.Control.OverviewMap());


	africa_outline = new OpenLayers.Layer.Vector( "Africa", {
		isBaseLayer: true, displayInLayerSwitcher: true, visibility: true,
		projection:  new OpenLayers.Projection('EPSG:4326'),
		strategies: [new OpenLayers.Strategy.Fixed()],
		protocol: new OpenLayers.Protocol.HTTP
		({
				//url:  "data/webmapping/select_borehole_data.php",
				url:  "data/webmapping/africa.json",
				//url:  "data/webmapping/borehole_results.json",		
				format: new OpenLayers.Format.GeoJSON
				({
					extractStyles: true,
					extractAttributes: true
				})
			})		
	});
///Baselayers
/*
var gphy = new OpenLayers.Layer.Google(
	"Google Physical Terrain",
	{isBaseLayer: true, type: google.maps.MapTypeId.TERRAIN, visibility:false, transitionEffect: 'resize'}
	);

var gmap = new OpenLayers.Layer.Google(
			"Google Streets", // the default
			{isBaseLayer: true,numZoomLevels: 20,visibility:false, transitionEffect: 'resize'}
			);

var ghyb = new OpenLayers.Layer.Google(
	"Google Hybrid",
	{isBaseLayer: true,type: google.maps.MapTypeId.HYBRID, numZoomLevels: 22,visibility:false, transitionEffect: 'resize'}
	);

var gsat = new OpenLayers.Layer.Google(
	"Google Satellite",
	{isBaseLayer: true,type: google.maps.MapTypeId.SATELLITE, numZoomLevels: 20,visibility:false, transitionEffect: 'resize'}
	);

*/
var mapbox_street = new OpenLayers.Layer.XYZ("Mapbox Street",
	["http://a.tiles.mapbox.com/v4/mapbox.streets/${z}/${x}/${y}.png?access_token=pk.eyJ1Ijoid29uZGllIiwiYSI6InlKcXpXT1UifQ.BQ3hMXdyffGusTRN8JnWOg"], {
		sphericalMercator: true,
		wrapDateLine: true,
		numZoomLevels: 20,
		transitionEffect: 'resize'
	});

var esri_imagery = new OpenLayers.Layer.XYZ( "ESRI Imagery",
            "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}",
            {sphericalMercator: true} );


var mod14_latest = new OpenLayers.Layer.WMS("MODIS Active Fires Latest",
                    "https://maps.rcmrd.org/geoserver/wms",
                    {
                        layers: "esafis:MOD14.latest",
                        transparent: true,
                        format: "image/png"
                    }, {
                           buffer: 0,
                            visibility: true,
                            displayOutsideMaxExtent: true,
                            displayInLayerSwitcher: true,
                            isBaseLayer: false,
                            yx : {'EPSG:4326' : true}
                    }
                    
                );




var maxExtent = new OpenLayers.Bounds(-20037508, -20037508, 20037508, 20037508),
restrictedExtent = maxExtent.clone();
maxResolution = 156543.0339;

var options = {
	projection: new OpenLayers.Projection("EPSG:900913"),
	displayProjection: new OpenLayers.Projection("EPSG:4326"),
	units: "m",
	numZoomLevels: 20,
	maxResolution: maxResolution,
			//maxExtent: maxExtent,
			sphericalMercator: true,
			restrictedExtent: restrictedExtent
		};

		map.addControl(new OpenLayers.Control.MousePosition
			(	{
				id:'MousePosition_id',
			
				numDigits: 6,
				prefix: '(Lon/Lat)',
				emptyString: '',
				displayProjection: "EPSG:4326"
			}
			));
		
		zoomInCtrl = new OpenLayers.Control.ZoomIn();
		map.addControl(zoomInCtrl);

		zoomOutCtrl = new OpenLayers.Control.ZoomOut();
		map.addControl(zoomOutCtrl);
		
		navigationHistoryCtrl = new OpenLayers.Control.NavigationHistory();
		map.addControl(navigationHistoryCtrl);




		var modisfire_select_style = new OpenLayers.Style({graphicYOffset: -24});
		var modisfire_default_style = new OpenLayers.Style({graphicYOffset: -24});
		
		var modisfire_style_map = new OpenLayers.StyleMap({
			'default': modisfire_default_style,
			'select': modisfire_select_style
		});
		

		//Start creating symbology rules
		var default_modisfire_low = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.LESS_THAN,
				property: "kelvin",
				value: 310
			}),
			title: "Low Intensity Fire",
			symbolizer: {				
				'pointRadius': 12,
				'cursor': "pointer",
				externalGraphic: "assets/images/markers/low.png"
			}
		});


		//Start creating symbology rules
		var selected_modisfire_low = new OpenLayers.Rule({
			title: "Low Intensity Fire",
			symbolizer: {				
				'pointRadius': 14,
				'cursor': "pointer"
			}
		});

		//Start creating symbology rules
		var default_modisfire_medium = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.BETWEEN,
				property: "kelvin",
				lowerBoundary:310.1,
				upperBoundary:340.9
			}),
			title: "Medium Intensity Fire",
			symbolizer: {				
				'pointRadius': 12,
				'cursor': "pointer",
				externalGraphic: "assets/images/markers/medium.png"
			}
		});


		//Start creating symbology rules
		var selected_modisfire_medium = new OpenLayers.Rule({
			title: "Medium Intensity Fire",
			symbolizer: {				
				'pointRadius': 14,
				'cursor': "pointer"
			}
		});
		//Start creating symbology rules
		var default_modisfire_high = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.BETWEEN,
				property: "kelvin",
				lowerBoundary:341.0,
				upperBoundary:360.9

			}),
			title: "High Intensity Fire",
			symbolizer: {				
				'pointRadius': 12,
				'cursor': "pointer",
				externalGraphic: "assets/images/markers/high.png"
			}
		});


		//Start creating symbology rules
		var selected_modisfire_high = new OpenLayers.Rule({
			title: "High Intensity Fire",
			symbolizer: {				
				'pointRadius': 14,
				'cursor': "pointer"			
			}
		});
		//Start creating symbology rules
		var default_modisfire_extreme = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.GREATER_THAN,
				property: "kelvin",
				value: 361.0
			}),
			title: "Extreme Intensity Fire",
			symbolizer: {				
				'pointRadius': 12,
				'cursor': "pointer",
				externalGraphic: "assets/images/markers/extreme.png"
			}
		});


		//Start creating symbology rules
		var selected_modisfire_extreme = new OpenLayers.Rule({
			title: "Extreme Intensity Fire",
			symbolizer: {				
				'pointRadius': 14,
				'cursor': "pointer"
			}
		});		
		modisfire_default_style.addRules([default_modisfire_low, default_modisfire_medium, default_modisfire_high, default_modisfire_extreme]);		
		modisfire_select_style.addRules([selected_modisfire_low, selected_modisfire_medium, selected_modisfire_high, selected_modisfire_extreme]);

//Style for conservation areas
var conservation_areas_select_style = new OpenLayers.Style({});
var conservation_areas_default_style = new OpenLayers.Style({});

var conservation_areas_style_map = new OpenLayers.StyleMap({
	'default': conservation_areas_default_style,
	'select': conservation_areas_select_style
});

var conservation_areas_default = new OpenLayers.Rule ({
	title: "Conservation Area",
	symbolizer: {
		"Polygon": {
			
			'labelYOffset':10,
			'labelOutlineColor':'white',
			'fillColor': 'rgb(102, 255, 102)', 
			'fillOpacity': 0.4, 
			'strokeColor': '#379331', 
			'strokeWidth': 0.5, 
			'cursor': 'pointer', 
			'fontColor': '#000', 
			'fontWeight': 'bold'
		}
	}
});

var conservation_areas_select = new OpenLayers.Rule	({
	title: "Conservation Area",
	symbolizer: {
		"Polygon": {
			'fillColor': '#66FF66', 
						'label' : '${name} '+'${designate}',
						'labelYOffset':10,
						'labelOutlineColor':'white',
						'fillOpacity': 0.8, 
						'strokeColor': '#30592E', 
						'strokeWidth': 0.5
					}
				}
			});	

conservation_areas_default_style.addRules([conservation_areas_default]);		
conservation_areas_select_style.addRules([conservation_areas_select]);

conservation_areas_layer = new OpenLayers.Layer.Vector( "Conservation Areas", {
	isBaseLayer: false, displayInLayerSwitcher: true, visibility: false,
	projection:  new OpenLayers.Projection('EPSG:4326'),
	styleMap: conservation_areas_style_map,
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP ({
						//url:  "data/webmapping/select_borehole_data.php",
						url:  "data/webmapping/getPark.php",
						//url:  "data/webmapping/borehole_results.json",		
						format: new OpenLayers.Format.GeoJSON
						({
							extractStyles: true,
							extractAttributes: true
						})
					})	
});

range_search_heatmap = new OpenLayers.Layer.Vector( "Heat", 
{
	isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, 
	projection:  new OpenLayers.Projection('EPSG:4326'),
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP
	({
				//url:"data/webmapping/mangrove2.json",
				format: new OpenLayers.Format.GeoJSON
				({
					extractStyles: true,
					extractAttributes: true
				})
			})		
});
custom_search_heatmap = new OpenLayers.Layer.Vector( "Heat", 
{
	isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, 
	projection:  new OpenLayers.Projection('EPSG:4326'),
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP
	({
				//url:"data/webmapping/mangrove2.json",
				format: new OpenLayers.Format.GeoJSON
				({
					extractStyles: true,
					extractAttributes: true
				})
			})		
});

latest_fire_layer = new OpenLayers.Layer.Vector( "MODIS Active Fires 24hrs", {
	isBaseLayer: false, displayInLayerSwitcher: true, visibility: true,
	projection:  new OpenLayers.Projection('EPSG:4326'),
	styleMap:modisfire_style_map,
	 // style: {
  //       graphicWidth: 21, 
  //       graphicHeight: 25,
  //       graphicYOffset: -24
  //   },	
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP
	({
						//url:  "data/webmapping/select_borehole_data.php",
						url:  "http://horn.rcmrd.org/latest/",
						//url:  "data/webmapping/borehole_results.json",		
						format: new OpenLayers.Format.GeoJSON
						({
							extractStyles: true,
							extractAttributes: true
						})
					})	
});



last_48hr_fire_layer = new OpenLayers.Layer.Vector( "MODIS Active Fires 48hrs", {
	isBaseLayer: false, displayInLayerSwitcher: true, visibility: false,
	projection:  new OpenLayers.Projection('EPSG:4326'),
	styleMap: modisfire_style_map, 
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP
	({
						//url:  "data/webmapping/select_borehole_data.php",
						url:  "http://horn.rcmrd.org/twodays/",
						//url:  "data/webmapping/borehole_results.json",		
						format: new OpenLayers.Format.GeoJSON
						({
							extractStyles: true,
							extractAttributes: true
						})
					})	
});

single_search_fire_layer = new OpenLayers.Layer.Vector( "Single", 
{
	isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, 
	projection:  new OpenLayers.Projection('EPSG:4326'),
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP
	({
				//url:"data/webmapping/mangrove2.json",
				format: new OpenLayers.Format.GeoJSON
				({
					extractStyles: true,
					extractAttributes: true
				})
			})		
});
range_search_fire_layer = new OpenLayers.Layer.Vector( "Range", 
{
	isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, 
	projection:  new OpenLayers.Projection('EPSG:4326'),
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP
	({
				//url:"data/webmapping/mangrove2.json",
				format: new OpenLayers.Format.GeoJSON
				({
					extractStyles: true,
					extractAttributes: true
				})
			})		
});

custom_search_fire_layer = new OpenLayers.Layer.Vector( "Custom", 
{
	isBaseLayer: false, displayInLayerSwitcher: false, visibility: false, 
	projection:  new OpenLayers.Projection('EPSG:4326'),
	strategies: [new OpenLayers.Strategy.Fixed()],
	protocol: new OpenLayers.Protocol.HTTP
	({
				//url:"data/webmapping/mangrove2.json",
				format: new OpenLayers.Format.GeoJSON
				({
					extractStyles: true,
					extractAttributes: true
				})
			})		
}); 

//When there is internet use this
map.addLayers([esri_imagery, conservation_areas_layer, range_search_heatmap, custom_search_heatmap,
				latest_fire_layer, last_48hr_fire_layer, single_search_fire_layer, range_search_fire_layer, custom_search_fire_layer, mod14_latest]);
//No Internet
//map.addLayers([latest_fire_layer, africa_outline]);
//map.addLayers([africa_outline, conservation_areas_layer, major_settlements_layer,range_search_heatmap, custom_search_heatmap,
//				latest_fire_layer, last_48hr_fire_layer, single_search_fire_layer, range_search_fire_layer, custom_search_fire_layer]);

conservation_areas_layer.setZIndex( 10 ); 
range_search_heatmap.setZIndex( 12 ); 
custom_search_heatmap.setZIndex( 12 ); 

latest_fire_layer.setZIndex( 1622 ); 
last_48hr_fire_layer.setZIndex( 1622 ); 
single_search_fire_layer.setZIndex( 1622 ); 
range_search_fire_layer.setZIndex( 1622 ); 
custom_search_fire_layer.setZIndex( 1622 ); 

//range_search_heatmap.set("hideInLegend", true);
//range_search_heatmap.set("hideInLegend", !range_search_heatmap.get("hideInLegend"));



		
		map.setCenter(new OpenLayers.LonLat(29.577899,3.443310).transform(
			new OpenLayers.Projection("EPSG:4326"),
			map.getProjectionObject()
			), 5 );

		Ext.require([
			'GeoExt.panel.Map',
			'GeoExt.window.Popup'
			]);

//Add comma on every 000 thausand
function numberWithCommas(x) {
	if(null!==x){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");	
	}
}

//If popup value is null or undefined, turn to None
function nulltoNone(x){
	if( (null==x) || (typeof x === 'undefined') ){
		return 'None'; 
	}
	else {
		return x; 
	}
}

    // define "createPopup" function . This function loops through each marker properties to show on the popup
    function createPopup(feature) {
		date_time=feature.attributes.date_time; 
       	var details = '<div class="popup_output">';
	    	details += '<div class="popup_title">Fire Details</div>'; 
			details += '<table  class="popup_fire_detail_table" height="123">'+
				  '<tr>'+
				    '<td  class="columnA_title" width="84"><strong>Fire ID:</strong></td>'+
				    '<td  class="columnA_content" width="55">'+feature.attributes.fire_id+'</td>'+
				    '<td class="columnB_title" width="78"><strong>Kelvin: </strong></td>'+
				    '<td class="columnB_content" width="53">'+feature.attributes.kelvin+'</td>'+
				  '</tr>'+
				  '<tr>'+
				    '<td class="columnA_title" ><strong>Longitude:</strong></td>'+
				    '<td class="columnA_content" >'+feature.attributes.longitude+'</td>'+
				    '<td class="columnB_title" rowspan="3"><strong>Captured Date & Time (Local): </strong></td>'+
				    '<td class="columnB_content" rowspan="3">'+formatdate(date_time)+'</td>'+
				  '</tr>'+
				  '<tr>'+
				    '<td class="columnA_title" ><strong>Latitude:</strong></td>'+
				    '<td class="columnA_content" >'+feature.attributes.latitude+'</td>'+
				    ''+
				    ''+
				  '</tr>'+
				  '<tr>'+
				    '<td class="columnA_title"  height="23"><strong>Confidence: </strong></td>'+
				    '<td class="columnA_content" >'+feature.attributes.confidence+'%</td>'+
				    ''+
				    ''+
				  '</tr>'+
				'</table>';
	    	details += '<div class="popup_title risks">Fire Risks</div>'
	    	details += '<div class="risks_content">'		
	    	details += '<strong>Affected Conservation Area: </strong>'+nulltoNone(feature.attributes.affected_conservation_area);
	    	details += '<br><strong>Nearby Conservation Area & Distance (Within 50 Kms): </strong>'+nulltoNone(feature.attributes.nearby_conservation_area);
	    	details += '<br><strong>Nearby Towns & Distance (Within 50 Kms): </strong>'+nulltoNone(feature.attributes.nearby_towns);
	    	details += '</div>'
	    	details += '</div>';
	 popup = new GeoExt.Popup({
	 	title: 'Information',
	 	location: feature,
	 	width: 300,
	 	cls:'popup_cls',
	 	bodyPadding:'6px',
	 	bodyStyle:'background:rgba(228, 225, 213, 0.83);',
	 	html: details,
	 	maximizable: true,
	 	collapsible: true,
	 	anchored: true,
          //  unpinnable: false,
        moveable: true,
        animCollapse: true,
        shadow: true
      });
        // unselect feature when the popup
        // is closed
        popup.on({
        	close: function () {
        		if (OpenLayers.Util.indexOf(latest_fire_layer.selectedFeatures, this.feature) > -1 || 
        			OpenLayers.Util.indexOf(last_48hr_fire_layer.selectedFeatures, this.feature) > -1) {
        			select_modisfire_layer.unselect(latest_fire_layer.selectedFeatures.feature);
        		select__last48h_modisfire_layer.unselect(last_48hr_fire_layer.selectedFeatures.feature);
        	}
        }
    });
        popup.show();
    };
    var highlight_conservation_area_layer = new OpenLayers.Control.SelectFeature(
    	conservation_areas_layer,
			{
            hover: true,
            highlightOnly: true,
            renderIntent: "temporary",
   		}
    );

	var select_conservation_area_layer = new OpenLayers.Control.SelectFeature(conservation_areas_layer,
                {clickout: true}
            );

    map.addControl(highlight_conservation_area_layer);
    map.addControl(select_conservation_area_layer);

    highlight_conservation_area_layer.activate();
    select_conservation_area_layer.activate();

    // create popup on "featureselected"
    latest_fire_layer.events.on({
    	featureselected: function (e) {
    		createPopup(e.feature);
    	},
    	'featuresadded':function(){
    		date_string=latest_fire_layer.features[0].data.date_time; 
        	latest_fire_layer.setName('Latest Fire Points - '+formatdate(date_string) ); 
        	//Insert text on the status bar. 
        	Ext.getCmp('statusbar_content_id').update('The latest data in our system was captured on '+formatdate(date_string));
        	
    	}
		
    });

    last_48hr_fire_layer.events.on({
    	featureselected: function (e) {
    		createPopup(e.feature);
    	}
    });

    var select_modisfire_layer = new OpenLayers.Control.SelectFeature(
    	latest_fire_layer, {clickout: true}
    	);
    map.addControl(select_modisfire_layer);
    select_modisfire_layer.activate();

    var select__last48h_modisfire_layer = new OpenLayers.Control.SelectFeature(
    	last_48hr_fire_layer,  {clickout: true}
    	);
    map.addControl(select__last48h_modisfire_layer);
    select__last48h_modisfire_layer.activate();


    Ext.apply(me, 
    {
    	map: map

    });


    me.callParent(arguments);
}
});
