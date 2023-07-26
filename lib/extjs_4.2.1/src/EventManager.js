Ext.EventManager=new function(){var n=this,t=document,r=window,e=/\\/g,u=Ext.baseCSSPrefix,f=!Ext.isIE9&&"addEventListener"in t,i,o=function(){function n(n){e.push(u+n)}var r=t.body||t.getElementsByTagName("body")[0],e=[u+"body"],i=[],o=Ext.supports.CSS3LinearGradient,s=Ext.supports.CSS3BorderRadius,f;return r?(f=r.parentNode,Ext.isIE&&Ext.isIE9m&&(n("ie"),Ext.isIE6?n("ie6"):(n("ie7p"),Ext.isIE7?n("ie7"):(n("ie8p"),Ext.isIE8?n("ie8"):(n("ie9p"),Ext.isIE9&&n("ie9")))),Ext.isIE7m&&n("ie7m"),Ext.isIE8m&&n("ie8m"),Ext.isIE9m&&n("ie9m"),(Ext.isIE7||Ext.isIE8)&&n("ie78")),Ext.isIE10&&n("ie10"),Ext.isGecko&&(n("gecko"),Ext.isGecko3&&n("gecko3"),Ext.isGecko4&&n("gecko4"),Ext.isGecko5&&n("gecko5")),Ext.isOpera&&n("opera"),Ext.isWebKit&&n("webkit"),Ext.isSafari&&(n("safari"),Ext.isSafari2&&n("safari2"),Ext.isSafari3&&n("safari3"),Ext.isSafari4&&n("safari4"),Ext.isSafari5&&n("safari5"),Ext.isSafari5_0&&n("safari5_0")),Ext.isChrome&&n("chrome"),Ext.isMac&&n("mac"),Ext.isLinux&&n("linux"),s||n("nbr"),o||n("nlg"),f&&(Ext.isBorderBox=Ext.isStrict&&(Ext.isIE6||Ext.isIE7)?!1:!0,Ext.isBorderBox||i.push(u+"content-box"),Ext.isStrict?i.push(u+"strict"):i.push(u+"quirks"),Ext.fly(f,"_internal").addCls(i)),Ext.fly(r,"_internal").addCls(e),!0):!1};Ext.apply(n,{hasBoundOnReady:!1,hasFiredReady:!1,deferReadyEvent:1,onReadyChain:[],readyEvent:function(){return i=new Ext.util.Event,i.fire=function(){Ext._beforeReadyTime=Ext._beforeReadyTime||(new Date).getTime();i.self.prototype.fire.apply(i,arguments);Ext._afterReadytime=(new Date).getTime()},i}(),idleEvent:new Ext.util.Event,isReadyPaused:function(){return/[?&]ext-pauseReadyFire\b/i.test(location.search)&&!Ext._continueFireReady},bindReadyEvent:function(){if(!n.hasBoundOnReady)if(t.readyState=="complete")n.onReadyEvent({type:t.readyState||"body"});else t.addEventListener("DOMContentLoaded",n.onReadyEvent,!1),r.addEventListener("load",n.onReadyEvent,!1),n.hasBoundOnReady=!0},onReadyEvent:function(i){i&&i.type&&n.onReadyChain.push(i.type);n.hasBoundOnReady&&(t.removeEventListener("DOMContentLoaded",n.onReadyEvent,!1),r.removeEventListener("load",n.onReadyEvent,!1));Ext.isReady||n.fireDocReady()},fireDocReady:function(){Ext.isReady||(Ext._readyTime=(new Date).getTime(),Ext.isReady=!0,Ext.supports.init(),n.onWindowUnload(),i.onReadyChain=n.onReadyChain,Ext.isNumber(n.deferReadyEvent)?(Ext.Function.defer(n.fireReadyEvent,n.deferReadyEvent),n.hasDocReadyTimer=!0):n.fireReadyEvent())},fireReadyEvent:function(){for(n.hasDocReadyTimer=!1,n.isFiring=!0;i.listeners.length&&!n.isReadyPaused();)i.fire();n.isFiring=!1;n.hasFiredReady=!0;Ext.EventManager.idleEvent.fire()},onDocumentReady:function(t,r,u){u=u||{};u.single=!0;i.addListener(t,r,u);n.isFiring||n.hasDocReadyTimer||(Ext.isReady?n.fireReadyEvent():n.bindReadyEvent())},stoppedMouseDownEvent:new Ext.util.Event,propRe:/^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate|freezeEvent)$/,getId:function(n){var i;return n=Ext.getDom(n),i=n===t||n===r?n===t?Ext.documentId:Ext.windowId:Ext.id(n),Ext.cache[i]||Ext.addCacheEntry(i,null,n),i},prepareListenerConfig:function(t,i,r){var o=n.propRe,u,f,e;for(u in i)i.hasOwnProperty(u)&&(o.test(u)||(f=i[u],e=typeof f=="function"?[t,u,f,i.scope,i]:[t,u,f.fn,f.scope,f],r?n.removeListener.apply(n,e):n.addListener.apply(n,e)))},mouseEnterLeaveRe:/mouseenter|mouseleave/,normalizeEvent:function(t,i){return n.mouseEnterLeaveRe.test(t)&&!Ext.supports.MouseEnterLeave?(i&&(i=Ext.Function.createInterceptor(i,n.contains)),t=t=="mouseenter"?"mouseover":"mouseout"):t!="mousewheel"||Ext.supports.MouseWheel||Ext.isOpera||(t="DOMMouseScroll"),{eventName:t,fn:i}},contains:function(t){t=t.browserEvent||t;var r=t.currentTarget,i=n.getRelatedTarget(t);if(r&&r.firstChild)while(i){if(i===r)return!1;i=i.parentNode;i&&i.nodeType!=1&&(i=null)}return!0},addListener:function(i,r,u,e,o){if(typeof r!="string"){n.prepareListenerConfig(i,r);return}var s=i.dom||Ext.getDom(i),a,v,c,l,h,y,p;typeof u=="string"&&(u=Ext.resolveMethod(u,e||i));u||Ext.Error.raise({sourceClass:"Ext.EventManager",sourceMethod:"addListener",targetElement:i,eventName:r,msg:'Error adding "'+r+'" listener. The handler function is undefined.'});o=o||{};v=n.normalizeEvent(r,u);c=n.createListenerWrap(s,r,v.fn,e,o);l=n.getEventListenerCache(i.dom?i:s,r);r=v.eventName;a=f||Ext.isIE9&&!s.attachEvent;a||(h=n.normalizeId(s),h&&(y=Ext.cache[h][r],y&&y.firing&&(l=n.cloneEventListenerCache(s,r))));p=!!o.capture;l.push({fn:u,wrap:c,scope:e,capture:p});a?s.addEventListener(r,c,p):l.length===1&&(h=n.normalizeId(s,!0),u=Ext.Function.bind(n.handleSingleEvent,n,[h,r],!0),Ext.cache[h][r]={firing:!1,fn:u},s.attachEvent("on"+r,u));s==t&&r=="mousedown"&&n.stoppedMouseDownEvent.addListener(c)},normalizeId:function(t,i){var r;return r=t===document?Ext.documentId:t===window?Ext.windowId:t.id,!r&&i&&(r=n.getId(t)),r},handleSingleEvent:function(t,i,r){var e=n.getEventListenerCache(i,r),f=Ext.cache[i][r],o,u;if(!f.firing){for(f.firing=!0,u=0,o=e.length;u<o;++u)e[u].wrap(t);f.firing=!1}},removeListener:function(i,r,u,e){if(typeof r!="string"){n.prepareListenerConfig(i,r,!0);return}var s=Ext.getDom(i),y,b=i.dom?i:Ext.get(s),c=n.getEventListenerCache(b,r),l=n.normalizeEvent(r).eventName,p=c.length,a,v,w,h,o;if(s)for(w=f||Ext.isIE9&&!s.detachEvent,typeof u=="string"&&(u=Ext.resolveMethod(u,e||i));p--;)if(h=c[p],h&&(!u||h.fn==u)&&(!e||h.scope===e)){if(o=h.wrap,o.task&&(clearTimeout(o.task),delete o.task),a=o.tasks&&o.tasks.length,a){while(a--)clearTimeout(o.tasks[a]);delete o.tasks}w?s.removeEventListener(l,o,h.capture):(y=n.normalizeId(s,!0),v=Ext.cache[y][l],v&&v.firing&&(c=n.cloneEventListenerCache(s,l)),c.length===1&&(u=v.fn,delete Ext.cache[y][l],s.detachEvent("on"+l,u)));o&&s==t&&r=="mousedown"&&n.stoppedMouseDownEvent.removeListener(o);Ext.Array.erase(c,p,1)}},removeAll:function(t){var f=typeof t=="string"?t:t.id,i,r,u;if(f&&(i=Ext.cache[f])){r=i.events;for(u in r)r.hasOwnProperty(u)&&n.removeListener(t,u);i.events={}}},purgeElement:function(t,i){var r=Ext.getDom(t),u=0,e,f;if(i?n.removeListener(t,i):n.removeAll(t),r&&r.childNodes)for(f=r.childNodes,e=f.length;u<e;u++)n.purgeElement(f[u],i)},createListenerWrap:function(t,i,r,u,f){f=f||{};var o,s,h=function(c,l){return s||(o=["if(!"+Ext.name+") {return;}"],f.buffer||f.delay||f.freezeEvent?(f.freezeEvent&&o.push("e = X.EventObject.setEvent(e);"),o.push("e = new X.EventObjectImpl(e, "+(f.freezeEvent?"true":"false")+");")):o.push("e = X.EventObject.setEvent(e);"),f.delegate?(o.push('var result, t = e.getTarget("'+(f.delegate+"").replace(e,"\\\\")+'", this);'),o.push("if(!t) {return;}")):o.push("var t = e.target, result;"),f.target&&o.push("if(e.target !== options.target) {return;}"),f.stopEvent?o.push("e.stopEvent();"):(f.preventDefault&&o.push("e.preventDefault();"),f.stopPropagation&&o.push("e.stopPropagation();")),f.normalized===!1&&o.push("e = e.browserEvent;"),f.buffer&&(o.push("(wrap.task && clearTimeout(wrap.task));"),o.push("wrap.task = setTimeout(function() {")),f.delay&&(o.push("wrap.tasks = wrap.tasks || [];"),o.push("wrap.tasks.push(setTimeout(function() {")),o.push("result = fn.call(scope || dom, e, t, options);"),f.single&&o.push("evtMgr.removeListener(dom, ename, fn, scope);"),i!=="mousemove"&&i!=="unload"&&(o.push("if (evtMgr.idleEvent.listeners.length) {"),o.push("evtMgr.idleEvent.fire();"),o.push("}")),f.delay&&o.push("}, "+f.delay+"));"),f.buffer&&o.push("}, "+f.buffer+");"),o.push("return result;"),s=Ext.cacheableFunctionFactory("e","options","fn","scope","ename","dom","wrap","args","X","evtMgr",o.join("\n"))),s.call(t,c,f,r,u,i,t,h,l,Ext,n)};return h},getEventCache:function(t){var i,r;return t?(t.$cache?i=t.$cache:(r=typeof t=="string"?t:n.getId(t),i=Ext.cache[r]),i.events||(i.events={})):[]},getEventListenerCache:function(t,i){var r=n.getEventCache(t);return r[i]||(r[i]=[])},cloneEventListenerCache:function(t,i){var r=n.getEventCache(t),u;return u=r[i]?r[i].slice(0):[],r[i]=u,u},mouseLeaveRe:/(mouseout|mouseleave)/,mouseEnterRe:/(mouseover|mouseenter)/,stopEvent:function(t){n.stopPropagation(t);n.preventDefault(t)},stopPropagation:function(n){n=n.browserEvent||n;n.stopPropagation?n.stopPropagation():n.cancelBubble=!0},preventDefault:function(n){if(n=n.browserEvent||n,n.preventDefault)n.preventDefault();else{n.returnValue=!1;try{(n.ctrlKey||n.keyCode>111&&n.keyCode<124)&&(n.keyCode=-1)}catch(t){}}},getRelatedTarget:function(t){t=t.browserEvent||t;var i=t.relatedTarget;return i||(n.mouseLeaveRe.test(t.type)?i=t.toElement:n.mouseEnterRe.test(t.type)&&(i=t.fromElement)),n.resolveTextNode(i)},getPageX:function(t){return n.getPageXY(t)[0]},getPageY:function(t){return n.getPageXY(t)[1]},getPageXY:function(n){n=n.browserEvent||n;var u=n.pageX,f=n.pageY,i=t.documentElement,r=t.body;return u||u===0||(u=n.clientX+(i&&i.scrollLeft||r&&r.scrollLeft||0)-(i&&i.clientLeft||r&&r.clientLeft||0),f=n.clientY+(i&&i.scrollTop||r&&r.scrollTop||0)-(i&&i.clientTop||r&&r.clientTop||0)),[u,f]},getTarget:function(t){return t=t.browserEvent||t,n.resolveTextNode(t.target||t.srcElement)},resolveTextNode:Ext.isGecko?function(n){if(n){var t=HTMLElement.prototype.toString.call(n);if(t!=="[xpconnect wrapped native prototype]"&&t!=="[object XULElement]")return n.nodeType==3?n.parentNode:n}}:function(n){return n&&n.nodeType==3?n.parentNode:n},curWidth:0,curHeight:0,onWindowResize:function(t,i,u){var f=n.resizeEvent;if(!f){n.resizeEvent=f=new Ext.util.Event;n.on(r,"resize",n.fireResize,null,{buffer:100})}f.addListener(t,i,u)},fireResize:function(){var t=Ext.Element.getViewWidth(),i=Ext.Element.getViewHeight();(n.curHeight!=i||n.curWidth!=t)&&(n.curHeight=i,n.curWidth=t,n.resizeEvent.fire(t,i))},removeResizeListener:function(t,i){var r=n.resizeEvent;r&&r.removeListener(t,i)},onWindowUnload:function(t,i,u){var f=n.unloadEvent;f||(n.unloadEvent=f=new Ext.util.Event,n.addListener(r,"unload",n.fireUnload));t&&f.addListener(t,i,u)},fireUnload:function(){try{t=r=undefined;var u,i,o,f,e;if(n.unloadEvent.fire(),Ext.isGecko3)for(u=Ext.ComponentQuery.query("gridview"),i=0,o=u.length;i<o;i++)u[i].scrollToTop();e=Ext.cache;for(f in e)e.hasOwnProperty(f)&&n.removeAll(f)}catch(s){}},removeUnloadListener:function(t,i){var r=n.unloadEvent;r&&r.removeListener(t,i)},useKeyDown:Ext.isWebKit?parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1],10)>=525:!(Ext.isGecko&&!Ext.isWindows||Ext.isOpera),getKeyEvent:function(){return n.useKeyDown?"keydown":"keypress"}});!f&&document.attachEvent&&Ext.apply(n,{pollScroll:function(){var t=!0;try{document.documentElement.doScroll("left")}catch(i){t=!1}if(t&&document.body)n.onReadyEvent({type:"doScroll"});else n.scrollTimeout=setTimeout(n.pollScroll,20);return t},scrollTimeout:null,readyStatesRe:/complete/i,checkReadyState:function(){var t=document.readyState;if(n.readyStatesRe.test(t))n.onReadyEvent({type:t})},bindReadyEvent:function(){var i=!0;if(!n.hasBoundOnReady){try{i=window.frameElement===undefined}catch(r){i=!1}if(i&&t.documentElement.doScroll||(n.pollScroll=Ext.emptyFn),n.pollScroll()!==!0)if(t.readyState=="complete")n.onReadyEvent({type:"already "+(t.readyState||"body")});else t.attachEvent("onreadystatechange",n.checkReadyState),window.attachEvent("onload",n.onReadyEvent),n.hasBoundOnReady=!0}},onReadyEvent:function(t){t&&t.type&&n.onReadyChain.push(t.type);n.hasBoundOnReady&&(document.detachEvent("onreadystatechange",n.checkReadyState),window.detachEvent("onload",n.onReadyEvent));Ext.isNumber(n.scrollTimeout)&&(clearTimeout(n.scrollTimeout),delete n.scrollTimeout);Ext.isReady||n.fireDocReady()},onReadyChain:[]});Ext.onReady=function(n,t,i){Ext.Loader.onReady(n,t,!0,i)};Ext.onDocumentReady=n.onDocumentReady;n.on=n.addListener;n.un=n.removeListener;Ext.onReady(o)}