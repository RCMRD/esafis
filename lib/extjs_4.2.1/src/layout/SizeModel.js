Ext.define("Ext.layout.SizeModel",{constructor:function(n){var t=this,i=t.self,u=i.sizeModelsArray,r;Ext.apply(t,n);t[r=t.name]=!0;t.fixed=!(t.auto=t.natural||t.shrinkWrap);u[t.ordinal=u.length]=i[r]=i.sizeModels[r]=t},statics:{sizeModelsArray:[],sizeModels:{}},calculated:!1,configured:!1,constrainedMax:!1,constrainedMin:!1,natural:!1,shrinkWrap:!1,calculatedFromConfigured:!1,calculatedFromNatural:!1,calculatedFromShrinkWrap:!1,names:null},function(){var n=this,r=n.sizeModelsArray,t,i,u,e,f;for(new n({name:"calculated"}),new n({name:"configured",names:{width:"width",height:"height"}}),new n({name:"natural"}),new n({name:"shrinkWrap"}),new n({name:"calculatedFromConfigured",configured:!0,names:{width:"width",height:"height"}}),new n({name:"calculatedFromNatural",natural:!0}),new n({name:"calculatedFromShrinkWrap",shrinkWrap:!0}),new n({name:"constrainedMax",configured:!0,constrained:!0,names:{width:"maxWidth",height:"maxHeight"}}),new n({name:"constrainedMin",configured:!0,constrained:!0,names:{width:"minWidth",height:"minHeight"}}),new n({name:"constrainedDock",configured:!0,constrained:!0,constrainedByMin:!0,names:{width:"dockConstrainedWidth",height:"dockConstrainedHeight"}}),t=0,u=r.length;t<u;++t)for(f=r[t],f.pairsByHeightOrdinal=e=[],i=0;i<u;++i)e.push({width:f,height:r[i]})})