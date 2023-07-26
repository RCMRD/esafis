Ext.define('coastaleco.store.WebMapping.BoreholeChartPanelStore', 
{
    extend: 'Ext.data.Store',
	model: 'coastaleco.model.WebMapping.BoreholeChartPanelModel',
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