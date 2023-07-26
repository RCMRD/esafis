Ext.define('eafire.model.WebMapping.BoreholeData', 
{
    extend: 'Ext.data.Model',
    fields: 
	[
        {
            name: 'borehole_local_name',
            type: 'string'
        },
        {
            name: 'nearest_settlement',
            type: 'string'
        },
		{
            name: 'division',
            type: 'string'
        },
		{
            name: 'type_of_use',
            type: 'string'
        },
		{
            name: 'date_installed',
            type: 'date',
			dateFormat: 'c'
        },
		{
            name: 'current_status',
            type: 'string'
        },
		{
            name: 'inspecting_agency',
            type: 'string'
        },		
		{
            name: 'latitude',
            type: 'numeric'
        },
		{
            name: 'longitude',
            type: 'numeric'
        },
		{
			name: 'symbolizer',
			convert: function(v, r) {
				return r.raw.layer.styleMap.createSymbolizer(r.raw, 'default');
			}
		}
    ],
	autoDestroy: true	
});