Ext.define("Ext.dd.DDProxy",{extend:"Ext.dd.DD",statics:{dragElId:"ygddfdiv"},constructor:function(n,t,i){n&&(this.init(n,t,i),this.initFrame())},resizeFrame:!0,centerFrame:!1,createFrame:function(){var r=this,i=document.body,n,t;if(!i||!i.firstChild){setTimeout(function(){r.createFrame()},50);return}n=this.getDragEl();n||(n=document.createElement("div"),n.id=this.dragElId,t=n.style,t.position="absolute",t.visibility="hidden",t.cursor="move",t.border="2px solid #aaa",t.zIndex=999,i.insertBefore(n,i.firstChild))},initFrame:function(){this.createFrame()},applyConfig:function(){this.callParent();this.resizeFrame=this.config.resizeFrame!==!1;this.centerFrame=this.config.centerFrame;this.setDragElId(this.config.dragElId||Ext.dd.DDProxy.dragElId)},showFrame:function(n,t){var u=this.getEl(),i=this.getDragEl(),r=i.style;this._resizeProxy();this.centerFrame&&this.setDelta(Math.round(parseInt(r.width,10)/2),Math.round(parseInt(r.height,10)/2));this.setDragElPos(n,t);Ext.fly(i).show()},_resizeProxy:function(){if(this.resizeFrame){var n=this.getEl();Ext.fly(this.getDragEl()).setSize(n.offsetWidth,n.offsetHeight)}},b4MouseDown:function(n){var t=n.getPageX(),i=n.getPageY();this.autoOffset(t,i);this.setDragElPos(t,i)},b4StartDrag:function(n,t){this.showFrame(n,t)},b4EndDrag:function(){Ext.fly(this.getDragEl()).hide()},endDrag:function(){var n=this.getEl(),t=this.getDragEl();t.style.visibility="";this.beforeMove();n.style.visibility="hidden";Ext.dd.DDM.moveToEl(n,t);t.style.visibility="hidden";n.style.visibility="";this.afterDrag()},beforeMove:function(){},afterDrag:function(){},toString:function(){return"DDProxy "+this.id}})