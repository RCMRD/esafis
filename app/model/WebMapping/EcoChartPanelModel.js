Ext.define('eafire.model.WebMapping.EcoChartPanelModel', 
{
    extend: 'Ext.data.Model',
    fields: 
	[
		{
			name: 'division',
            type: 'string'
		},
		{		
			name: 'total',
            type: 'numeric'
        }
    ],
	autoDestroy: true	
});
