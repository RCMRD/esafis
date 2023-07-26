Ext.define('coastaleco.view.WebMapping.BoreholeChartPanel', 
{
	extend: 'Ext.window.Window',
	alias: 'widget.BoreholeChartPanel',	
	id: 'BoreholeChartPanelId',
	frame: true,
	width: 600,
	height: 500,
	maximizable: true,
	title: 'Wajir Borehole Chart',
	layout: 'border',
    initComponent: function() 
	{
        var me = this;
        Ext.applyIf(me, 
		{
            items: 
			[	
			
				{
					xtype: 'chart',
					id: 'BoreholeChartId',
					style: 'background:#fff',
					animate: true,	
					store: 'WebMapping.BoreholeChartPanelStore',
					legend: {position: 'top',visible: false},
					axes: 
					[{
						type: 'Numeric',
						position: 'bottom',
						fields: ['total'],
						title: 'Number of Boreholes',
						grid: true,
						minimum: 0
					}, 
					{
						type: 'Category',
						position: 'left',
						fields: ['division'],
						title: 'Division'
					}],
					series: 
					[{
						type: 'bar',
						axis: 'bottom',
						highlight: true,
						
						tips:
						{
						  trackMouse: true,
						  width: 140,
						  height: 28,
						  renderer: function(storeItem, item) {
							this.setTitle(storeItem.get('division') + ': ' + storeItem.get('total') + ' Boreholes');
						  }
						},
						
						label: {
						  display: 'insideEnd',
							field: 'total',
							orientation: 'horizontal',
							color: '#333',
						  'text-anchor': 'middle'
						},
						xField: 'division',
						yField: 'total'
					}]
				}
			
            ]
        });
        me.callParent(arguments);
    }
});