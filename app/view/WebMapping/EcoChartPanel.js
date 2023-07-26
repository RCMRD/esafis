Ext.define('eafire.view.WebMapping.EcoChartPanel', 
{
	extend: 'Ext.window.Window',
	alias: 'widget.EcoChartPanel',	
	id: 'EcoChartPanelId',
	frame: true,
	width: 600,
	height: 500,
	maximizable: true,
	title: 'Coastal Ecosystem Statistics',
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
					id: 'EcoChartId',
					style: 'background:#fff',
					animate: true,	
					store: 'WebMapping.EcoChartPanelStore',
					legend: {position: 'top',visible: true},
					axes: 
					[{
						type: 'Numeric',
						position: 'bottom',
						fields: ['total'],
						title: 'Countries',
						grid: true,
						minimum: 0
					}, 
					{
						type: 'Category',
						position: 'left',
						fields: ['division'],
						title: 'Divisions'
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