(self.webpackChunkVERO_Archive=self.webpackChunkVERO_Archive||[]).push([[528],{76528:function(){!function(){"use strict";var t,e,n,r,i=document.createElement("details"),a="undefined"!=typeof HTMLDetailsElement&&i instanceof HTMLDetailsElement,o="open"in i||a,u="ontoggle"in i,s='\ndetails, summary {\n  display: block;\n}\ndetails:not([open]) > *:not(summary) {\n  display: none;\n}\nsummary::before {\n  content: "►";\n  padding-right: 0.3rem;\n  font-size: 0.6rem;\n  cursor: default;\n}\n[open] > summary::before {\n  content: "▼";\n}\n',c=[],d=c.forEach,l=c.slice;function f(t){(function(t,e){return(t.tagName==e?[t]:[]).concat("function"==typeof t.getElementsByTagName?l.call(t.getElementsByTagName(e)):[])})(t,"SUMMARY").forEach((function(t){var e=v(t,"DETAILS");t.setAttribute("aria-expanded",e.hasAttribute("open")),t.hasAttribute("tabindex")||t.setAttribute("tabindex","0"),t.hasAttribute("role")||t.setAttribute("role","button")}))}function m(t){return!(t.defaultPrevented||t.ctrlKey||t.metaKey||t.shiftKey||t.target.isContentEditable)}function p(t){addEventListener("click",(function(e){if(m(e)&&e.which<=1){var n=v(e.target,"SUMMARY");n&&n.parentNode&&"DETAILS"==n.parentNode.tagName&&t(n.parentNode)}}),!1),addEventListener("keydown",(function(e){if(m(e)&&(13==e.keyCode||32==e.keyCode)){var n=v(e.target,"SUMMARY");n&&n.parentNode&&"DETAILS"==n.parentNode.tagName&&(t(n.parentNode),e.preventDefault())}}),!1)}function b(t){var e=document.createEvent("Event");e.initEvent("toggle",!1,!1),t.dispatchEvent(e)}function v(t,e){if("function"==typeof t.closest)return t.closest(e);for(;t;){if(t.tagName==e)return t;t=t.parentNode}}o||(document.head.insertAdjacentHTML("afterbegin","<style>"+s+"</style>"),t=document.createElement("details").constructor.prototype,e=t.setAttribute,n=t.removeAttribute,r=Object.getOwnPropertyDescriptor(t,"open"),Object.defineProperties(t,{open:{get:function(){return"DETAILS"==this.tagName?this.hasAttribute("open"):r&&r.get?r.get.call(this):void 0},set:function(t){return"DETAILS"==this.tagName?t?this.setAttribute("open",""):this.removeAttribute("open"):r&&r.set?r.set.call(this,t):void 0}},setAttribute:{value:function(t,n){var r=this,i=function(){return e.call(r,t,n)};if("open"==t&&"DETAILS"==this.tagName){var a=this.hasAttribute("open"),o=i();if(!a){var u=this.querySelector("summary");u&&u.setAttribute("aria-expanded",!0),b(this)}return o}return i()}},removeAttribute:{value:function(t){var e=this,r=function(){return n.call(e,t)};if("open"==t&&"DETAILS"==this.tagName){var i=this.hasAttribute("open"),a=r();if(i){var o=this.querySelector("summary");o&&o.setAttribute("aria-expanded",!1),b(this)}return a}return r()}}}),p((function(t){t.hasAttribute("open")?t.removeAttribute("open"):t.setAttribute("open","")})),f(document),window.MutationObserver?new MutationObserver((function(t){d.call(t,(function(t){d.call(t.addedNodes,f)}))})).observe(document.documentElement,{subtree:!0,childList:!0}):document.addEventListener("DOMNodeInserted",(function(t){f(t.target)}))),o&&!u&&(window.MutationObserver?new MutationObserver((function(t){d.call(t,(function(t){var e=t.target,n=t.attributeName;"DETAILS"==e.tagName&&"open"==n&&b(e)}))})).observe(document.documentElement,{attributes:!0,subtree:!0}):p((function(t){var e=t.getAttribute("open");setTimeout((function(){var n=t.getAttribute("open");e!=n&&b(t)}),1)})))}()}}]);
//# sourceMappingURL=528-2d05a1cb9ab4c8568d3d.js.map