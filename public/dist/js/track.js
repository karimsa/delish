!function e(t,n,r){function o(u,c){if(!n[u]){if(!t[u]){var s="function"==typeof require&&require;if(!c&&s)return s(u,!0);if(i)return i(u,!0);var l=new Error("Cannot find module '"+u+"'");throw l.code="MODULE_NOT_FOUND",l}var a=n[u]={exports:{}};t[u][0].call(a.exports,function(e){var n=t[u][1][e];return o(n?n:e)},a,a.exports,e,t,n,r)}return n[u].exports}for(var i="function"==typeof require&&require,u=0;u<r.length;u++)o(r[u]);return o}({1:[function(e,t,n){function r(){throw new Error("setTimeout has not been defined")}function o(){throw new Error("clearTimeout has not been defined")}function i(e){if(f===setTimeout)return setTimeout(e,0);if((f===r||!f)&&setTimeout)return f=setTimeout,setTimeout(e,0);try{return f(e,0)}catch(t){try{return f.call(null,e,0)}catch(t){return f.call(this,e,0)}}}function u(e){if(p===clearTimeout)return clearTimeout(e);if((p===o||!p)&&clearTimeout)return p=clearTimeout,clearTimeout(e);try{return p(e)}catch(t){try{return p.call(null,e)}catch(t){return p.call(this,e)}}}function c(){h&&g&&(h=!1,g.length?y=g.concat(y):m=-1,y.length&&s())}function s(){if(!h){var e=i(c);h=!0;for(var t=y.length;t;){for(g=y,y=[];++m<t;)g&&g[m].run();m=-1,t=y.length}g=null,h=!1,u(e)}}function l(e,t){this.fun=e,this.array=t}function a(){}var f,p,d=t.exports={};!function(){try{f="function"==typeof setTimeout?setTimeout:r}catch(e){f=r}try{p="function"==typeof clearTimeout?clearTimeout:o}catch(e){p=o}}();var g,y=[],h=!1,m=-1;d.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var n=1;n<arguments.length;n++)t[n-1]=arguments[n];y.push(new l(e,t)),1!==y.length||h||i(s)},l.prototype.run=function(){this.fun.apply(null,this.array)},d.title="browser",d.browser=!0,d.env={},d.argv=[],d.version="",d.versions={},d.on=a,d.addListener=a,d.once=a,d.off=a,d.removeListener=a,d.removeAllListeners=a,d.emit=a,d.binding=function(e){throw new Error("process.binding is not supported")},d.cwd=function(){return"/"},d.chdir=function(e){throw new Error("process.chdir is not supported")},d.umask=function(){return 0}},{}],2:[function(e,t,n){"function"==typeof Object.create?t.exports=function(e,t){e.super_=t,e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}})}:t.exports=function(e,t){e.super_=t;var n=function(){};n.prototype=t.prototype,e.prototype=new n,e.prototype.constructor=e}},{}],3:[function(e,t,n){t.exports=function(e){return e&&"object"==typeof e&&"function"==typeof e.copy&&"function"==typeof e.fill&&"function"==typeof e.readUInt8}},{}],4:[function(e,t,n){(function(t,r){function o(e,t){var r={seen:[],stylize:u};return arguments.length>=3&&(r.depth=arguments[2]),arguments.length>=4&&(r.colors=arguments[3]),y(t)?r.showHidden=t:t&&n._extend(r,t),x(r.showHidden)&&(r.showHidden=!1),x(r.depth)&&(r.depth=2),x(r.colors)&&(r.colors=!1),x(r.customInspect)&&(r.customInspect=!0),r.colors&&(r.stylize=i),s(r,e,r.depth)}function i(e,t){var n=o.styles[t];return n?"["+o.colors[n][0]+"m"+e+"["+o.colors[n][1]+"m":e}function u(e,t){return e}function c(e){var t={};return e.forEach(function(e,n){t[e]=!0}),t}function s(e,t,r){if(e.customInspect&&t&&S(t.inspect)&&t.inspect!==n.inspect&&(!t.constructor||t.constructor.prototype!==t)){var o=t.inspect(r,e);return b(o)||(o=s(e,o,r)),o}var i=l(e,t);if(i)return i;var u=Object.keys(t),y=c(u);if(e.showHidden&&(u=Object.getOwnPropertyNames(t)),T(t)&&(u.indexOf("message")>=0||u.indexOf("description")>=0))return a(t);if(0===u.length){if(S(t)){var h=t.name?": "+t.name:"";return e.stylize("[Function"+h+"]","special")}if(O(t))return e.stylize(RegExp.prototype.toString.call(t),"regexp");if(E(t))return e.stylize(Date.prototype.toString.call(t),"date");if(T(t))return a(t)}var m="",v=!1,w=["{","}"];if(g(t)&&(v=!0,w=["[","]"]),S(t)){m=" [Function"+(t.name?": "+t.name:"")+"]"}if(O(t)&&(m=" "+RegExp.prototype.toString.call(t)),E(t)&&(m=" "+Date.prototype.toUTCString.call(t)),T(t)&&(m=" "+a(t)),0===u.length&&(!v||0==t.length))return w[0]+m+w[1];if(r<0)return O(t)?e.stylize(RegExp.prototype.toString.call(t),"regexp"):e.stylize("[Object]","special");e.seen.push(t);var x;return x=v?f(e,t,r,y,u):u.map(function(n){return p(e,t,r,y,n,v)}),e.seen.pop(),d(x,m,w)}function l(e,t){if(x(t))return e.stylize("undefined","undefined");if(b(t)){var n="'"+JSON.stringify(t).replace(/^"|"$/g,"").replace(/'/g,"\\'").replace(/\\"/g,'"')+"'";return e.stylize(n,"string")}return v(t)?e.stylize(""+t,"number"):y(t)?e.stylize(""+t,"boolean"):h(t)?e.stylize("null","null"):void 0}function a(e){return"["+Error.prototype.toString.call(e)+"]"}function f(e,t,n,r,o){for(var i=[],u=0,c=t.length;u<c;++u)k(t,String(u))?i.push(p(e,t,n,r,String(u),!0)):i.push("");return o.forEach(function(o){o.match(/^\d+$/)||i.push(p(e,t,n,r,o,!0))}),i}function p(e,t,n,r,o,i){var u,c,l;if(l=Object.getOwnPropertyDescriptor(t,o)||{value:t[o]},l.get?c=l.set?e.stylize("[Getter/Setter]","special"):e.stylize("[Getter]","special"):l.set&&(c=e.stylize("[Setter]","special")),k(r,o)||(u="["+o+"]"),c||(e.seen.indexOf(l.value)<0?(c=h(n)?s(e,l.value,null):s(e,l.value,n-1),c.indexOf("\n")>-1&&(c=i?c.split("\n").map(function(e){return"  "+e}).join("\n").substr(2):"\n"+c.split("\n").map(function(e){return"   "+e}).join("\n"))):c=e.stylize("[Circular]","special")),x(u)){if(i&&o.match(/^\d+$/))return c;u=JSON.stringify(""+o),u.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)?(u=u.substr(1,u.length-2),u=e.stylize(u,"name")):(u=u.replace(/'/g,"\\'").replace(/\\"/g,'"').replace(/(^"|"$)/g,"'"),u=e.stylize(u,"string"))}return u+": "+c}function d(e,t,n){var r=0;return e.reduce(function(e,t){return r++,t.indexOf("\n")>=0&&r++,e+t.replace(/\u001b\[\d\d?m/g,"").length+1},0)>60?n[0]+(""===t?"":t+"\n ")+" "+e.join(",\n  ")+" "+n[1]:n[0]+t+" "+e.join(", ")+" "+n[1]}function g(e){return Array.isArray(e)}function y(e){return"boolean"==typeof e}function h(e){return null===e}function m(e){return null==e}function v(e){return"number"==typeof e}function b(e){return"string"==typeof e}function w(e){return"symbol"==typeof e}function x(e){return void 0===e}function O(e){return j(e)&&"[object RegExp]"===D(e)}function j(e){return"object"==typeof e&&null!==e}function E(e){return j(e)&&"[object Date]"===D(e)}function T(e){return j(e)&&("[object Error]"===D(e)||e instanceof Error)}function S(e){return"function"==typeof e}function z(e){return null===e||"boolean"==typeof e||"number"==typeof e||"string"==typeof e||"symbol"==typeof e||void 0===e}function D(e){return Object.prototype.toString.call(e)}function $(e){return e<10?"0"+e.toString(10):e.toString(10)}function _(){var e=new Date,t=[$(e.getHours()),$(e.getMinutes()),$(e.getSeconds())].join(":");return[e.getDate(),A[e.getMonth()],t].join(" ")}function k(e,t){return Object.prototype.hasOwnProperty.call(e,t)}n.format=function(e){if(!b(e)){for(var t=[],n=0;n<arguments.length;n++)t.push(o(arguments[n]));return t.join(" ")}for(var n=1,r=arguments,i=r.length,u=String(e).replace(/%[sdj%]/g,function(e){if("%%"===e)return"%";if(n>=i)return e;switch(e){case"%s":return String(r[n++]);case"%d":return Number(r[n++]);case"%j":try{return JSON.stringify(r[n++])}catch(e){return"[Circular]"}default:return e}}),c=r[n];n<i;c=r[++n])u+=h(c)||!j(c)?" "+c:" "+o(c);return u},n.deprecate=function(e,o){function i(){if(!u){if(t.throwDeprecation)throw new Error(o);t.traceDeprecation?console.trace(o):console.error(o),u=!0}return e.apply(this,arguments)}if(x(r.process))return function(){return n.deprecate(e,o).apply(this,arguments)};if(t.noDeprecation===!0)return e;var u=!1;return i};var C,N={};n.debuglog=function(e){if(x(C)&&(C=t.env.NODE_DEBUG||""),e=e.toUpperCase(),!N[e])if(new RegExp("\\b"+e+"\\b","i").test(C)){var r=t.pid;N[e]=function(){var t=n.format.apply(n,arguments);console.error("%s %d: %s",e,r,t)}}else N[e]=function(){};return N[e]},n.inspect=o,o.colors={bold:[1,22],italic:[3,23],underline:[4,24],inverse:[7,27],white:[37,39],grey:[90,39],black:[30,39],blue:[34,39],cyan:[36,39],green:[32,39],magenta:[35,39],red:[31,39],yellow:[33,39]},o.styles={special:"cyan",number:"yellow",boolean:"yellow",undefined:"grey",null:"bold",string:"green",date:"magenta",regexp:"red"},n.isArray=g,n.isBoolean=y,n.isNull=h,n.isNullOrUndefined=m,n.isNumber=v,n.isString=b,n.isSymbol=w,n.isUndefined=x,n.isRegExp=O,n.isObject=j,n.isDate=E,n.isError=T,n.isFunction=S,n.isPrimitive=z,n.isBuffer=e("./support/isBuffer");var A=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];n.log=function(){console.log("%s - %s",_(),n.format.apply(n,arguments))},n.inherits=e("inherits"),n._extend=function(e,t){if(!t||!j(t))return e;for(var n=Object.keys(t),r=n.length;r--;)e[n[r]]=t[n[r]];return e}}).call(this,e("_process"),"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{"./support/isBuffer":3,_process:1,inherits:2}],5:[function(e,t,n){"use strict";function r(e){var t=this,n=[].slice.call(arguments);0===Math.min(u.length,c.length)?(u=$(".lead:eq(0)"),c=$(".lead.next"),setTimeout(function(){return r.apply(t,n)},0)):l?setTimeout(function(){return r.apply(t,n)},0):e(a.apply(this,n.slice(1)))}function o(){s||(s=!0,$("html").addClass("error"),r(function(e){return e.addClass("error-msg").addClass("col-8").addClass("offset-2")},"Things have gone horribly wrong. I think your computer is going to explode. But what do I know, I'm just an error message."))}Object.defineProperty(n,"__esModule",{value:!0}),n.failOnce=o;var i=e("util"),u=$(".lead:eq(0)"),c=$(".lead.next"),s=!1,l=!1,a=function e(){if(!l){l=!0;var t=i.format.apply(i,arguments);return 0===Math.min(u.length,c.length)&&(u=$(".lead:eq(0)"),c=$(".lead.next"),0===Math.min(u.length,c.length))?(l=!1,$(function(){return e(t)})):(c.text(t),u.addClass("hide"),c.removeClass("next"),setTimeout(function(){var e=u.parent();u.remove(),u=c,c=$('<p class="lead next"></p>'),e.append(c),l=!1},700),c)}};n.log=function(){if(!s)return a.apply(this,arguments)},n.fail=function(e){return trackJs.track(e)}},{util:4}],6:[function(e,t,n){"use strict";var r=e("./logger");window._trackJs={token:"dd00708cab8f4cdd9b22b9c5a656271c",onError:function(e){return"{}"!==e.message&&((0,r.failOnce)(),!0)}};var o=document.createElement("script");o.src="https://cdn.trackjs.com/releases/current/tracker.js",document.head.appendChild(o)},{"./logger":5}]},{},[6]);
//# sourceMappingURL=track.js.map