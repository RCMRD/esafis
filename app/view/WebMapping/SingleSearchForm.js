Ext.define('eafire.view.WebMapping.SingleSearchForm', 
{
    extend: 'Ext.form.Panel',
    alias: 'widget.SingleSearchForm',
    bodyPadding: 2,
	//width: 250,
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
        xtype: 'datefield',
        anchor: '100%',
        id: 'single_search_id',
        fieldLabel: 'Select a Date',
        name: 'one_date',
        maxValue: new Date()  // limited to the current date or prior
		}
	],	
	buttons:
	[
		{
			text: 'Search',
            id:'singleSearchButtonId',
			width: 50,
			action: 'singleSearchAction'
		}
	]

});
