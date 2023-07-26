Ext.define('eafire.store.WebMapping.EcoChartPanelStore', 
{
    extend: 'Ext.data.Store',
	model: 'eafire.model.WebMapping.EcoChartPanelModel',
	autoLoad: true,
    proxy: 
	{
		type: 'ajax',
		reader: 
		{ 
			type: 'json', 
			root:'boreholes'
		},
		actionMethods: 
		{
			read: 'GET'
		},
        api: 
		{
			read:'data/webmapping/test.php'
		}
    }
});