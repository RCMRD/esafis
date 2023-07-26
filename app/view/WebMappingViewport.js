 //var conservation_area_store_url;
layers_tree_store = Ext.create('Ext.data.TreeStore', {
	model: 'GeoExt.data.LayerTreeModel',
	root: {
		expanded: true,
		children: 
		[
			{
				text: "Base Maps",
				plugins: ['gx_baselayercontainer'],
				collapsed: true
			}, 
			{
				text: "Overlays",
				plugins: ['gx_overlaylayercontainer'],
				expanded: true
			}
		]
	}
});

layer_legend_tree = Ext.create('GeoExt.tree.Panel', 
{
	title: "Layers",
	autoScroll: true,
 	viewConfig:
	{
		plugins: [{
			ptype: 'treeviewdragdrop',
			appendOnly: false
		}]
	},
	store: layers_tree_store,
    listeners:{
        'checkchange': function(node, checked){
           
            var legend_container = document.getElementById('legend_items-innerCt'); 
            
            if(checked &&  (range_search_heatmap.visibility===true)){
                //console.log('Checked'); 
                Ext.get('heatmap_legend').show(); 
                legend_container.getElementsByTagName('div')[4].style.display='none'; //range_search_heatmap legend
            } else if (!checked && (range_search_heatmap.visibility===false)){
                //console.log('Unchecked'); 
                if ( Ext.get('heatmap_legend')) { 
                    Ext.get('heatmap_legend').hide();  
                }           
            }
            if (checked &&  (range_search_fire_layer.visibility===true)) {
              //  console.log('Checked'); 
                //legend_container.getElementsByTagName('div')[1].style.display='block'; 
            }else {
               // console.log('UnChecked'); 
            }
        }
    },
	rootVisible: false,
	lines: false
});

legendPanel = Ext.create ('GeoExt.LegendPanel',{
	defaults: 
	{
		labelCls: '',
		style: 'padding:0px 0px 10px 0px'
	},
	bodyStyle: 'padding:5px',

	title: "Legend",
	height: 300, 
    autoScroll: true,
	collapsible: true,
	lines: false,
	id:"legend_items",
	layers: [latest_fire_layer]
});

LogoPanel = new Ext.Panel({  
    region: 'south',      
    xtype: 'panel',
    id: 'logopanelID',
    height: 90,
    width: 330,
    minWidth: 260,
   // collapsed:true,
   //animCollapse: true,
    collapsible: true,
    collapseMode: 'mini',
    preventHeader: true,
    split: true,
    items:[
        {
            xtype: 'panel',
            html:'<div class="logos"><a target="new" href="http://www.usaid.gov/"><img alt="USAID" width="134" height="40" src="assets/images/usaid.png"></a>'+
            '<a target="new" href="http://rcmrd.org/"><img alt="RCMRD" width="126" height="40" class="rcmrd" src="assets/images/rcmrd.png"></a>'+
            '<a target="new" href="http://www.rcmrd.org/?page_id=5130"><img alt="SERVIR East and Southern Africa" width="240" height="35" src="assets/images/servir-easafricab.png"></a>'+
            '<a target="new" href="http://www.nasa.gov/"><img alt="NASA" width="49" height="40" src="assets/images/nasa.png"></a> </div>'
        }
    ]
}); 
	
GeoExtPanel = new Ext.Panel ({
	region: 'west',
	xtype: 'panel',
	width: 300,
	minWidth: 200,
    height: 400, 
	active:true,
   // maxWidth: 500,
    listeners: {
        resize: Ext.Function.bind(function(comp, width, height,
                oldWidth, oldHeight, eOpts) {
            comp.doLayout();
        }, this)
    },
	title: 'Map Elements',
	collapsible: true,
	split: true,
	items: [layer_legend_tree, legendPanel]

});	


Ext.define('ConservationAreaModel', {
    extend: 'Ext.data.Model',
    fields: [
        {id:'gid', name:'full_areaname'}
    ]
});
Ext.define('TownsModel', {
    extend: 'Ext.data.Model',
    fields: [
        {id:'gid', name:'town_name'}
    ]
});

conservation_area_store =  Ext.create('Ext.data.JsonStore', {
    model:'ConservationAreaModel',
    fields: [
        {
            id: 'gid'
        }, 
        {
            name: 'full_areaname'
        }
    ],
    autoDestroy: true,
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url:'data/webmapping/selectConservationArea.php'
    }),
    reader: {
        type: 'json'
    }
});


towns_store =  Ext.create('Ext.data.JsonStore', {
    model:'TownsModel',
    fields: [
        {
            id: 'gid'
        }, 
        {
            name: 'town_name'
        }
    ],
    autoDestroy: true,
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url:'data/webmapping/selectTown.php'
    }),
    reader: {
        type: 'json'
        //root: 'rows'
    },
    listeners: {
        load: function (obj, records) {
            // Ext.each(records, function (rec) {

            // });
        }
    }
});



conservation_area_store =  Ext.create('Ext.data.JsonStore', {
    model:'ConservationAreaModel',
    fields: [
        {
            id: 'gid'
        }, 
        {
            name: 'full_areaname'
        }
    ],
    autoDestroy: true,
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url:'data/webmapping/selectConservationArea.php'
    }),
    reader: {
        type: 'json'
    }
});


towns_store =  Ext.create('Ext.data.JsonStore', {
    model:'TownsModel',
    fields: [
        {
            id: 'gid'
        }, 
        {
            name: 'town_name'
        }
    ],
    autoDestroy: true,
    autoLoad: true,
    proxy: new Ext.data.HttpProxy({
        url:'data/webmapping/selectTown.php'
    }),
    reader: {
        type: 'json'
        //root: 'rows'
    },
    listeners: {
        load: function (obj, records) {
            // Ext.each(records, function (rec) {

            // });
        }
    }
});


SingleSearchForm = Ext.create('Ext.form.Panel', {
    width: 300,
    bodyPadding: 10,
    //collapsible:true,
    //collapsed:true,
    id: 'single_search_id', 
    title: 'Single Search',
    items: [
        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Countries',
            allowBlank: true,
            margin: "10 0 0 0",
            id:  'single_country_id',
            emptyText:'Select a Country',
            name:'single_country_name',
            typeAhead: true,
            listeners: {
                select: function(){
                       
                }
            },

            store : [
                "All Countries","Burundi", "Djibouti", "Eritrea", "Ethiopia", "Kenya", "Rwanda", "Somalia", "Sudan", "South Sudan", "Tanzania", "Uganda"
            ]
        },
        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Affected Conservation Area',
            name:'single_conservation_area_name',
            allowBlank: true,
            margin: "10 0 0 0",
            minChars: 1,
            queryMode: 'local',
            enableRegEx: true,
            disabled: true,
            displayField: 'full_areaname',
            valueField: 'gid',
            id:  'single_conservation_area_id',
            store:conservation_area_store,
            emptyText:'Select a Conservation Area',
            typeAhead: true,
            listeners:{
                select: function(){

                    single_conservation_area_val=Ext.getCmp('single_conservation_area_id').getValue(); 
                    if(single_conservation_area_val!=null) {
                        single_conservation_area_val=single_conservation_area_val.charAt(0).toUpperCase() + single_conservation_area_val.slice(1);
                    }
                }
            },
            columns: [{
                dataIndex: 'full_areaname'
            }]
        },  

        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Nearby Conservation Area',
            name:'single_conservation_area_name',
            allowBlank: true,
            margin: "10 0 0 0",
            minChars: 1,
            queryMode: 'local',
            enableRegEx: true,
            disabled: true,
            displayField: 'full_areaname',
            valueField: 'gid',
            id:  'single_nearby_conservation_area_id',
            store:conservation_area_store,
            emptyText:'Select a Conservation Area',
            typeAhead: true,
            listeners:{
                select: function(){

                    single_nearby_conservation_area_val=Ext.getCmp('single_nearby_conservation_area_id').getValue(); 
                    if(single_nearby_conservation_area_val!=null) {
                        single_nearby_conservation_area_val=single_nearby_conservation_area_val.charAt(0).toUpperCase() + single_nearby_conservation_area_val.slice(1);
                    }
                }
            },
            columns: [{
                dataIndex: 'full_areaname'
            }]
        },  

        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Nearby Towns',
            name:'single_town_name',
            allowBlank: true,
            margin: "10 0 10 0",
            minChars: 1,
            queryMode: 'local',
            enableRegEx: true,
            disabled: true,
            displayField: 'town_name',
            valueField: 'gid',
            id:  'single_town_id',
            store:towns_store,
            emptyText:'Select a Settlement Area',
            typeAhead: true,
            columns: [{
                dataIndex: 'town_name'
            }]
        },       
        {
            xtype: 'datefield',
            anchor: '100%',
            id: 'single_date_search_id',
            fieldLabel: 'Select a Date',
            name: 'one_date',
            //value: new Date(),
           // renderer: Ext.util.Format.dateRenderer('Y-m-d'),
            format:'Y-m-d',
            submitFormat: 'Y-m-d',
            submitValue : true,
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


RangeSearchForm = Ext.create('Ext.form.Panel', {
    width: 330,
    id:'range_search_id', 
    bodyPadding: 10,
    title: '',
    items: [
       {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Countries',
            allowBlank: true,
            margin: "10 0 0 0",
            id:  'range_country_id',
            emptyText:'Select a Country',
            name:'range_country_name',
            typeAhead: true,
            listeners: {
                select: function(){
                       
                }
            },

            store : [
                "All Countries", "Burundi", "Djibouti", "Eritrea", "Ethiopia", "Kenya", "Rwanda", "Somalia", "Sudan", "South Sudan", "Tanzania", "Uganda"
            ]
        },
        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Affected Conservation Area',
            name:'range_conservation_area_name',
            allowBlank: true,
            margin: "10 0 0 0",
            minChars: 1,
            queryMode: 'local',
            enableRegEx: true,
            disabled: true,
            displayField: 'full_areaname',
            valueField: 'gid',
            id:  'range_conservation_area_id',
            store:conservation_area_store,
            emptyText:'Select a Conservation Area',
            typeAhead: true,
            listeners:{
                select: function(){

                    range_conservation_area_val=Ext.getCmp('range_conservation_area_id').getValue(); 
                    if(range_conservation_area_val!=null) {
                        range_conservation_area_val=range_conservation_area_val.charAt(0).toUpperCase() + range_conservation_area_val.slice(1);
                    }
                }
            },
            columns: [{
                dataIndex: 'full_areaname'
            }]
        },  

        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Nearby Conservation Area',
            name:'range_conservation_area_name',
            allowBlank: true,
            margin: "10 0 0 0",
            minChars: 1,
            queryMode: 'local',
            enableRegEx: true,
            disabled: true,
            displayField: 'full_areaname',
            valueField: 'gid',
            id:  'range_nearby_conservation_area_id',
            store:conservation_area_store,
            emptyText:'Select a Conservation Area',
            typeAhead: true,
            listeners:{
                select: function(){

                    range_nearby_conservation_area_val=Ext.getCmp('range_nearby_conservation_area_id').getValue(); 
                    if(range_nearby_conservation_area_val!=null) {
                        range_nearby_conservation_area_val=range_nearby_conservation_area_val.charAt(0).toUpperCase() + range_nearby_conservation_area_val.slice(1);
                    }
                }
            },
            columns: [{
                dataIndex: 'full_areaname'
            }]
        },  

        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Nearby Towns',
            name:'range_town_name',
            allowBlank: true,
            margin: "10 0 10 0",
            minChars: 1,
            queryMode: 'local',
            enableRegEx: true,
            disabled: true,
            displayField: 'town_name',
            valueField: 'gid',
            id:  'range_town_id',
            store:towns_store,
            emptyText:'Select a Settlement Area',
            typeAhead: true,
            columns: [{
                dataIndex: 'town_name'
            }]
        },       
        {
            xtype: 'datefield',
            anchor: '100%',
            id: 'range_one_id',
            fieldLabel: 'From',
            name: 'from_date',
            maxValue: new Date()  // limited to the current date or prior
        }, {
            xtype: 'datefield',
            anchor: '100%',
            id: 'range_two_id',
            fieldLabel: 'To',
            name: 'to_date',
            value: new Date()  // defaults to today
        }, 
        {
            xtype:'checkbox', 
            boxLabel  : 'Show Heatmap',
            id        : 'range_search_heatmap_check_id'
        }




        ],
        buttons:
    	[
    		{
    			text: 'Search',
    			width: 50,
                id:'rangeSearchButtonId',
    			action: 'rangeSearchAction'
    		}
    		

    	]
});


CustomSearchForm = Ext.create('Ext.form.Panel', {
    width: 300,
    bodyPadding: 10,

    title: 'Custom Search',
   	id: "custom_search_id",
    items: [
    {
        xtype: 'combobox',
        anchor: '100%',            
        fieldLabel: 'Countries',
        allowBlank: true,
        margin: "10 0 0 0",
        id:  'custom_country_id',
        emptyText:'Select a Country',
        name:'custom_country_name',
        typeAhead: true,
        listeners: {
            select: function(){
                   
            }
        },

        store : [
            "All Countries", "Burundi", "Djibouti", "Eritrea", "Ethiopia", "Kenya", "Rwanda", "Somalia", "Sudan", "South Sudan", "Tanzania", "Uganda"
        ]
    },
    {
        xtype: 'combobox',
        anchor: '100%',            
        fieldLabel: 'Affected Conservation Area',
        name:'custom_conservation_area_name',
        allowBlank: true,
        margin: "10 0 0 0",
        minChars: 1,
        queryMode: 'local',
        enableRegEx: true,
        disabled: true,
        displayField: 'full_areaname',
        valueField: 'gid',
        id:  'custom_conservation_area_id',
        store:conservation_area_store,
        emptyText:'Select a Conservation Area',
        typeAhead: true,
        listeners:{
            select: function(){

                custom_conservation_area_val=Ext.getCmp('custom_conservation_area_id').getValue(); 
                if(custom_conservation_area_val!=null) {
                    custom_conservation_area_val=custom_conservation_area_val.charAt(0).toUpperCase() + custom_conservation_area_val.slice(1);
                }
            }
        },
        columns: [{
            dataIndex: 'full_areaname'
        }]
    },
    {
        xtype: 'combobox',
        anchor: '100%',            
        fieldLabel: 'Nearby Conservation Area',
        name:'custom_conservation_area_name',
        allowBlank: true,
        margin: "10 0 0 0",
        minChars: 1,
        queryMode: 'local',
        enableRegEx: true,
        disabled: true,
        displayField: 'full_areaname',
        valueField: 'gid',
        id:  'custom_nearby_conservation_area_id',
        store:conservation_area_store,
        emptyText:'Select a Conservation Area',
        typeAhead: true,
        listeners:{
            select: function(){

                custom_nearby_conservation_area_val=Ext.getCmp('custom_nearby_conservation_area_id').getValue(); 
                if(custom_nearby_conservation_area_val!=null) {
                    custom_nearby_conservation_area_val=custom_nearby_conservation_area_val.charAt(0).toUpperCase() + custom_nearby_conservation_area_val.slice(1);
                }
            }
        },
        columns: [{
            dataIndex: 'full_areaname'
        }]
    },  

    {
        xtype: 'combobox',
        anchor: '100%',            
        fieldLabel: 'Nearby Towns',
        name:'custom_town_name',
        allowBlank: true,
        margin: "10 0 10 0",
        minChars: 1,
        queryMode: 'local',
        enableRegEx: true,
        disabled: true,
        displayField: 'town_name',
        valueField: 'gid',
        id:  'custom_town_id',
        store:towns_store,
        emptyText:'Select a Settlement Area',
        typeAhead: true,
        columns: [{
            dataIndex: 'town_name'
        }]
    }, 
    {
      
        anchor: '100%',
        fieldLabel: '',
        name: 'year',
        width:100, 
        html:'<span class="customdates">Year</span><span class="customdates">Month</span><span class="customdateslast">Date</span>'
    },{
        xtype: 'numberfield',
        //anchor: '100%',
        fieldLabel: '',
        name: 'year',
        id: 'custom_year_id',
        width:90, 
        minValue: 2015, 
        maxValue: new Date().getFullYear(), 
        emptyText: "All Years" 
    },{
        xtype: 'numberfield',
        fieldLabel: '',
        name: 'month',
        id: 'custom_month_id',
        minValue: 01,
        width:90,  
        maxValue:12, 
        maxLength:2,
        mouseWheelEnabled: true,
        emptyText: "All Months"  
    },{
        xtype: 'numberfield',
        fieldLabel: '',
        name: 'date',
        id: 'custom_date_id',
        minValue: 1,  
        width:90, 
        maxValue:31, 
        maxLength:2,
        mouseWheelEnabled: true,
        emptyText: "All Dates"  
    },
    {
        xtype:'checkbox', 
        boxLabel  : 'Show Heatmap',
        id        : 'custom_search_heatmap_check_id'
    }
    ], 
    buttons:
	[
		{
			text: 'Search',
			width: 50,
            id:'customSearchButtonId',
			action: 'customSearchAction'
		}
	]
});


/*SearchAccordion = Ext.create('Ext.panel.Panel', {
    title: '',
    width: 330,
    minWidth: 200,
    height: 460,
    id:"search_id", 
    defaults: {
        // applied to each contained panel
        bodyStyle: 'padding:15px'
    },
    layout: {
        // layout-specific configs go here
        type: 'accordion',
        titleCollapse: false,
        animate: true
    },
    items: [SingleSearchForm, RangeSearchForm, CustomSearchForm]
});
*/

// ///ReCaptcha Widget
Ext.define('eafire.util.ReCaptcha', {
    extend : 'Ext.Component',
    alias : 'widget.recaptcha',
     
 
    onRender : function(ct, position){
    var me = this;
    me.callParent(arguments);
      
    me.recaptcha = me.el.createChild({
    tag : "div",
    'id' : me.recaptchaId
  });
      
     Recaptcha.create(me.publickey, me.recaptcha.id, {
            theme: me.theme,
            lang: me.lang,
            callback: Recaptcha.focus_response_field
     });
      
     //me.recaptcha.setWidth(me.el.getWidth(true));
         
    },
     
    getChallenge: function(){
     return Recaptcha.get_challenge();
    },
     
    getResponse: function(){
     return Recaptcha.get_response();
    }
 
});
 
//create a ReCaptcha instance and we can use it as item in Form.
var recaptcha = Ext.create('eafire.util.ReCaptcha',{
        name: 'recaptcha',
        recaptchaId: 'recaptcha',
        publickey: '6LeV0tISAAAAAHeCWlEgFmA0TAw2siTxkRoQBwmG',
        theme: 'white',
        lang: 'en'
 });



Subscribe = Ext.create('Ext.form.Panel', {
    bodyPadding: 5,
    width: 350,
   
    id:'subscribe_form_id',
    defaults: {
        anchor: '100%'
    },
    title: 'Subscribe',

    bodyStyle: 'padding:10px;',
    items:[ 
        {
            xtype: 'textfield',
            anchor: '100%',            
            fieldLabel: 'Full Name:',
            margin: "10 0 0 0",
            width: 310,
            id: 'full_name_id',
            name:'full_name_name',
            allowBlank: false
        },
        {
            xtype: 'textfield',
            anchor: '100%',            
            fieldLabel: 'Organization:',
            margin: "10 0 0 0",
            width: 310,
            id: 'organization_id',
            name: 'organization_name',
            allowBlank: false
        },            
        {
           xtype: 'textfield',
           name: 'email',
           fieldLabel: 'Primary Email Address',
           margin: "10 0 0 0",
           width: 310,
           id: 'email_id',
           name: 'email_name',
           vtype: 'email', // requires valid email format
           allowBlank: false
        },
        /*{
           xtype: 'textfield',
           name: 'email',
           fieldLabel: 'Secondary Email Address (optional)',
           margin: "10 0 0 0",
           width: 310,
           id: 'email2_id',
           name: 'email2_name',
           vtype: 'email', // requires valid email format
           allowBlank: true
        },
        {
            xtype: 'textfield',
            name: 'mobile',
            fieldLabel: 'Mobile',
            id:'mobile_id',
            emptyText:'0712345678', 
            name: 'mobile_name',
            margin: "10 0 0 0",
            width: 310,
            enforceMaxLength : 16, 
            maxLengthText : 'The maximum length for this field is {10}',
            regex : /^(\({1}[0-9]{3}\){1}\s{1})([0-9]{3}[-]{1}[0-9]{4})$|^(((\+44)? ?(\(0\))? ?)|(0))((?: ?[0-9]{3}){2} ?[0-9]{4})$|^Ext. [0-9]+$/,
            allowBlank: true
        },*/
        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Country',
            allowBlank: false,
            width: 310,
            margin: "10 0 0 0",
            id:  'subscribe_country_id',
            emptyText:'Select a Country',
            name:'subscribe_country_name',
            typeAhead: true,
            store : [
                "All Countries", "Burundi", "Djibouti", "Eritrea", "Ethiopia", "Kenya", "Rwanda", "Somalia", "Sudan", "South Sudan", "Tanzania", "Uganda"
            ]
        },
        {
            xtype:'checkbox', 
            boxLabel  : 'Get Alerts for the Entire Country',
           // name      : 'alert_country_name',
            disabled: true,
            listeners: {
                change: function() {
                   var country_selected_val=Ext.getCmp('subscribe_country_id').getRawValue();
                   var subscribe_country_check_val = Ext.getCmp('subscribe_country_check_id').getRawValue();
                   if (subscribe_country_check_val === true){
                        Ext.getCmp('alert_country_hidden_id').setValue(country_selected_val); 
                   }
                  
                }
            },
           // inputValue: '1',
            id        : 'subscribe_country_check_id'
        },
        {
            xtype:'hidden', 
            name      : 'alert_country_hidden_name',
            id        : 'alert_country_hidden_id'
        },
        {
            xtype: 'combobox',
            anchor: '100%',            
            fieldLabel: 'Conservation Area Intersted in',
            store:conservation_area_store,
            name:'subscribe_conservation_area_name',
            allowBlank: true,
            width: 310,
            margin: "10 0 0 0",
            minChars: 1,
            queryMode: 'local',
            enableRegEx: true,
            disabled: true,
            displayField: 'full_areaname',
           // valueField: 'gid',
            id:  'subscribe_conservation_area_id',
            typeAhead: true,
            listeners:{
                select: function(){

                    subscribe_conservation_area_val=Ext.getCmp('subscribe_conservation_area_id').getRawValue(); 
                    if(subscribe_conservation_area_val!=null) {
                        subscribe_conservation_area_val=subscribe_conservation_area_val.charAt(0).toUpperCase() + subscribe_conservation_area_val.slice(1);
                    }
                }
            },
            columns: [{
                dataIndex: 'full_areaname'
            }]
        }
    ],
    // Reset and Submit buttons
    buttons: [{
        text: 'Reset',
        handler: function() {
            this.up('form').getForm().reset();
        }
    },'->',
    {
        text: 'Submit',
        formBind: true, //only enabled once the form is valid
        disabled: true,
        handler: function() {
            var form = this.up('form').getForm();
            if (form.isValid()) {
                  console.log(form.getValues());
                //Ext.Msg.alert("Search Error",form);
                form.submit({
                    method: 'GET',
                    url: 'data/webmapping/subscribe.php',

                    waitMsg: 'Saving...',   
                    success: function(form, action) {
                        Ext.Msg.alert('Success', action.result.msg);
                        console.log(action.result.msg); 
                    }, 
                    failure: function(form, action) {
                    }
                });
            }

        }
    }]
});

// towns_store.on('load', function(){
//     var subscribe_town = Ext.getCmp('subscribe_town_id');
//      subscribe_town_val=Ext.getCmp('subscribe_town_id').getRawValue();
//     subscribe_town_val = subscribe_town.setValue(subscribe_town_val);
//    // storeB.load();
// });
// towns_store.load();


var GeneralTabs = Ext.create('Ext.tab.Panel', {
	id: "generaltabsID",
	layout: 'card',
	region: 'west',
	width:330,
	minWidth:200,
    height: 400, 
	animate: true,
	preventHeader: true,
     hideCollapseTool: true,
	collapsible: true,
    activeTab: 0,
    split: true,
    tabPosition: 'top',
    items: [
    	    GeoExtPanel, 
        {
            title: 'Search',
            items:[RangeSearchForm]
        },
        Subscribe
    ]
});

WestPanel = new Ext.Panel({  
    region: 'west',
    xtype: 'panel',
    layout:'border',
    width: 330,
    minWidth: 200,
    //height: 400, 
    active:true,
    collapsible: true,
    preventHeader: true,
    hideCollapseTool: true,
    split: true,
    items: [GeneralTabs, LogoPanel]

}); 



 	statusbar = new Ext.Panel({
        region: 'south',
        id: 'statusbar', 
		xtype: 'panel',
        width: 350,
        height: 35,
        bbar: Ext.create('Ext.ux.StatusBar', {
            defaultText: '',
             height: 35,
             bodyStyle: 'padding-top:25px;',
            // bodyStyle: 'padding:15px;',
            id: 'statusbar_content_id',
            cls: 'statusbar_content'

        })
    });


Ext.define('eafire.view.WebMappingViewport', 
{
    extend: 'Ext.container.Viewport',
    alias: 'widget.WebMappingViewport',
	id: 'viewportId',
	renderTo: Ext.getBody(),
    layout: {
        type: 'border'
    },
    initComponent: function() 
	{
        var me = this;
        Ext.applyIf(me, {
		items: 
			[
				{
					xtype: 'panel',
					region: 'north',
					height: 60, //orignal 60
					html: '<div class="fire"><div class="satimage"><div class="fireimage"><div class="topcont"><div class="logobox"></div><h1 class="topheader">'+
					'Eastern and Southern Africa Fire Information Service</h1></div></div></div></div>'
				},
				{
					xtype: 'MapPanel'
				},
                //Navigation,
                 WestPanel,
				statusbar
			]
        });
        me.callParent(arguments);
    }
});