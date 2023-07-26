Ext.define("Ext.data.reader.Xml",{extend:"Ext.data.reader.Reader",alternateClassName:"Ext.data.XmlReader",alias:"reader.xml",createAccessor:function(n){var t=this;return Ext.isEmpty(n)?Ext.emptyFn:Ext.isFunction(n)?n:function(i){return t.getNodeValue(Ext.DomQuery.selectNode(n,i))}},getNodeValue:function(n){return n&&(typeof n.normalize=="function"&&n.normalize(),n=n.firstChild,n)?n.nodeValue:undefined},getResponseData:function(n){var r=n.responseXML,t,i;return r?this.readRecords(r):(i="XML data not found in the response",t=new Ext.data.ResultSet({total:0,count:0,records:[],success:!1,message:i}),this.fireEvent("exception",this,n,t),Ext.Logger.warn(i),t)},getData:function(n){return n.documentElement||n},getRoot:function(n){var i=n.nodeName,t=this.root;return!t||i&&i==t?n:Ext.DomQuery.isXml(n)?Ext.DomQuery.selectNode(t,n):void 0},extractData:function(n){var t=this.record;return t||Ext.Error.raise("Record is a required parameter"),n=t!=n.nodeName?Ext.DomQuery.select(t,n):[n],this.callParent([n])},getAssociatedDataRoot:function(n,t){return Ext.DomQuery.select(t,n)[0]},readRecords:function(n){return Ext.isArray(n)&&(n=n[0]),this.xmlData=n,this.callParent([n])},createFieldAccessExpression:function(n,t,i){var u=this.namespace,r;return r=n.mapping||(u?u+"|":"")+n.name,typeof r=="function"?t+".mapping("+i+", this)":'me.getNodeValue(Ext.DomQuery.selectNode("'+r+'", '+i+"))"}})