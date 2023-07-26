Ext.define('eafire.store.WebMapping.DivisionsStore', 
{
    extend: 'Ext.data.Store',
	model: 'eafire.model.WebMapping.DivisionsModel',
	autoLoad: true,
    proxy: 
	{
		type: 'ajax',
		reader: 
		{ 
			type: 'json', 
			root:'data'
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