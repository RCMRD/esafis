Ext.define('eafire.view.WebMapping.EcoSearchForm', 
{
    extend: 'Ext.form.Panel',
    alias: 'widget.EcoSearchForm',
    bodyPadding: 2,
    id:'EcoSearchForm_id',
	minWidth:250, 
	height: 150,
	layout:'anchor',
    title: 'Search Ecosystem',
    collapsible:true,
	frame: true,
	labelWidth: 25, 
	items:
	[
		{
			xtype: 'combobox',
			fieldLabel: 'Ecosystem',
			allowBlank: true,
			emptyText:'Select Ecosystem',
			minWidth: 150,
			margin: "10 0 0 0",
			id:  'ecosystem_id',
			name:  'ecosystem_name',
			queryMode: 'local',
			displayField: 'ecosystem',
			//store: 'WebMapping.DivisionsStore',
			store:["Mangroves", "Seagrass"],
			typeAhead: true,
			lastQuery:'',
			triggerAction: 'all',
			//value: 'Hadado',
			selectOnFocus:true
		},	
		{
			xtype: 'combobox',
			fieldLabel: 'Countries',
			allowBlank: true,
			minWidth: 150,
			margin: "10 0 0 0",
			id:  'countries_id',
			emptyText:'Select Countries',
			typeAhead: true,
			store : [
						"All Countries", "Kenya", "Tanzania", "Mozambique", "Madagascar"
					]
		}
		
		/*{
			xtype: 'combobox',
			fieldLabel: 'Statistics',
			allowBlank: true,
			width: 235,
			margin: "10 0 0 0",
			id:  'stat_id',
			emptyText:'Select Statistics',
			typeAhead: true,
			store : [
						"All Statistics", "Area", "Percentage"
					]			
		}*/
	],	
	buttons:
	[
	{
			text: 'Statistics',
			width: 50,
			action: 'SearchEco_Stat'
		},
		{
			text: 'Search',
			width: 50,
			action: 'SearchEco'
		}, 
		

	]

});
