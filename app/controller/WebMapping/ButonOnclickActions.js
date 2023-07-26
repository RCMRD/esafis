//converts UTC date to local time. 
function formatdate(stringval) {
	stringvalUTC = stringval + ' UTC';
  var newstr = stringvalUTC.replace(/-/g, '/');
    var converted = new Date(newstr);
    var d = converted;
    //alert (d);
    function addZero(n) {
        return n < 10 ? '0' + n : '' + n;
    }
  Number.prototype.padLeft = function(base,chr){
     var  len = (String(base || 10).length - String(this).length)+1;
     return len > 0? new Array(len).join(chr || '0')+this : this;
  }
  
  
  return [ d.getFullYear(),(d.getMonth()+1).padLeft(),
                    d.getDate().padLeft()].join('-')+
                    ' ' +
                  [ d.getHours().padLeft(),
                    d.getMinutes().padLeft(),
                    d.getSeconds().padLeft()].join(':');//return dateToPrint; 

}
//Resizes Legend panel based on screen size. 
function resizeElementHeight(parent, child) {
    var parent = document.getElementById(parent);
    var child = document.getElementById(child);
    var stylecont = document.createElement('div');
    var height = 0;
    var body = window.document.body;
   // if (window.innerHeight) {
        height = window.innerHeight;
        //alert (height);
        parentheight = ((height - 414) + "px");
        childheight = ((height - 454) + "px");
        stylecont.innerHTML = '<style>#legend_items{ height:'+parentheight+';}'+
        	'#legend_items-body{ height:'+childheight+';}'+'</style>';

    //} 
      return stylecont.innerHTML; 
}


custom_search_fire_layer = new OpenLayers.Layer.Vector(); 
range_search_fire_layer = new OpenLayers.Layer.Vector(); 
single_search_fire_layer = new OpenLayers.Layer.Vector(); 
latest_fire_layer = new OpenLayers.Layer.Vector(); 
range_search_heatmap = new OpenLayers.Layer.Vector(); 
custom_search_heatmap =  new OpenLayers.Layer.Vector(); 
var modisfire_single_search_select_style = new OpenLayers.Style({graphicYOffset: -24});
var modisfire_single_search_default_style = new OpenLayers.Style({graphicYOffset: -24});

var modisfire_single_search_style_map = new OpenLayers.StyleMap({
	'default': modisfire_single_search_default_style,
	'select': modisfire_single_search_select_style
});



		//Start creating symbology rules
		var default_modisfire_single_search_low = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.LESS_THAN,
				property: "kelvin",
				value: 310
			}),
			title: "Low Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity': 0.6,
					'fillColor': "#FCC978",
					'pointRadius': 5,
					'strokeWidth': 0,
					'strokeOpacity': 0,
					//'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});


		//Start creating symbology rules
		var selected_modisfire_single_search_low = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.LESS_THAN,
				property: "kelvin",
				value: 310
			}),
			title: "Low Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity': 1,
					'fillColor': "#FCC978",
					'pointRadius': 5,
					'strokeWidth': 0.5,
					'strokeOpacity': 1,
					'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});

		//Start creating symbology rules
		var default_modisfire_single_search_medium = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.BETWEEN,
				property: "kelvin",
				lowerBoundary:311.0,
				upperBoundary:340.999
			}),
			title: "Medium Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity': 0.6,
					'fillColor': "#F28E20",
					'pointRadius': 5,
					'strokeWidth': 0,
					'strokeOpacity': 0,
					//'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});


		//Start creating symbology rules
		var selected_modisfire_single_search_medium = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.BETWEEN,
				property: "kelvin",
				lowerBoundary:321.0,
				upperBoundary:340.999

			}),
			title: "Medium Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity': 1,
					'fillColor': "#F28E20",
					'pointRadius': 5,
					'strokeWidth': 0.5,
					'strokeOpacity': 1,
					'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});
		//Start creating symbology rules #F28E20
		var default_modisfire_single_search_high = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.BETWEEN,
				property: "kelvin",
				lowerBoundary:341.0,
				upperBoundary:360.999

			}),
			title: "High Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity': 0.6,
					'fillColor': "#F45322",
					'pointRadius': 5,
					'strokeWidth': 0,
					'strokeOpacity': 0,
					//'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});


		//Start creating symbology rules
		var selected_modisfire_single_search_high = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.BETWEEN,
				property: "kelvin",
				lowerBoundary:341.0,
				upperBoundary:360.999

			}),
			title: "High Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity':1,
					'fillColor': "#F45322",
					'pointRadius': 5,
					'strokeWidth': 0.5,
					'strokeOpacity': 1,
					'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});
		//Start creating symbology rules
		var default_modisfire_single_search_extreme = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.GREATER_THAN,
				property: "kelvin",
				value: 361
			}),
			title: "Extreme Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity': 0.6,
					'fillColor': "#D92225",
					'pointRadius': 5,
					'strokeWidth': 0,
					'strokeOpacity': 0,
					//'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});


		//Start creating symbology rules
		var selected_modisfire_single_search_extreme = new OpenLayers.Rule({
			filter: new OpenLayers.Filter.Comparison({
				type:OpenLayers.Filter.Comparison.GREATER_THAN,
				property: "kelvin",
				value:  361
			}),
			title: "Extreme Intensity Fire",
			symbolizer: {
				"Point": {
					'cursor': "pointer",
					'fillOpacity':1,
					'fillColor': "#D92225",
					'pointRadius': 5,
					'strokeWidth': 0.5,
					'strokeOpacity': 1,
					'strokeColor': "#000000",
					'graphicName': "circle"					
				}
			}
		});		
		modisfire_single_search_default_style.addRules([default_modisfire_single_search_low, default_modisfire_single_search_medium, default_modisfire_single_search_high, default_modisfire_single_search_extreme]);		
		modisfire_single_search_select_style.addRules([selected_modisfire_single_search_low, selected_modisfire_single_search_medium, selected_modisfire_single_search_high, selected_modisfire_single_search_extreme]);


		Ext.define('ConservationAreaModel', {
			extend: 'Ext.data.Model',
			fields: [
			{id:'gid', name:'full_areaname'}
			]
		});
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
	if( (null==x) || (typeof x === 'undefined' ) ){
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
    function single_search() {

    	var entered_single_date_id=Ext.getCmp('single_date_search_id').getValue();
    	server_single_date_val = Ext.Date.format(entered_single_date_id, 'Y-m-d');
    	var single_conservation_area_val=Ext.getCmp('single_conservation_area_id').getRawValue();
    	var single_nearby_conservation_area_val=Ext.getCmp('single_nearby_conservation_area_id').getRawValue();
    	var single_town_val=Ext.getCmp('single_town_id').getRawValue();
    	var single_selected_country_val=Ext.getCmp('single_country_id').getValue();

    	if (entered_single_date_id==null)	{
    		Ext.Msg.alert("Search Error","Please select a date to view data.");
		//Ext.Msg.alert(flag); 
	}
	else {		

		single_search_layer_url="data/webmapping/single_fire_search.php?country="+single_selected_country_val+"&affected_conservation_area="+
		single_conservation_area_val+"&nearby_conservation_area="+single_nearby_conservation_area_val+"&nearby_town="+single_town_val+"&single_date="+server_single_date_val;
	//Ext.Msg.alert("Search Error",single_search_layer_url); 
		single_search_fire_layer = new OpenLayers.Layer.Vector( "Fire Points - "+server_single_date_val, {
			isBaseLayer: false, displayInLayerSwitcher: true, visibility: true,
			projection:  new OpenLayers.Projection('EPSG:4326'),
			styleMap: modisfire_single_search_style_map, 
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP ({
				url: single_search_layer_url,
				format: new OpenLayers.Format.GeoJSON ({
					extractStyles: true,
					extractAttributes: true
				})
			})	
		});

		map.addLayer(single_search_fire_layer);
		last_48hr_fire_layer.setVisibility(false);
		custom_search_fire_layer.setVisibility(false);
		range_search_fire_layer.setVisibility(false); 
		latest_fire_layer.setVisibility(false); 

	    // create popup on "featureselected"
	    single_search_fire_layer.events.on({
	    	featureselected: function (e) {
	    		createPopup(e.feature);
	    	}
	    });


	    var select_single_search_fire_layer = new OpenLayers.Control.SelectFeature(
	    	single_search_fire_layer, {clickout: true}
	    	);
	    map.addControl(select_single_search_fire_layer);
	    select_single_search_fire_layer.activate();
	}
}
function range_search() {

	entered_range_one_id=Ext.getCmp('range_one_id').getValue();
	entered_range_two_id=Ext.getCmp('range_two_id').getValue();

	server_range_one_val = Ext.Date.format(entered_range_one_id, 'Y-m-d');
	server_range_two_val = Ext.Date.format(entered_range_two_id, 'Y-m-d');

	var range_conservation_area_val=Ext.getCmp('range_conservation_area_id').getRawValue();
	var range_nearby_conservation_area_val=Ext.getCmp('range_nearby_conservation_area_id').getRawValue();
	var range_town_val=Ext.getCmp('range_town_id').getRawValue();
	var range_selected_country_val=Ext.getCmp('range_country_id').getValue();
	var range_search_heatmap_check_val=Ext.getCmp('range_search_heatmap_check_id').getValue();
	
	if (entered_range_one_id==null || entered_range_two_id==null) {
		Ext.Msg.alert("Search Error","Please select both date fileds to view data.");
	}
	else {

		range_search_layer_url="data/webmapping/range_fire_search.php?country="+range_selected_country_val+"&affected_conservation_area="+
		range_conservation_area_val+"&nearby_conservation_area="+range_nearby_conservation_area_val+"&nearby_town="+range_town_val+
		"&range_one="+server_range_one_val+"&range_two="+server_range_two_val;
	//Ext.Msg.alert("Search Error",range_search_layer_url); 

		range_search_fire_layer = new OpenLayers.Layer.Vector( "Fire Points - "+server_range_one_val+' to '+server_range_two_val, {
			isBaseLayer: false, displayInLayerSwitcher: true, visibility: true,
			projection:  new OpenLayers.Projection('EPSG:4326'),
			styleMap: modisfire_single_search_style_map, 
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP
			({
							//url:  "data/webmapping/select_borehole_data.php",
							url: range_search_layer_url,
							//url:  "data/webmapping/borehole_results.json",		
							format: new OpenLayers.Format.GeoJSON
							({
								extractStyles: true,
								extractAttributes: true
							})
						})	
		});
		if (range_search_heatmap_check_val=== true){
					range_search_heatmap = new OpenLayers.Layer.Vector("Fire Heatmap - "+server_range_one_val+' to '+server_range_two_val, {
						opacity: 0.5,
						visibility: true,
						// hideInLegend : true, 
						renderers: ['Heatmap'],
						rendererOptions: {
	                    weight: 'kelvin',
	                    id: 'range_search_heatmap_id', 
						// metadata: { 
						//    legend: { 
						//      hideInLegend: true
						//    } 
						// },
	                    heatmapConfig: {
	                        radius:  5, 
	                        legend: {
			                    position: 'br',
			                    title: 'Fire Brightness (Kelvin)'
			                }

	                    }
	                }
				});


				range_search_fire_layer.events.on({
				  'featuresadded': function(feature) {
					   	range_search_heatmap.addFeatures(range_search_fire_layer.features);
					   	range_search_fire_layer.setVisibility(false); 

					var legend_container = document.getElementById('legend_items-innerCt'); 
					    legend_container.getElementsByTagName('div')[0].style.display='none';	
						legend_container.getElementsByTagName('div')[1].style.display='none'; //range_search_fire_layer legend	
						legend_container.getElementsByTagName('div')[2].style.display='none';			
						legend_container.getElementsByTagName('div')[4].style.display='none'; //range_search_heatmap legend	
						//legend_container.getElementsByTagName('div')[5].style.display='none';						
					   	Ext.get('legend_items-innerCt').insertFirst(Ext.get('heatmap_legend').show()); //adds heatmap legend in symbology


				  }

				});
				//map.removeLayer(range_search_fire_layer);
				map.addLayer(range_search_heatmap);
		}

		map.addLayer(range_search_fire_layer);
		last_48hr_fire_layer.setVisibility(false);
		custom_search_fire_layer.setVisibility(false);
		single_search_fire_layer.setVisibility(false); 
		latest_fire_layer.setVisibility(false); 
		


	    // create popup on "featureselected"
	    range_search_fire_layer.events.on({
	    	featureselected: function (e) {
	    		createPopup(e.feature);
	    	}
	    });


	    var select_range_search_fire_layer = new OpenLayers.Control.SelectFeature(
	    	range_search_fire_layer, {clickout: true}
	    	);
	    map.addControl(select_range_search_fire_layer);
	    select_range_search_fire_layer.activate();



	}
}

function zeroPad(num, places) {
	var zero = places - num.toString().length + 1;
	return Array(+(zero > 0 && zero)).join("0") + num;
}
function custom_search() {
	//var entered_custom_date_val,entered_custom_month_val, entered_custom_year_val;
	entered_custom_date_val=Ext.getCmp('custom_date_id').getValue();
	entered_custom_year_val=Ext.getCmp('custom_year_id').getValue();
	entered_custom_month_val=Ext.getCmp('custom_month_id').getValue();
	var custom_conservation_area_val=Ext.getCmp('custom_conservation_area_id').getRawValue();
	var custom_nearby_conservation_area_val=Ext.getCmp('custom_nearby_conservation_area_id').getRawValue();
	var custom_town_val=Ext.getCmp('custom_town_id').getRawValue();
	var custom_selected_country_val=Ext.getCmp('custom_country_id').getValue();
	var custom_search_heatmap_check_val=Ext.getCmp('custom_search_heatmap_check_id').getValue();

	if (Ext.getCmp('custom_date_id').getValue()!==null)
		{entered_custom_date_val=zeroPad(Ext.getCmp('custom_date_id').getValue(), 2);}
	if (Ext.getCmp('custom_month_id').getValue()!==null)
		{entered_custom_month_val=zeroPad(Ext.getCmp('custom_month_id').getValue(), 2);}
	if (Ext.getCmp('custom_year_id').getValue()!==null)
		{entered_custom_year_val=zeroPad(Ext.getCmp('custom_year_id').getValue(), 2);}

	if ((entered_custom_date_val==null) && (entered_custom_month_val==null) &&  (entered_custom_year_val==null)) {
		Ext.Msg.alert("Search Error","Please select at least one date filed to view data.");
	}
	else {
		custom_search_layer_url="data/webmapping/custom_fire_search.php?country="+custom_selected_country_val+"&affected_conservation_area="+custom_conservation_area_val+"&nearby_conservation_area="+custom_nearby_conservation_area_val+"&nearby_town="+custom_town_val+"&custom_year="+entered_custom_year_val+"&custom_month="+entered_custom_month_val+"&custom_date="+entered_custom_date_val;
//Ext.Msg.alert("Search Error",custom_search_layer_url);

		custom_search_fire_layer = new OpenLayers.Layer.Vector( "Fire Points - Custom", {
			isBaseLayer: false, displayInLayerSwitcher: true, visibility: true,
			projection:  new OpenLayers.Projection('EPSG:4326'),
			styleMap: modisfire_single_search_style_map, 
			strategies: [new OpenLayers.Strategy.Fixed()],
			protocol: new OpenLayers.Protocol.HTTP
			({
								//url:  "data/webmapping/select_borehole_data.php",
								url: custom_search_layer_url,
								//url:  "data/webmapping/borehole_results.json",		
								format: new OpenLayers.Format.GeoJSON
								({
									extractStyles: true,
									extractAttributes: true
								})
							})	
		});
		if (custom_search_heatmap_check_val=== true){
				custom_search_heatmap = new OpenLayers.Layer.Vector("Fire Heatmap - Custom", {
					opacity: 0.5,
					visibility: true,
					renderers: ['Heatmap'],
					rendererOptions: {
                    weight: 'kelvin',
                    heatmapConfig: {
                        radius:  8,
                    	legend: {
		                    position: 'br',
		                    title: 'Fire Brightness (Kelvin)'
		                }
                    }
                }
				});

				custom_search_fire_layer.events.on({
				  'featuresadded': function(feature) {
					   custom_search_heatmap.addFeatures(custom_search_fire_layer.features);
					   custom_search_fire_layer.setVisibility(false)
				  }
				});
				map.addLayer(custom_search_heatmap);
		}



		map.addLayer(custom_search_fire_layer);	
		range_search_fire_layer.setVisibility(false);
		single_search_fire_layer.setVisibility(false); 
		latest_fire_layer.setVisibility(false); 


	    // create popup on "featureselected"
	    custom_search_fire_layer.events.on({
	    	featureselected: function (e) {
	    		createPopup(e.feature);
	    	}
	    });


	    var select_custom_search_fire_layer = new OpenLayers.Control.SelectFeature(
	    	custom_search_fire_layer, {clickout: true}
	    	);
	    map.addControl(select_custom_search_fire_layer);
	    select_custom_search_fire_layer.activate();



	}
}

Ext.define('eafire.controller.WebMapping.ButonOnclickActions', {
	extend: 'Ext.app.Controller',
	
	//stores:	['WebMapping.EcoChartPanelStore'],
	//views: 	['WebMapping.EcoChartPanel'],
	init: function(){
		
		this.control(
		{		
			'WebMappingViewport button[action=singleSearchAction]':
			{
				click:function() {

					var loadingPanel = new OpenLayers.Control.LoadingPanel();
					map.addControl(loadingPanel);    
							//show the control
							loadingPanel.maximizeControl();
					// load your layers here
					// remove it as the above function returns
					//flag="no_flag";
					single_search();
					
					loadingPanel.minimizeControl();
					
				}
			},

			'WebMappingViewport combobox[name=single_country_name]': {
				select:function() {
					single_country_value=Ext.getCmp('single_country_id').getValue(); 

					conservation_area_store.load({params: {country: single_country_value}});
					towns_store.load({params: {country: single_country_value}});

					conservation_area_combo=Ext.getCmp('single_conservation_area_id');
					nearby_conservation_area_combo=Ext.getCmp('single_nearby_conservation_area_id');						
					single_town_combo=Ext.getCmp('single_town_id');

					if (single_country_value!=='')  {
						conservation_area_combo.enable(); 
						nearby_conservation_area_combo.enable();                             
						single_town_combo.enable();      

					}
					
				}
			},

			'WebMappingViewport combobox[name=range_country_name]': {
				select:function() {
					range_country_value=Ext.getCmp('range_country_id').getValue(); 

					conservation_area_store.load({params: {country: range_country_value}});
					towns_store.load({params: {country: range_country_value}});

					conservation_area_combo=Ext.getCmp('range_conservation_area_id');
					nearby_conservation_area_combo=Ext.getCmp('range_nearby_conservation_area_id');                        
					range_town_combo=Ext.getCmp('range_town_id');

					if (range_country_value!=='')  {
						conservation_area_combo.enable(); 
						nearby_conservation_area_combo.enable();                             
						range_town_combo.enable();      

					}
					
				}
			},   
			'WebMappingViewport combobox[name=custom_country_name]': {
				select:function() {
					custom_country_value=Ext.getCmp('custom_country_id').getValue(); 

					conservation_area_store.load({params: {country: custom_country_value}});
					towns_store.load({params: {country: custom_country_value}});

					conservation_area_combo=Ext.getCmp('custom_conservation_area_id');
					nearby_conservation_area_combo=Ext.getCmp('custom_nearby_conservation_area_id');                        
					custom_town_combo=Ext.getCmp('custom_town_id');

					if (custom_country_value!=='')  {
						conservation_area_combo.enable(); 
						nearby_conservation_area_combo.enable();                             
						custom_town_combo.enable();      

					}
					
				}
			}, 
			'WebMappingViewport combobox[name=subscribe_country_name]': {
				select:function() {
					subscribe_country_value=Ext.getCmp('subscribe_country_id').getValue(); 

					conservation_area_store.load({params: {country: subscribe_country_value}});
					towns_store.load({params: {country: subscribe_country_value}});

					subscribe_conservation_area_combo=Ext.getCmp('subscribe_conservation_area_id');                       
					subscribe_country_check=Ext.getCmp('subscribe_country_check_id');

					if (subscribe_country_value!=='')  {
						subscribe_conservation_area_combo.enable();                           
						subscribe_country_check.enable();      

					}
					
				}
			},  			

			'WebMappingViewport button[action=rangeSearchAction]':
			{
				click: function() 
				{

					var loadingPanel = new OpenLayers.Control.LoadingPanel();
					map.addControl(loadingPanel);    
					//show the control
					loadingPanel.maximizeControl();
					// load your layers here
					// remove it as the above function returns

					range_search();

					loadingPanel.minimizeControl();

		 			resizeElementHeight('legend_items', 'legend_items-body');
				}
			},
			'WebMappingViewport button[action=customSearchAction]':
			{
				click: function() 
				{

					var loadingPanel = new OpenLayers.Control.LoadingPanel();
					map.addControl(loadingPanel);    
					//show the control
					loadingPanel.maximizeControl();
					// load your layers here
					// remove it as the above function returns
					
					//flag="no_flag";
					custom_search();

					loadingPanel.minimizeControl();
					
				}
			},
			'MapPanel button[action=map_zoom_in]':
			{
				click:function()
				{	
					zoomInCtrl.trigger();
				}
			},
			'MapPanel button[action=map_zoom_out]':
			{
				click:function()
				{	
					zoomOutCtrl.trigger();
				}
			},
			'MapPanel button[action=navigation_history_previous]':
			{
				click:function()
				{	
					navigationHistoryCtrl.previousTrigger();
				}
			},
			'MapPanel button[action=navigation_history_next]':
			{
				click:function()
				{	
					navigationHistoryCtrl.nextTrigger();
				}
			},
			'MapPanel button[action=about_us]':
			{
				click: function ()
				{
					var win = new Ext.Window
					({
						width:500,
						height:500,
						autoScroll:true,
						title: 'About the System',
						autoLoad:{
							url:'pages/about_us.html'
						}
					});
					win.show();
				}
			},
			'MapPanel button[action=useful_links]':
			{
				click: function ()
				{
					
					var win = new Ext.Window({
						width:270,
						height:130,
						autoScroll:true,
						title: 'Useful Links',
						autoLoad:{
							url:'pages/useful_links.html'
						}
					});
					win.show();
				}
			},
			'MapPanel button[action=help_action]':
			{
				click: function ()
				{
					var win = new Ext.Window
					({
						width:500,
						height:500,
						autoScroll:true,
						title: 'Help',
						autoLoad:{
							url:'pages/help.html'
						}
					});
					win.show();
				}
			},
			'MapPanel button[action=map_default_map_extent]':
			{
				click: function() 
				{
					map.setCenter(
						new OpenLayers.LonLat(29.577899,3.443310).transform(
							new OpenLayers.Projection("EPSG:4326"),
							map.getProjectionObject()
							), 
						5);
				}
			},

			'MapPanel button[action=zoom_to_countries]':
			{
				click: function() 
				{
					var selected_country=Ext.getCmp('Zoom_to_Countries_Id').getValue();
					if(selected_country==null)
					{
						Ext.Msg.alert("No selection","Please select a country you want to Zoom to");
					}
					else if(selected_country=="All Countries")
					{
						map.setCenter(
							new OpenLayers.LonLat(29.577899,3.443310).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							5);
					}	
					else if(selected_country=="Burundi")
					{
						map.setCenter(
							new OpenLayers.LonLat(29.90, -3.5).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							9);
					}
					else if(selected_country=="Djibouti")
					{
						map.setCenter(
							new OpenLayers.LonLat(42.61, 11.77).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							9);
					}
					else if(selected_country=="Eritrea")
					{
						map.setCenter(
							new OpenLayers.LonLat(39.59, 14.84).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							7);
					}
					else if(selected_country=="Ethiopia")
					{
						map.setCenter(
							new OpenLayers.LonLat(38.58, 8.98).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							6);
					}

					else if(selected_country=="Kenya")
					{
						map.setCenter(
							new OpenLayers.LonLat(38.224663, 0.009370).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							7);
					}
					else if(selected_country=="Rwanda")
					{
						map.setCenter(
							new OpenLayers.LonLat(29.99, -1.9370).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							9);
					}
					else if(selected_country=="Somalia")
					{
						map.setCenter(
							new OpenLayers.LonLat(46.76, 5.5).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							6);
					}

					else if(selected_country=="Sudan")
					{
						map.setCenter(
							new OpenLayers.LonLat(29.75,15.98).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							6);
					}
					else if(selected_country=="South Sudan")
					{
						map.setCenter(
							new OpenLayers.LonLat(29.44, 7.84).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							7);
					}
					else if(selected_country=="Tanzania")
					{
						map.setCenter(
							new OpenLayers.LonLat(34.77, -6.32).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							6);
					}
					else if(selected_country=="Uganda")
					{
						map.setCenter(
							new OpenLayers.LonLat(32.71, 1.23).transform(
								new OpenLayers.Projection("EPSG:4326"),
								map.getProjectionObject() ), 
							7);
					}

				}
				
			}

		});
	}

});