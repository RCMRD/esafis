Ext.define("Ext.rtl.dom.Element_anim",{override:"Ext.dom.Element",rtlXAnchors:{l:"r",r:"l"},anchorAnimX:function(n){Ext.rootHierarchyState.rtl&&(n=this.rtlXAnchors[n]);this.callParent(arguments)}})