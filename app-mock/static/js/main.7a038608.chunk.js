(this.webpackJsonpapp=this.webpackJsonpapp||[]).push([[0],{12:function(e,t,r){},13:function(e,t,r){},14:function(e,t,r){"use strict";r.r(t);var a=r(0),n=r.n(a),o=r(3),c=r.n(o),s=(r(12),r(4)),l=r.n(s),i=r(5);Object(i.a)(".Button-module_primary__pg7GC {\n  background-color: chocolate;\n  color: white;\n  padding: 10px 20px;\n  border: 1px solid white;\n  border-radius: 10px; }\n\n.Button-module_secondary__2ce5v {\n  background-color: lightskyblue; }\n");var d={primary:"Button-module_primary__pg7GC",secondary:"Button-module_secondary__2ce5v"};const u=({children:e,onClick:t,primary:r,secondary:a})=>n.a.createElement("button",{type:"button",onClick:t,className:l()({[d.primary]:r,[d.secondary]:a})},e);var m=r(6);var p=r(1),h=r(7);function f(e,t){return e.reduce(((e,r,a)=>{const n=t.keys[a-1];return n?(void 0===r&&n in e||(e[n]=r),e):e}),{})}function y(e){const t={};return e.forEach(((e,r)=>{Array.isArray(t[r])?t[r]=[...t[r],e]:t[r]?t[r]=[t[r],e]:t[r]=e})),t}let g=[];function E(){return Object(p.a)(this,void 0,void 0,(function*(){navigator.serviceWorker.register("mockApiServiceWorker.js",{scope:"./"}).catch((e=>console.error("error registering sw",e))),yield new Promise((e=>{navigator.serviceWorker.onmessage=({data:t})=>{t&&"READY"===t.type&&(console.log("SW is ready. Registered mocks",g),e())}})),navigator.serviceWorker.onmessage=({data:e,ports:t})=>{if(e&&"REQUEST"===e.type)return function({url:e,method:t,body:r,headers:a,port:n,mocks:o}){return Object(p.a)(this,void 0,void 0,(function*(){const c=new URL(e),{match:s,mock:l}=function(e,t,r){const a=e.map((e=>{const t=[],r=Object(h.a)(e.path,t);return Object.assign({regexp:r,keys:t.map((e=>e.name))},e)})).find((e=>e.regexp.test(t.pathname)&&(e.method||"GET")===r));return{match:a&&a.regexp.exec(t.pathname),mock:a}}(o,c,t);if(!s||!l)return n.postMessage({type:"MOCK_NOT_FOUND"});const i=yield function({mock:e,match:t,url:r,method:a,body:n,headers:o}){return Object(p.a)(this,void 0,void 0,(function*(){let c,s=200,l=!1,i=!1,d=yield e.callback({url:r.pathname,method:a,headers:o,body:n&&JSON.parse(n),params:f(t,e),query:y(r.searchParams)},{status(e){s=e},delay(e){c=e},mockError(e){l=e},mockHTML(e){i=e}});return l&&(d={error:{message:"We couldn't process your request at this time"}}),c&&(yield new Promise((e=>window.setTimeout(e,c)))),{body:i?"<html></html>":d&&JSON.stringify(d),status:l?500:s}}))}({mock:l,match:s,method:t,headers:a,url:c,body:r});n.postMessage({response:i,type:"MOCK_SUCCESS"})}))}(Object.assign(Object.assign({},e.request),{port:t[0],mocks:g}))}}))}const b=({children:e})=>{const[t,r]=Object(a.useState)(!1);return Object(a.useEffect)((()=>{E().then((()=>r(!0))).catch((e=>r((()=>{throw e}))))}),[]),t?n.a.createElement(n.a.Fragment,null,e):null};var k,v=[{firstName:"Alyson",lastName:"Donnelly"},{firstName:"Carlee",lastName:"Kreiger"},{firstName:"Enrico",lastName:"Pouros"}];!function(e){e.NORMAL="NORMAL",e.EMPTY="EMPTY",e.FAILURE="FAILURE",e.SLOW="SLOW"}(k||(k={}));let O=k.NORMAL;function N(){var e;e=[{path:"/api/friends",callback:(e,t)=>{switch(O){case k.EMPTY:return[];case k.FAILURE:return t.mockError(!0);case k.SLOW:return t.delay(5e3),v;default:return v}}}],g=[...g,...e]}const j=()=>{const[e,t]=Object(a.useState)(!1),[r,o]=Object(a.useState)();return Object(a.useEffect)((()=>{(function(){return Object(m.a)(this,void 0,void 0,(function*(){console.log("fetching friends....");const e=yield window.fetch("/api/friends");if(!e.ok)throw new Error("Failed to load friends");return yield e.json()}))})().then(o).catch(t)}),[]),e?n.a.createElement("span",null,"Failed to load friends"):r?r.length?n.a.createElement("ul",null,r.map((({firstName:e,lastName:t})=>{const r=[e,t].join(" ");return n.a.createElement("li",{key:r,"data-name":"name"},r)}))):n.a.createElement("span",null,"No friends found :("):n.a.createElement("span",null,"Loading...")};r(13);var w=r.p+"static/media/logo.2d27ead7.svg";var A=()=>n.a.createElement("div",{className:"App"},n.a.createElement("header",{className:"App-header"},n.a.createElement("img",{src:w,className:"App-logo",alt:"logo"}),n.a.createElement("p",null,"Edit ",n.a.createElement("code",null,"src/App.tsx")," and save to reload."),n.a.createElement("a",{className:"App-link",href:"https://reactjs.org",target:"_blank",rel:"noopener noreferrer"},n.a.createElement(u,{primary:!0},"Learn React"),n.a.createElement(j,null))));let _=n.a.createElement(A,null);N(),_=n.a.createElement(b,null,_),c.a.render(n.a.createElement(n.a.StrictMode,null,_),document.getElementById("root"))}},[[14,1,2]]]);
//# sourceMappingURL=main.7a038608.chunk.js.map