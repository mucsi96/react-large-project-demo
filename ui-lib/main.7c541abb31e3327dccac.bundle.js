(window.webpackJsonp=window.webpackJsonp||[]).push([[0],{1077:function(module,exports,__webpack_require__){"use strict";var _clientApi=__webpack_require__(53),_clientLogger=__webpack_require__(34),_configFilename=__webpack_require__(1078);function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach((function(key){_defineProperty(target,key,source[key])})):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))}))}return target}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}(_configFilename.args||_configFilename.argTypes)&&_clientLogger.logger.warn("Invalid args/argTypes in config, ignoring.",JSON.stringify({args:_configFilename.args,argTypes:_configFilename.argTypes})),_configFilename.decorators&&_configFilename.decorators.forEach((function(decorator){return(0,_clientApi.addDecorator)(decorator,!1)})),_configFilename.loaders&&_configFilename.loaders.forEach((function(loader){return(0,_clientApi.addLoader)(loader,!1)})),(_configFilename.parameters||_configFilename.globals||_configFilename.globalTypes)&&(0,_clientApi.addParameters)(_objectSpread(_objectSpread({},_configFilename.parameters),{},{globals:_configFilename.globals,globalTypes:_configFilename.globalTypes}),!1),_configFilename.argTypesEnhancers&&_configFilename.argTypesEnhancers.forEach((function(enhancer){return(0,_clientApi.addArgTypesEnhancer)(enhancer)}))},1078:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"decorators",(function(){return decorators}));var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__(0),react__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__),dev_tools__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__(209),serviceWorkerPath=__webpack_require__(1084).default,decorators=[function(Story){return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(dev_tools__WEBPACK_IMPORTED_MODULE_1__.WaitForMockApi,{serviceWorkerPath:serviceWorkerPath},react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement(Story,null))}]},1080:function(module,exports,__webpack_require__){"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k),Object.defineProperty(o,k2,{enumerable:!0,get:function(){return m[k]}})}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)};Object.defineProperty(exports,"__esModule",{value:!0}),__exportStar(__webpack_require__(469),exports),__exportStar(__webpack_require__(1083),exports)},1081:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getQuery=exports.getParams=exports.findMatchingMock=void 0;const path_to_regexp_1=__webpack_require__(1082);exports.findMatchingMock=function findMatchingMock(mocks,url,method){const mock=mocks.map(mock=>{const keys=[];return{regexp:path_to_regexp_1.pathToRegexp(mock.path,keys),keys:keys.map(key=>key.name),...mock}}).find(mock=>mock.regexp.test(url.pathname)&&(mock.method||"GET")===method);return{match:mock&&mock.regexp.exec(url.pathname),mock:mock}},exports.getParams=function getParams(match,mock){return match.reduce((acc,val,i)=>{const prop=mock.keys[i-1];return prop?(void 0===val&&prop in acc||(acc[prop]=val),acc):acc},{})},exports.getQuery=function getQuery(searchParams){const query={};return searchParams.forEach((value,name)=>{Array.isArray(query[name])?query[name]=[...query[name],value]:query[name]?query[name]=[query[name],value]:query[name]=value}),query}},1083:function(module,exports,__webpack_require__){"use strict";var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k),Object.defineProperty(o,k2,{enumerable:!0,get:function(){return m[k]}})}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__setModuleDefault=this&&this.__setModuleDefault||(Object.create?function(o,v){Object.defineProperty(o,"default",{enumerable:!0,value:v})}:function(o,v){o.default=v}),__importStar=this&&this.__importStar||function(mod){if(mod&&mod.__esModule)return mod;var result={};if(null!=mod)for(var k in mod)"default"!==k&&Object.prototype.hasOwnProperty.call(mod,k)&&__createBinding(result,mod,k);return __setModuleDefault(result,mod),result};Object.defineProperty(exports,"__esModule",{value:!0}),exports.WaitForMockApi=void 0;const react_1=__importStar(__webpack_require__(0)),mockApi_1=__webpack_require__(469);exports.WaitForMockApi=({children:children,serviceWorkerPath:serviceWorkerPath})=>{const[ready,setReady]=react_1.useState(!1);return react_1.useEffect(()=>{mockApi_1.enableMockApi(serviceWorkerPath).then(()=>setReady(!0)).catch(error=>setReady(()=>{throw error}))},[serviceWorkerPath]),ready?react_1.default.createElement(react_1.default.Fragment,null,children):null}},1084:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_exports__.default=__webpack_require__.p+"mockApiServiceWorker.js"},1085:function(module,exports,__webpack_require__){"use strict";(function(module){(0,__webpack_require__(360).configure)([__webpack_require__(1086)],module,!1)}).call(this,__webpack_require__(104)(module))},1086:function(module,exports,__webpack_require__){var map={"./components/Button/Button.stories.tsx":1092,"./components/FriendsList/FriendList.stories.tsx":1090};function webpackContext(req){var id=webpackContextResolve(req);return __webpack_require__(id)}function webpackContextResolve(req){if(!__webpack_require__.o(map,req)){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}return map[req]}webpackContext.keys=function webpackContextKeys(){return Object.keys(map)},webpackContext.resolve=webpackContextResolve,module.exports=webpackContext,webpackContext.id=1086},1090:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"normal",(function(){return normal})),__webpack_require__.d(__webpack_exports__,"empty",(function(){return empty})),__webpack_require__.d(__webpack_exports__,"failure",(function(){return failure})),__webpack_require__.d(__webpack_exports__,"slow",(function(){return slow}));var objectSpread2=__webpack_require__(100),objectWithoutProperties=__webpack_require__(480),react=__webpack_require__(0),react_default=__webpack_require__.n(react),tslib_es6=__webpack_require__(479);var FriendsMockSwitch,lib=__webpack_require__(209),dist_mockFriends=[{firstName:"Alyson",lastName:"Donnelly"},{firstName:"Carlee",lastName:"Kreiger"},{firstName:"Enrico",lastName:"Pouros"}];!function(FriendsMockSwitch){FriendsMockSwitch.NORMAL="NORMAL",FriendsMockSwitch.EMPTY="EMPTY",FriendsMockSwitch.FAILURE="FAILURE",FriendsMockSwitch.SLOW="SLOW"}(FriendsMockSwitch||(FriendsMockSwitch={}));let mockSwitch=FriendsMockSwitch.NORMAL;var slicedToArray=__webpack_require__(318),FriendsList_FriendsList=function FriendsList(){var _useState=Object(react.useState)(!1),_useState2=Object(slicedToArray.a)(_useState,2),error=_useState2[0],setError=_useState2[1],_useState3=Object(react.useState)(),_useState4=Object(slicedToArray.a)(_useState3,2),friends=_useState4[0],setFriends=_useState4[1];return Object(react.useEffect)((function(){(function getFriends(){return Object(tslib_es6.a)(this,void 0,void 0,(function*(){const response=yield window.fetch("/friends");if(!response.ok)throw new Error("Failed to load friends");return yield response.json()}))})().then(setFriends).catch(setError)}),[]),error?react_default.a.createElement("span",null,"Failed to load friends"):friends?friends.length?react_default.a.createElement("ul",null,friends.map((function(_ref){var friend=[_ref.firstName,_ref.lastName].join(" ");return react_default.a.createElement("li",{key:friend,"data-name":"name"},friend)}))):react_default.a.createElement("span",null,"No friends found :("):react_default.a.createElement("span",null,"Loading...")};try{FriendsList_FriendsList.displayName="FriendsList",FriendsList_FriendsList.__docgenInfo={description:"",displayName:"FriendsList",props:{}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/FriendsList/FriendsList.tsx#FriendsList"]={docgenInfo:FriendsList_FriendsList.__docgenInfo,name:"FriendsList",path:"src/components/FriendsList/FriendsList.tsx#FriendsList"})}catch(__react_docgen_typescript_loader_error){}!function setupApiMocks_setupApiMocks(){!function setupApiMocks(){Object(lib.registerApiMocks)([{path:"/friends",callback:(_request,response)=>{switch(mockSwitch){case FriendsMockSwitch.EMPTY:return[];case FriendsMockSwitch.FAILURE:return response.mockError(!0);case FriendsMockSwitch.SLOW:return response.delay(5e3),dist_mockFriends;default:return dist_mockFriends}}}])}()}();__webpack_exports__.default={title:"FriendsList",component:FriendsList_FriendsList};var FriendList_stories_Template=function Template(_ref){var friendsMock=_ref.friendsMock,args=Object(objectWithoutProperties.a)(_ref,["friendsMock"]);return function setFriendsMock(value){mockSwitch=value}(friendsMock),react_default.a.createElement(FriendsList_FriendsList,args)};function createStory(args){var story=FriendList_stories_Template.bind({});return story.args=args,story}var normal=createStory({friendsMock:FriendsMockSwitch.NORMAL}),empty=createStory({friendsMock:FriendsMockSwitch.EMPTY}),failure=createStory({friendsMock:FriendsMockSwitch.FAILURE}),slow=createStory({friendsMock:FriendsMockSwitch.SLOW});normal.parameters=Object(objectSpread2.a)({storySource:{source:"createStory({\r\n  friendsMock: FriendsMockSwitch.NORMAL,\r\n})"}},normal.parameters),empty.parameters=Object(objectSpread2.a)({storySource:{source:"createStory({\r\n  friendsMock: FriendsMockSwitch.EMPTY,\r\n})"}},empty.parameters),failure.parameters=Object(objectSpread2.a)({storySource:{source:"createStory({\r\n  friendsMock: FriendsMockSwitch.FAILURE,\r\n})"}},failure.parameters),slow.parameters=Object(objectSpread2.a)({storySource:{source:"createStory({\r\n  friendsMock: FriendsMockSwitch.SLOW,\r\n})"}},slow.parameters)},1092:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,"withText",(function(){return withText})),__webpack_require__.d(__webpack_exports__,"withEmoji",(function(){return withEmoji}));var objectSpread2=__webpack_require__(100),react=__webpack_require__(0),react_default=__webpack_require__.n(react),defineProperty=__webpack_require__(156),classnames=__webpack_require__(478),classnames_default=__webpack_require__.n(classnames),Button_module=__webpack_require__(317),Button_module_default=__webpack_require__.n(Button_module),Button_Button=function Button(_ref){var _classNames,children=_ref.children,onClick=_ref.onClick,primary=_ref.primary,secondary=_ref.secondary;return react_default.a.createElement("button",{type:"button",onClick:onClick,className:classnames_default()((_classNames={},Object(defineProperty.a)(_classNames,Button_module_default.a.primary,primary),Object(defineProperty.a)(_classNames,Button_module_default.a.secondary,secondary),_classNames))},children)};try{Button_Button.displayName="Button",Button_Button.__docgenInfo={description:"",displayName:"Button",props:{onClick:{defaultValue:null,description:"Simple click handler",name:"onClick",required:!1,type:{name:"() => void"}},primary:{defaultValue:null,description:"Is primary?",name:"primary",required:!1,type:{name:"boolean"}},secondary:{defaultValue:null,description:"default is false",name:"secondary",required:!1,type:{name:"boolean"}}}},"undefined"!=typeof STORYBOOK_REACT_CLASSES&&(STORYBOOK_REACT_CLASSES["src/components/Button/Button.tsx#Button"]={docgenInfo:Button_Button.__docgenInfo,name:"Button",path:"src/components/Button/Button.tsx#Button"})}catch(__react_docgen_typescript_loader_error){}__webpack_exports__.default={title:"Button",component:Button_Button};var Button_stories_Template=function Template(args){return react_default.a.createElement(Button_Button,args)};function createStory(args){var story=Button_stories_Template.bind({});return story.args=args,story}var withText=createStory({children:"Hello Button"}),withEmoji=createStory({children:"😀 😎 👍 💯"});withText.parameters=Object(objectSpread2.a)({storySource:{source:"createStory({\r\n  children: 'Hello Button',\r\n})"}},withText.parameters),withEmoji.parameters=Object(objectSpread2.a)({storySource:{source:"createStory({\r\n  children: '😀 😎 👍 💯',\r\n})"}},withEmoji.parameters)},209:function(module,exports,__webpack_require__){"use strict";(function(__dirname){var __createBinding=this&&this.__createBinding||(Object.create?function(o,m,k,k2){void 0===k2&&(k2=k),Object.defineProperty(o,k2,{enumerable:!0,get:function(){return m[k]}})}:function(o,m,k,k2){void 0===k2&&(k2=k),o[k2]=m[k]}),__exportStar=this&&this.__exportStar||function(m,exports){for(var p in m)"default"===p||Object.prototype.hasOwnProperty.call(exports,p)||__createBinding(exports,m,p)};Object.defineProperty(exports,"__esModule",{value:!0}),exports.setupEslintParser=exports.eslintConfig=void 0;const path_1=__webpack_require__(1079);exports.eslintConfig=path_1.resolve(__dirname,"../config/.eslintrc.json"),exports.setupEslintParser=function setupEslintParser(root){return{files:["*.ts","*.tsx"],parserOptions:{project:path_1.resolve(root,"tsconfig.json")}}},__exportStar(__webpack_require__(1080),exports)}).call(this,"/")},317:function(module,exports,__webpack_require__){module.exports={primary:"Button_primary__2Zdfs",secondary:"Button_secondary__B459r"}},469:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.createMockResponse=exports.registerApiMocks=exports.enableMockApi=void 0;const utils_1=__webpack_require__(1081);let mocks=[];async function createMockResponse({mock:mock,match:match,url:url,method:method,body:body,headers:headers}){let delay,status=200,mockError=!1,mockHTML=!1,responseBody=await mock.callback({url:url.pathname,method:method,headers:headers,body:body&&JSON.parse(body),params:utils_1.getParams(match,mock),query:utils_1.getQuery(url.searchParams)},{status(statusCode){status=statusCode},delay(delayMs){delay=delayMs},mockError(enable){mockError=enable},mockHTML(enable){mockHTML=enable}});return mockError&&(responseBody={error:{message:"We couldn't process your request at this time"}}),delay&&await new Promise(resolve=>window.setTimeout(resolve,delay)),{body:mockHTML?"<html></html>":responseBody&&JSON.stringify(responseBody),status:mockError?500:status}}exports.enableMockApi=async function enableMockApi(serviceWorkerPath){navigator.serviceWorker.register(serviceWorkerPath,{scope:"./"}).catch(err=>console.error("error registering sw",err)),window.addEventListener("beforeunload",()=>{navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({type:"CLIENT_CLOSED"})}),navigator.serviceWorker.onmessage=async({data:data,ports:ports})=>{if(data&&"REQUEST"===data.type)return async function handleRequest({url:fullUrl,method:method,body:body,headers:headers,port:port,mocks:mocks}){const url=new URL(fullUrl),{match:match,mock:mock}=utils_1.findMatchingMock(mocks,url,method);if(!match||!mock)return port.postMessage({type:"MOCK_NOT_FOUND"});const response=await createMockResponse({mock:mock,match:match,method:method,headers:headers,url:url,body:body});port.postMessage({response:response,type:"MOCK_SUCCESS"})}({...data.request,port:ports[0],mocks:mocks})},await navigator.serviceWorker.ready},exports.registerApiMocks=function registerApiMocks(newMocks){mocks=[...mocks,...newMocks]},exports.createMockResponse=createMockResponse},483:function(module,exports,__webpack_require__){__webpack_require__(484),__webpack_require__(640),__webpack_require__(641),__webpack_require__(799),__webpack_require__(1018),__webpack_require__(1051),__webpack_require__(1063),__webpack_require__(1065),__webpack_require__(1070),__webpack_require__(1072),__webpack_require__(1077),module.exports=__webpack_require__(1085)},550:function(module,exports){},641:function(module,__webpack_exports__,__webpack_require__){"use strict";__webpack_require__.r(__webpack_exports__);__webpack_require__(360)}},[[483,1,2]]]);
//# sourceMappingURL=main.7c541abb31e3327dccac.bundle.js.map