Ext.define('eafire.view.WebMapping.BoreholeChartPanelItem', 
{
    extend: 'Ext.chart.Chart',
    alias: 'widget.BoreholeChartPanelItem',
	id:'BoreholeChartPanelItemId',
    title: 'Borehole Chart',   	
	store: 'WebMapping.BoreholeChartPanelStore',
	layout:'border',
	animate: true,
	style: 'background:#fff',
	legend: 
	{
		position: 'top',
		visible: false
	},
	axes: [
			{
			type: 'Numeric',
			position: 'left',
			fields: ['total'],
			label: {
				renderer: Ext.util.Format.numberRenderer('0,0')
			},
			title: '% Average Change',
			grid: true,
			//minimum: -8,
			maximum: (['total.maximum']),
			minimum: (['total.minimum']),
			majorTickSteps:1,
			minorTickSteps:1
			
			//maximum: 10,
			}, 
			{
				type: 'Category',
				position: 'bottom',
				fields: ['division'],
				title: 'division',
				label: 	{
							rotate: 
							{
								degrees: 0
							}
						}
				
			}
		],
				
	series: [{

			type: 'column',
			axis: 'bottom',
			highlight: true,
			tips: {
			  trackMouse: true,
			  width: 140,
			  height: 28,
			  renderer: function(storeItem, item) {
				this.setTitle(storeItem.get('division') + ': ' + storeItem.get(['total']) + ' %');
			  }
			},
			label: {
			  display: 'insideEnd',
			  'text-anchor': 'middle',
				field: ['total'],
				renderer: Ext.util.Format.numberRenderer('0,000.00 %'),
				orientation: 'horizontal',
				color: '#333'
			},
			xField: 'division',
			yField: 'total'
		}]
		   

});