Ext.define('eafire.view.WebMapping.BoreholeGridPanel', 
{
    extend: 'Ext.grid.Panel',
    alias: 'widget.BoreholeGridPanel',
	id:'BoreholeGridPanelId',
	store: 'WebMapping.BoreholeData',
	layout:'fit',
	selType: 'featuremodel',
	loadMask: true,
	autoScroll:true,
	height: 180,
    initComponent: function() 
    {
		this.columns = 
		[
			{xtype: 'rownumberer'},
			{menuDisabled: true, sortable: false, width: 30, xtype: 'gx_symbolizercolumn', dataIndex: "symbolizer"},
			{header: 'Borehole Local Name',  dataIndex: 'borehole_local_name',  width:150},
			{header: 'Nearest Settlement',  dataIndex: 'nearest_settlement',  width:120},
			{header: 'Division',  dataIndex: 'division',  width:100},
			{header: 'Type of Use',  dataIndex: 'type_of_use',  width:150},
			{header: 'Date Installed', xtype: 'datecolumn', dataIndex: 'date_installed', format: 'd-M-Y'},	
			{header: 'Current Status',  dataIndex: 'current_status',  width:100},
			{header: 'Inspecting Agency',  dataIndex: 'inspecting_agency',  width:120},
			{xtype: 'numbercolumn', header: 'Latitude',  dataIndex: 'latitude',  width:100, format:'0.000000' },
			{xtype: 'numbercolumn', header: 'Longitude',  dataIndex: 'longitude',  width:100, format:'0.000000'}
		];

	this.callParent(arguments);
	eafire.view.WebMapping.BoreholeGridPanel.selectionModel = this.getSelectionModel();
    }  
});