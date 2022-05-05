(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{104:function(e,t,n){"use strict";var o={name:"EmptyLayout",layout:"empty",props:{error:{type:Object,default:null}},data:function(){return{pageNotFound:"404 Not Found",otherError:"An error occurred"}},head:function(){return{title:404===this.error.statusCode?this.pageNotFound:this.otherError}}},r=(n(359),n(93)),l=n(111),c=n.n(l),v=n(510),component=Object(r.a)(o,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{attrs:{dark:""}},[404===e.error.statusCode?n("h1",[e._v("\n    "+e._s(e.pageNotFound)+"\n  ")]):n("h1",[e._v("\n    "+e._s(e.otherError)+"\n  ")]),e._v(" "),n("NuxtLink",{attrs:{to:"/"}},[e._v("\n    Home page\n  ")])],1)}),[],!1,null,"35e10596",null);t.a=component.exports;c()(component,{VApp:v.a})},222:function(e,t,n){"use strict";n.r(t);n(11),n(9),n(10),n(14),n(8),n(15);var o=n(44),r=n(1),l=(n(124),n(5),n(45),n(61),n(48),n(32),n(30),n(78)),c=n(227);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}var f={name:"Controller",computed:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(l.d)(["showController"])),data:function(){return{showSource:!0,fileSource:"Examples",fileLoading:!1,showAnimation:!1,fileExample:"DamagedHelmet.gltf",fileInput:null,fileURL:"",showScene:!1,scene:[],animations:[],sceneSelection:[]}},methods:{load:function(){var e=this;return Object(o.a)(regeneratorRuntime.mark((function t(){var n,o;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if("URL"===e.fileSource&&(n=e.fileURL),"Local"!==e.fileSource){t.next=6;break}return o=function(e){return new Promise((function(t,n){var o=new FileReader;o.readAsDataURL(e),o.onload=function(){return t(o.result)},o.onerror=function(e){return n(e)}}))},t.next=5,o(e.fileInput);case 5:n=t.sent;case 6:"Examples"===e.fileSource&&(n=e.fileExample,window.location.host.includes("localhost")||(n="/GLTF_viewer/"+n)),e.fileLoading=!0,window.loader.load(n,(function(t){window.gltl_scene&&window.scene.remove(window.gltl_scene),window.gltl_scene=t.scene,window.scene.add(window.gltl_scene),window.mixer=new c.b(t.scene),e.animations=t.animations.map((function(e){return{name:e.name,action:mixer.clipAction(e)}})),console.log(t),e.fileLoading=!1,e.refresh()}));case 9:case"end":return t.stop()}}),t)})))()},refresh:function(){var e=this;this.sceneSelection=[];this.scene=function t(n){return n.children.map((function(n){return e.sceneSelection.push(n.id),{name:"<".concat(n.constructor.name,">").concat(n.name),id:n.id,children:t(n)}}))}(window.scene)}},watch:{sceneSelection:function(e){window.scene.traverse((function(t){t!=window.scene&&(e.includes(t.id)?t.visible=!0:t.visible=!1)}))}}},d=f,m=n(93),w=n(111),h=n.n(w),_=n(518),O=n(511),x=n(217),y=n(218),S=n(219),j=n(157),L=n(79),V=n(517),k=n(520),E=n(512),C=n(516),R=n(82),P=n(521),component=Object(m.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-navigation-drawer",{attrs:{value:e.showController,right:"",app:"",fixed:"",width:"400"}},[n("v-list",[n("v-list-group",{scopedSlots:e._u([{key:"activator",fn:function(){return[n("v-list-item-content",[n("v-list-item-title",[e._v("File")])],1)]},proxy:!0}]),model:{value:e.showSource,callback:function(t){e.showSource=t},expression:"showSource"}},[e._v(" "),n("v-list-item",[n("v-list-item-content",[n("v-radio-group",{model:{value:e.fileSource,callback:function(t){e.fileSource=t},expression:"fileSource"}},[n("v-radio",{attrs:{value:"Repo",label:"Repo"}}),e._v(" "),n("v-radio",{attrs:{value:"Local",label:"Local"}}),e._v(" "),n("v-radio",{attrs:{value:"URL",label:"URL"}}),e._v(" "),n("v-radio",{attrs:{value:"Examples",label:"Examples"}})],1)],1)],1),e._v(" "),"Examples"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-select",{attrs:{label:"Examples",items:["DamagedHelmet.gltf","DragonAttenuation.glb","InterpolationTest.glb"]},model:{value:e.fileExample,callback:function(t){e.fileExample=t},expression:"fileExample"}})],1)],1):e._e(),e._v(" "),"Repo"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-text-field",{attrs:{label:"Repo Adress"}}),e._v(" "),n("v-select",{attrs:{label:"Version",items:["0.0.1","0.5.0","1.0.0"]}})],1)],1):e._e(),e._v(" "),"Local"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-file-input",{attrs:{"truncate-length":"15",label:"Local File"},model:{value:e.fileInput,callback:function(t){e.fileInput=t},expression:"fileInput"}})],1)],1):e._e(),e._v(" "),"URL"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-text-field",{attrs:{label:"URL"},model:{value:e.fileURL,callback:function(t){e.fileURL=t},expression:"fileURL"}})],1)],1):e._e(),e._v(" "),n("v-list-item",[n("v-list-item-content",[n("v-btn",{attrs:{loading:e.fileLoading},on:{click:e.load}},[e._v("Load")])],1)],1)],1),e._v(" "),n("v-list-group",{scopedSlots:e._u([{key:"activator",fn:function(){return[n("v-list-item-content",[n("v-list-item-title",[e._v("Scene")])],1)]},proxy:!0}]),model:{value:e.showScene,callback:function(t){e.showScene=t},expression:"showScene"}},[e._v(" "),n("v-list-item",[n("v-list-item-content",[n("v-treeview",{attrs:{items:e.scene,"selection-type":"independent",selectable:"",hoverable:"","selected-color":"green"},model:{value:e.sceneSelection,callback:function(t){e.sceneSelection=t},expression:"sceneSelection"}})],1)],1)],1),e._v(" "),n("v-list-group",{scopedSlots:e._u([{key:"activator",fn:function(){return[n("v-list-item-content",[n("v-list-item-title",[e._v("Animation")])],1)]},proxy:!0}]),model:{value:e.showAnimation,callback:function(t){e.showAnimation=t},expression:"showAnimation"}},[e._v(" "),0==e.animations.length?n("v-list-item",[n("v-list-item-content",[e._v(" No animations available. ")])],1):e._e(),e._v(" "),e._l(e.animations,(function(t,i){return n("v-list-item",{key:i},[n("v-list-item-content",[n("v-list-item-title",[e._v(e._s(t.name))]),e._v(" "),n("div",[n("v-icon",{attrs:{color:"green"},on:{click:function(e){return t.action.play()}}},[e._v("mdi-play")]),e._v(" "),n("v-icon",{attrs:{color:"red"},on:{click:function(e){return t.action.stop()}}},[e._v("mdi-stop")])],1)],1)],1)}))],2)],1)],1)}),[],!1,null,null,null);t.default=component.exports;h()(component,{VBtn:_.a,VFileInput:O.a,VIcon:x.a,VList:y.a,VListGroup:S.a,VListItem:j.a,VListItemContent:L.a,VListItemTitle:L.b,VNavigationDrawer:V.a,VRadio:k.a,VRadioGroup:E.a,VSelect:C.a,VTextField:R.a,VTreeview:P.a})},283:function(e,t,n){var content=n(360);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(20).default)("dc093880",content,!0,{sourceMap:!1})},309:function(e,t,n){"use strict";n(11),n(9),n(10),n(5),n(14),n(8),n(15);var o=n(1),r=n(222),l=n(78);function c(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}var v={name:"DefaultLayout",components:{Controller:r.default},computed:Object(l.d)(["showController"]),data:function(){return{clipped:!1,drawer:!1,fixed:!1,items:[{icon:"mdi-apps",title:"Welcome",to:"/"},{icon:"mdi-chart-bubble",title:"Inspire",to:"/inspire"}],miniVariant:!1,title:"GLTF Viewer"}},methods:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?c(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):c(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(l.b)(["toggleController"]))},f=v,d=n(93),m=n(111),w=n.n(m),h=n(510),_=n(519),O=n(518),x=n(513),y=n(217),S=n(514),j=n(515),L=n(307),component=Object(d.a)(f,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{attrs:{dark:""}},[n("v-app-bar",{attrs:{fixed:"",app:""}},[n("v-toolbar-title",{domProps:{textContent:e._s(e.title)}}),e._v(" "),n("v-spacer"),e._v(" "),n("v-btn",{attrs:{icon:""},on:{click:function(t){return t.stopPropagation(),e.toggleController.apply(null,arguments)}}},[n("v-icon",[e._v("mdi-menu")])],1)],1),e._v(" "),n("v-main",[n("Nuxt")],1),e._v(" "),n("Controller"),e._v(" "),n("v-footer",{attrs:{app:""}},[n("span",[e._v("© "+e._s((new Date).getFullYear()))])])],1)}),[],!1,null,null,null);t.a=component.exports;w()(component,{Controller:n(222).default}),w()(component,{VApp:h.a,VAppBar:_.a,VBtn:O.a,VFooter:x.a,VIcon:y.a,VMain:S.a,VSpacer:j.a,VToolbarTitle:L.a})},314:function(e,t,n){n(315),e.exports=n(316)},359:function(e,t,n){"use strict";n(283)},360:function(e,t,n){var o=n(19)(!1);o.push([e.i,"h1[data-v-35e10596]{font-size:20px}",""]),e.exports=o},479:function(e,t,n){"use strict";n.r(t),n.d(t,"state",(function(){return o})),n.d(t,"mutations",(function(){return r})),n.d(t,"actions",(function(){return l}));var o=function(){return{showController:!0,scene:null}},r={setShowController:function(e,t){e.showController=t},setScene:function(e,t){e.scene=t}},l={toggleController:function(e){var t=e.state;(0,e.commit)("setShowController",!t.showController),console.log(t.showController)}}}},[[314,9,2,10]]]);