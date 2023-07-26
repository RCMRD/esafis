Ext.define("Ext.chart.series.Pie",{alternateClassName:["Ext.chart.PieSeries","Ext.chart.PieChart"],extend:"Ext.chart.series.Series",type:"pie",alias:"series.pie",accuracy:1e5,rad:Math.PI/5e4,highlightDuration:150,angleField:!1,lengthField:!1,donut:!1,showInLegend:!1,style:{},constructor:function(n){this.callParent(arguments);var t=this,r=t.chart,u=r.surface,o=r.store,e=r.shadow,i,f;if(n.highlightCfg=Ext.merge({segment:{margin:20}},n.highlightCfg),Ext.apply(t,n,{shadowAttributes:[{"stroke-width":6,"stroke-opacity":1,stroke:"rgb(200, 200, 200)",translate:{x:1.2,y:2}},{"stroke-width":4,"stroke-opacity":1,stroke:"rgb(150, 150, 150)",translate:{x:.9,y:1.5}},{"stroke-width":2,"stroke-opacity":1,stroke:"rgb(100, 100, 100)",translate:{x:.6,y:1}}]}),t.group=u.getGroup(t.seriesId),e)for(i=0,f=t.shadowAttributes.length;i<f;i++)t.shadowGroups.push(u.getGroup(t.seriesId+"-shadows"+i));u.customAttributes.segment=function(n){var i=t.getSegment(n);return i.path&&i.path.length!==0||(i.path=["M",0,0]),i};t.__excludes=t.__excludes||[]},onRedraw:function(){this.initialize()},initialize:function(){var n=this,f=n.chart.getChartStore(),i=f.data.items,t,r,u;if(n.yField=[],n.label.field)for(t=0,r=i.length;t<r;t++)u=i[t],n.yField.push(u.get(n.label.field))},getSegment:function(n){var o=this,s=o.rad,h=Math.cos,c=Math.sin,t=o.centerX,i=o.centerY,l=0,a=0,ut=0,r=0,v=0,y=0,ft=0,u=0,p=0,w=0,f=0,e=0,b=n.startAngle,k=n.endAngle,et=(b+k)/2*s,d=n.margin||0,g=Math.min(b,k)*s,nt=Math.max(b,k)*s,ot=h(g),st=c(g),ht=h(nt),ct=c(nt),tt=h(et),it=c(et),rt=0;return nt-g<.01?{path:""}:(d!==0&&(t+=d*tt,i+=d*it),a=t+n.endRho*ot,y=i+n.endRho*st,r=t+n.endRho*ht,u=i+n.endRho*ct,f=t+n.endRho*tt,e=i+n.endRho*it,n.startRho!==0?(l=t+n.startRho*ot,v=i+n.startRho*st,ut=t+n.startRho*ht,ft=i+n.startRho*ct,p=t+n.startRho*tt,w=i+n.startRho*it,{path:[["M",a,y],["A",n.endRho,n.endRho,0,0,1,f,e],["L",f,e],["A",n.endRho,n.endRho,0,rt,1,r,u],["L",r,u],["L",ut,ft],["A",n.startRho,n.startRho,0,rt,0,p,w],["L",p,w],["A",n.startRho,n.startRho,0,0,0,l,v],["L",l,v],["Z"]]}):{path:[["M",t,i],["L",a,y],["A",n.endRho,n.endRho,0,0,1,f,e],["L",f,e],["A",n.endRho,n.endRho,0,rt,1,r,u],["L",r,u],["L",t,i],["Z"]]})},calcMiddle:function(n){var t=this,f=t.rad,i=n.slice,e=t.centerX,o=t.centerY,s=i.startAngle,h=i.endAngle,a=+t.donut,r=-(s+h)*f/2,u=(n.endRho+n.startRho)/2,c=e+u*Math.cos(r),l=o-u*Math.sin(r);n.middle={x:c,y:l}},drawSeries:function(){var n=this,o=n.chart.getChartStore(),rt=o.data.items,b,k=n.group,wt=n.chart.animate,bt=n.angleField||n.field||n.xField,l=[].concat(n.lengthField),ut=0,ft=n.chart,ri=ft.surface,d=ft.chartBBox,ct=ft.shadow,g=n.shadowGroups,ui=n.shadowAttributes,lt=g.length,c=l.length,y=0,kt=+n.donut,et=[],dt=[],tt=0,at=0,ot=0,vt=n.seriesStyle,a=n.colorArrayStyle,yt=a&&a.length||0,u,nt,st,p,e,gt,ni,w,ht=0,i,h,f,it,v,ti,s,t,r,pt,ii,fi;if(Ext.apply(vt,n.style||{}),n.setBBox(),fi=n.bbox,n.colorSet&&(a=n.colorSet,yt=a.length),!o||!o.getCount()||n.seriesIsHidden){n.hide();n.items=[];return}for(n.unHighlightItem(),n.cleanHighlights(),gt=n.centerX=d.x+d.width/2,ni=n.centerY=d.y+d.height/2,n.radius=Math.min(gt-d.x,ni-d.y),n.slices=h=[],n.items=dt=[],t=0,s=rt.length;t<s;t++)if((b=rt[t],!this.__excludes||!this.__excludes[t])&&(tt+=+b.get(bt),l[0])){for(r=0,ut=0;r<c;r++)ut+=+b.get(l[r]);et[t]=ut;at=Math.max(at,ut)}for(tt=tt||1,t=0,s=rt.length;t<s;t++){if(b=rt[t],this.__excludes&&this.__excludes[t]?it=0:(it=b.get(bt),ht==0&&(ht=1)),ht==1)for(ht=2,n.firstAngle=ot=n.accuracy*it/tt/2,r=0;r<t;r++)h[r].startAngle=h[r].endAngle=n.firstAngle;pt=ot-n.accuracy*it/tt;i={series:n,value:it,startAngle:ot,endAngle:pt,storeItem:b};l[0]?(ti=+et[t],i.rho=Math.floor(n.radius/at*ti)):i.rho=n.radius;h[t]=i,function(){ot=pt}()}if(ct)for(t=0,s=h.length;t<s;t++)for(i=h[t],i.shadowAttrs=[],r=0,y=0,st=[];r<c;r++){for(f=k.getAt(t*c+r),w=l[r]?o.getAt(t).get(l[r])/et[t]*i.rho:i.rho,u={segment:{startAngle:i.startAngle,endAngle:i.endAngle,margin:0,rho:i.rho,startRho:y+w*kt/100,endRho:y+w},hidden:!i.value&&i.startAngle%n.accuracy==i.endAngle%n.accuracy},e=0,st=[];e<lt;e++){if(nt=ui[e],p=g[e].getAt(t),p||(p=ft.surface.add(Ext.apply({},{type:"path",group:g[e],strokeLinejoin:"round"},u,nt))),nt=n.renderer(p,o.getAt(t),Ext.apply({},u,nt),t,o),wt)n.onAnimate(p,{to:nt});else p.setAttributes(nt,!0);st.push(p)}i.shadowAttrs[r]=st}for(t=0,s=h.length;t<s;t++)for(i=h[t],r=0,y=0;r<c;r++){if(f=k.getAt(t*c+r),w=l[r]?o.getAt(t).get(l[r])/et[t]*i.rho:i.rho,u=Ext.apply({segment:{startAngle:i.startAngle,endAngle:i.endAngle,margin:0,rho:i.rho,startRho:y+w*kt/100,endRho:y+w},hidden:!i.value&&i.startAngle%n.accuracy==i.endAngle%n.accuracy},Ext.apply(vt,a&&{fill:a[(c>1?r:t)%yt]}||{})),v=Ext.apply({},u.segment,{slice:i,series:n,storeItem:i.storeItem,index:t}),n.calcMiddle(v),ct&&(v.shadows=i.shadowAttrs[r]),dt[t]=v,f||(ii=Ext.apply({type:"path",group:k,middle:v.middle},Ext.apply(vt,a&&{fill:a[(c>1?r:t)%yt]}||{})),f=ri.add(Ext.apply(ii,u))),i.sprite=i.sprite||[],v.sprite=f,i.sprite.push(f),i.point=[v.middle.x,v.middle.y],wt){u=n.renderer(f,o.getAt(t),u,t,o);f._to=u;f._animating=!0;n.onAnimate(f,{to:u,listeners:{afteranimate:{fn:function(){this._animating=!1},scope:f}}})}else u=n.renderer(f,o.getAt(t),Ext.apply(u,{hidden:!1}),t,o),f.setAttributes(u,!0);y+=w}for(s=k.getCount(),t=0;t<s;t++)!h[t/c>>0]&&k.getAt(t)&&k.getAt(t).hide(!0);if(ct)for(lt=g.length,e=0;e<s;e++)if(!h[e/c>>0])for(r=0;r<lt;r++)g[r].getAt(e)&&g[r].getAt(e).hide(!0);n.renderLabels();n.renderCallouts()},onCreateLabel:function(n,t){var i=this,u=i.labelsGroup,f=i.label,o=i.centerX,s=i.centerY,r=t.middle,e=Ext.apply(i.seriesLabelStyle||{},f||{});return i.chart.surface.add(Ext.apply({type:"text","text-anchor":"middle",group:u,x:r.x,y:r.y},e))},onPlaceLabel:function(n,t,i,r,u,f,e){function tt(n){return n<0&&(n+=360),n%360}var h=this,it=h.chart,rt=it.resizing,d=h.label,ut=d.renderer,ft=d.field,g=h.centerX,nt=h.centerY,a=i.middle,s={x:a.x,y:a.y},y=a.x-g,p=a.y-nt,v=1,c=Math.atan2(p,y||1),o=c*180/Math.PI,l,w,b,k;s.hidden=!1;this.__excludes&&this.__excludes[r]&&(s.hidden=!0);n.setAttributes({text:ut(t.get(ft),n,t,i,r,u,f,e)},!0);switch(u){case"outside":v=Math.sqrt(y*y+p*p)*2;n.setAttributes({rotation:{degrees:0}},!0);w=n.getBBox();b=w.width/2*Math.cos(c)+4;k=w.height/2*Math.sin(c)+4;v+=Math.sqrt(b*b+k*k);s.x=v*Math.cos(c)+g;s.y=v*Math.sin(c)+nt;break;case"rotate":o=tt(o);o=o>90&&o<270?o+180:o;l=n.attr.rotation.degrees;l!=null&&Math.abs(l-o)>180*.5?(o>l?o-=360:o+=360,o=o%360):o=tt(o);s.rotate={degrees:o,x:s.x,y:s.y}}if(s.translate={x:0,y:0},f&&!rt&&(u!="rotate"||l!=null))h.onAnimate(n,{to:s});else n.setAttributes(s,!0);n._from={}},onPlaceCallout:function(n,t,i){var h=this,b=h.chart,c=h.centerX,l=h.centerY,a=i.middle,r={x:a.x,y:a.y},o=a.x-c,s=a.y-l,y=1,p,v=Math.atan2(s,o||1),u=n&&n.label?n.label.getBBox():{width:0,height:0},e=10,f=10,w;if(u.width&&u.height){if(y=i.endRho+20,p=(i.endRho+i.startRho)/2+(i.endRho-i.startRho)/3,r.x=y*Math.cos(v)+c,r.y=y*Math.sin(v)+l,o=p*Math.cos(v),s=p*Math.sin(v),b.animate){h.onAnimate(n.lines,{to:{path:["M",o+c,s+l,"L",r.x,r.y,"Z","M",r.x,r.y,"l",o>0?e:-e,0,"z"]}});h.onAnimate(n.box,{to:{x:r.x+(o>0?e:-(e+u.width+2*f)),y:r.y+(s>0?-u.height-f/2:-u.height-f/2),width:u.width+2*f,height:u.height+2*f}});h.onAnimate(n.label,{to:{x:r.x+(o>0?e+f:-(e+u.width+f)),y:r.y+(s>0?-u.height/4:-u.height/4)}})}else n.lines.setAttributes({path:["M",o+c,s+l,"L",r.x,r.y,"Z","M",r.x,r.y,"l",o>0?e:-e,0,"z"]},!0),n.box.setAttributes({x:r.x+(o>0?e:-(e+u.width+2*f)),y:r.y+(s>0?-u.height-f/2:-u.height-f/2),width:u.width+2*f,height:u.height+2*f},!0),n.label.setAttributes({x:r.x+(o>0?e+f:-(e+u.width+f)),y:r.y+(s>0?-u.height/4:-u.height/4)},!0);for(w in n)n[w].show(!0)}},onAnimate:function(n){return n.show(),this.callParent(arguments)},isItemInPoint:function(n,t,i){var r=this,f=r.centerX,e=r.centerY,o=Math.abs,s=o(n-f),h=o(t-e),l=i.startAngle,a=i.endAngle,c=Math.sqrt(s*s+h*h),u=Math.atan2(t-e,n-f)/r.rad;return u>r.firstAngle&&(u-=r.accuracy),u<=l&&u>a&&c>=i.startRho&&c<=i.endRho},hideAll:function(n){var i,o,u,f,t,r,e;for(n=(isNaN(this._index)?n:this._index)||0,this.__excludes=this.__excludes||[],this.__excludes[n]=!0,e=this.slices[n].sprite,t=0,r=e.length;t<r;t++)e[t].setAttributes({hidden:!0},!0);if(this.slices[n].shadowAttrs)for(i=0,f=this.slices[n].shadowAttrs,o=f.length;i<o;i++)for(u=f[i],t=0,r=u.length;t<r;t++)u[t].setAttributes({hidden:!0},!0);this.drawSeries()},showAll:function(n){n=(isNaN(this._index)?n:this._index)||0;this.__excludes[n]=!1;this.drawSeries()},highlightItem:function(n){var t=this,k=t.rad,s,h,c,u,l,f,w,a,v,e,b,d,o,y,p,i,r;if((n=n||this.items[this._index],this.unHighlightItem(),n&&!t.animating&&(!n.sprite||!n.sprite._animating))&&(t.callParent([n]),t.highlight)&&"segment"in t.highlightCfg&&(s=t.highlightCfg.segment,h=t.chart.animate,t.labelsGroup&&(b=t.labelsGroup,d=t.label.display,o=b.getAt(n.index),y=(n.startAngle+n.endAngle)/2*k,p=s.margin||0,i=p*Math.cos(y),r=p*Math.sin(y),Math.abs(i)<1e-10&&(i=0),Math.abs(r)<1e-10&&(r=0),h?(o.stopAnimation(),o.animate({to:{translate:{x:i,y:r}},duration:t.highlightDuration})):o.setAttributes({translate:{x:i,y:r}},!0)),t.chart.shadow&&n.shadows))for(u=0,l=n.shadows,w=l.length;u<w;u++){f=l[u];a={};v=n.sprite._from.segment;for(e in v)e in s||(a[e]=v[e]);c={segment:Ext.applyIf(a,t.highlightCfg.segment)};h?(f.stopAnimation(),f.animate({to:c,duration:t.highlightDuration})):f.setAttributes(c,!0)}},unHighlightItem:function(){var n=this,s,h,w,c,b,u,f,k,d,e,r,l,a,v,y,o,t,i,p;if(n.highlight){if("segment"in n.highlightCfg&&n.items)for(s=n.items,h=n.chart.animate,w=!!n.chart.shadow,c=n.labelsGroup,b=s.length,u=0,f=0,k=n.label.display;u<b;u++)if((t=s[u],t)&&(v=t.sprite,v&&v._highlighted&&(c&&(i=c.getAt(t.index),p=Ext.apply({translate:{x:0,y:0}},k=="rotate"?{rotate:{x:i.attr.x,y:i.attr.y,degrees:i.attr.rotation.degrees}}:{}),h?(i.stopAnimation(),i.animate({to:p,duration:n.highlightDuration})):i.setAttributes(p,!0)),w)))for(y=t.shadows,d=y.length;f<d;f++){r={};l=t.sprite._to.segment;a=t.sprite._from.segment;Ext.apply(r,a);for(e in l)e in a||(r[e]=l[e]);o=y[f];h?(o.stopAnimation(),o.animate({to:{segment:r},duration:n.highlightDuration})):o.setAttributes({segment:r},!0)}n.callParent(arguments)}},getLegendColor:function(n){var t=this;return t.colorSet&&t.colorSet[n%t.colorSet.length]||t.colorArrayStyle[n%t.colorArrayStyle.length]}})