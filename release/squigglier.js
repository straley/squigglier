!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define("Squigglier",[],e):"object"==typeof exports?exports.Squigglier=e():t.Squigglier=e()}(window,function(){return function(t){var e={};function n(r){if(e[r])return e[r].exports;var i=e[r]={i:r,l:!1,exports:{}};return t[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=t,n.c=e,n.d=function(t,e,r){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:r})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var i in t)n.d(r,i,function(e){return t[e]}.bind(null,i));return r},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=1)}([function(t,e,n){"use strict";e.__esModule=!0;var r=["circle","ellipse","line","path","polygon","polyline","rect","text"],i=function(){function t(){}return t.svgOverride=function(t,e){for(var n=0,r=Object.keys(e);n<r.length;n++){var i=r[n];t.setAttribute(i,e[i])}for(var o in t.childNodes){var a=t.childNodes[o];a instanceof SVGElement&&this.svgOverride(a,e)}},t.inspectSvg=function(t,e){if(void 0===e&&(e={paths:[]}),-1!==r.indexOf(t.tagName))return e.paths.push(t),e;if("g"===t.tagName||"svg"===t.tagName)for(var n in t.childNodes)e=this.inspectSvg(t.childNodes[n],e);return e},t}();e.Animate=i},function(t,e,n){t.exports=n(2)},function(t,e,n){"use strict";e.__esModule=!0;var r=n(3);document.addEventListener("DOMContentLoaded",function(){return new r.Loader(document.getElementsByTagName("svg"))})},function(t,e,n){"use strict";e.__esModule=!0;var r=n(4),i=n(5),o=function(){function t(t){for(var e in t)this.loadSrc(t[e])}return t.prototype.loadObject=function(t,e){var n=new XMLHttpRequest;n.open("GET",t,!0),n.send(),n.onload=function(){e(n.responseXML.firstChild)}},t.prototype.parseSettings=function(t){for(var e=t.split(/\s+/),n=e.shift(),r={},i=0,o=e;i<o.length;i++){var a=o[i].split(/=/),s=a[0],u=a[1];r[s]=u}return[n,r]},t.prototype.loadSrc=function(t){var e=this;!t.getAttribute&&Array.isArray(t)&&(t=t[0]);var n="function"==typeof t.getAttribute&&t.getAttribute("src");n&&this.loadObject(n,function(n){for(var o=n.attributes,a=[],s=[],u=0,f=Object.keys(t.attributes);u<f.length;u++){var c=f[u],l=t.attributes[c];if(!o.hasOwnProperty(l.name)){switch(l.name){case"animation":l.value.split(/\s*;\s*/).forEach(function(t){return a.push(e.parseSettings(t))});break;case"filter":l.value.split(/\s*;\s*/).forEach(function(t){return s.push(e.parseSettings(t))})}n.setAttribute(l.name,l.value)}}for(var d=0,p=a;d<p.length;d++){var h=p[d],v=h[0],g=h[1];"function"==typeof r.Animations[v]&&r.Animations[v](n,g)}for(var m=0,y=s;m<y.length;m++){var b=y[m];v=b[0],g=b[1];"function"==typeof i.Filters[v]&&i.Filters[v](n,g)}t.outerHTML=n.outerHTML})},t}();e.Loader=o},function(t,e,n){"use strict";e.__esModule=!0;var r=n(0),i=function(){function t(){}return t.expandSettingValue=function(t,e){return t?t.split(e).reduce(function(t,e){var n=e.split(/:/);return t[n[0]]=!(n.length>1)||n[1],t},{}):{}},t.checkIgnore=function(t,e,n,r){for(var i in n){var o=t.getAttribute(i)||e[i];if(r(n[i],o))return!0}return!1},t.applyValidPaths=function(e,n){void 0===n&&(n={});var i=r.Animate.inspectSvg(e),o={},a=t.expandSettingValue(n.limit,/[\,\&]/),s=t.expandSettingValue(n.exclude,/[\,\&]/);for(var u in i.paths){var f=i.paths[u],c=t.expandSettingValue(f.getAttribute("style"),/\s*;\s*/);t.checkIgnore(f,c,a,function(t,e){return t!==(null==e?"default":e)})||t.checkIgnore(f,c,s,function(t,e){return t===(null==e?"default":e)})||(o[u]=f)}return o},t.defaultFloat=function(t,e){return null!=t&&parseFloat(t)?parseFloat(t):e},t.freehand=function(e,n){void 0===n&&(n={});var r=e.getAttribute("id"),i=this.defaultFloat(n.width,30),o=this.defaultFloat(n.duration,3),a=this.defaultFloat(n.minLength,0),s=document.styleSheets&&document.styleSheets[0];if(s){var u=document.createElement("defs"),f=a,c=0,l=0,d=t.applyValidPaths(e,n);Object.keys(d).forEach(function(t){var e=d[t].getTotalLength();l+=Math.min(e/c*o,.25*o),e>=a&&(c+=e)});var p=o/l;Object.keys(d).forEach(function(t){var e=d[t],n=e.getTotalLength();if(f=Math.max(f,n),n<a)e.classList.add(r+"-tiny-"+t);else{var i=document.createElement("mask");i.setAttribute("id",r+"-mask-"+t),i.setAttribute("maskUnits","userSpaceOnUse");var o=document.createElement("path");o.setAttribute("d",e.getAttribute("d")),o.classList.add(r+"-mask"),i.append(o),u.append(i),e.setAttribute("mask","url(#"+r+"-mask-"+t+")")}}),e.insertAdjacentElement("afterbegin",u);var h=0;Object.keys(d).sort(function(t,e){return d[t].getTotalLength()>d[e].getTotalLength()?-1:1}).forEach(function(t){var e=d[t].getTotalLength(),n=e>=a?e/c*o*p:0;if(e<a)return s.insertRule("\n            @keyframes "+r+"-freehand-"+t+" {\n              from { opacity: 0; }\n              to { opacity: 1; }\n            }\n          "),s.insertRule("\n            ."+r+"-tiny-"+t+" {\n              opacity: 0;\n              animation: "+r+"-freehand-"+t+" "+n+"s linear forwards;\n              animation-delay: "+h+"s;\n            }\n          "),void(h+=n||.5);s.insertRule("\n          @keyframes "+r+"-freehand-"+t+" {\n            from { stroke-dashoffset: "+e+"; }\n            to { stroke-dashoffset: 0; }\n          }\n        "),s.insertRule("\n          #"+r+"-mask-"+t+" {\n            fill: none;\n            stroke: white;\n            stroke-width: "+i+";\n            stroke-dasharray: "+e+" "+e+";\n            stroke-dashoffset: "+e+";\n            animation: "+r+"-freehand-"+t+" "+n+"s linear forwards;\n            animation-delay: "+h+"s;\n          }\n        "),h+=Math.min(n,.25*o)})}},t.fillin=function(t,e){if(void 0===e&&(e={}),document.styleSheets&&document.styleSheets[0]){var n=this.applyValidPaths(t,e);Object.keys(n).forEach(function(t){n[t].setAttribute("opacity","0")})}},t}();e.Animations=i},function(t,e,n){"use strict";e.__esModule=!0;var r=n(0),i=function(){function t(){}return t.animate=function(t,e){void 0===e&&(e={}),r.Animate.svgOverride(t,e)},t}();e.Filters=i}])});
//# sourceMappingURL=squigglier.js.map