Ext.require([
    'GeoExt.panel.Map',
    'GeoExt.data.FeatureStore',
    'GeoExt.grid.column.Symbolizer',
    'GeoExt.selection.FeatureModel',
    'Ext.tree.plugin.TreeViewDragDrop',
    //'GeoExt.panel.Map',
    'GeoExt.tree.OverlayLayerContainer',
    'GeoExt.tree.BaseLayerContainer',
    'GeoExt.data.LayerTreeModel',
    'GeoExt.tree.View',
    'GeoExt.tree.Column',
	'Ext.util.Point',
	'GeoExt.container.VectorLegend',
	'GeoExt.window.Popup',
	'GeoExt.panel.Legend', 


    //'GeoExt.container.WmsLegend',
    //'GeoExt.container.UrlLegend',

]);

var map,africa_outline;
var LayerLegend, WestPanel, statusbar;
var zoomInCtrl, zoomOutCtrl, navigationHistoryCtrl;
var layer_legend_tree, layers_tree_store, conservation_area_store, 
    towns_store, latest_fire_layer, custom_search_fire_layer, 
    range_search_fire_layer, single_search_fire_layer, range_search_heatmap, custom_search_heatmap;
//var apiKey = "AtFFb9kcfL5tn_1VGMNC_N8Q3Z6tZaoQhWuJFhekSQmJRE2zUt3ik5XbHZWO721l";
Ext.define('eafire.controller.WebMapping.MapPanel', 
{
	extend: 'Ext.app.Controller',	
	views: 	['WebMapping.MapPanel','WebMapping.GeoExtMapPanel','WebMapping.MainToolbar' ],
	controllers: ['WebMapping.ButonOnclickActions'],
   // stores: [],
    initComponent: function() 
	{

	}
});
