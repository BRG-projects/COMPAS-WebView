(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{109:function(e,t,n){"use strict";var r={name:"EmptyLayout",layout:"empty",props:{error:{type:Object,default:null}},data:function(){return{pageNotFound:"404 Not Found",otherError:"An error occurred"}},head:function(){return{title:404===this.error.statusCode?this.pageNotFound:this.otherError}}},o=(n(394),n(62)),c=n(63),l=n.n(c),f=n(567),component=Object(o.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{attrs:{dark:""}},[404===e.error.statusCode?n("h1",[e._v("\n    "+e._s(e.pageNotFound)+"\n  ")]):n("h1",[e._v("\n    "+e._s(e.otherError)+"\n  ")]),e._v(" "),n("NuxtLink",{attrs:{to:"/"}},[e._v("\n    Home page\n  ")])],1)}),[],!1,null,"35e10596",null);t.a=component.exports;l()(component,{VApp:f.a})},261:function(e,t,n){"use strict";n.r(t);n(10),n(7),n(9),n(4),n(12),n(8),n(13);var r=n(1),o=n(52),c=n(262),l=n(263),f=n(264);function v(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}var m={name:"Controller",components:{File:c.default,Scene:l.default,Animation:f.default},computed:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?v(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):v(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(o.d)(["showController"])),data:function(){return{showSource:!0,showAnimation:!1,showScene:!1,animations:[]}},methods:{}},d=m,w=n(62),h=n(63),O=n.n(h),_=n(252),x=n(253),j=n(37),y=n(578),component=Object(w.a)(d,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-navigation-drawer",{attrs:{value:e.showController,right:"",app:"",fixed:"",width:"400"}},[n("v-list",[n("v-list-group",{scopedSlots:e._u([{key:"activator",fn:function(){return[n("v-list-item-content",[n("v-list-item-title",[e._v("File")])],1)]},proxy:!0}]),model:{value:e.showSource,callback:function(t){e.showSource=t},expression:"showSource"}},[e._v(" "),n("File")],1),e._v(" "),n("v-list-group",{scopedSlots:e._u([{key:"activator",fn:function(){return[n("v-list-item-content",[n("v-list-item-title",[e._v("Scene")])],1)]},proxy:!0}]),model:{value:e.showScene,callback:function(t){e.showScene=t},expression:"showScene"}},[e._v(" "),n("Scene")],1),e._v(" "),n("v-list-group",{scopedSlots:e._u([{key:"activator",fn:function(){return[n("v-list-item-content",[n("v-list-item-title",[e._v("Animation")])],1)]},proxy:!0}]),model:{value:e.showAnimation,callback:function(t){e.showAnimation=t},expression:"showAnimation"}},[e._v(" "),n("Animation")],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports;O()(component,{File:n(262).default,Scene:n(263).default,Animation:n(264).default}),O()(component,{VList:_.a,VListGroup:x.a,VListItemContent:j.a,VListItemTitle:j.b,VNavigationDrawer:y.a})},262:function(e,t,n){"use strict";n.r(t);n(10),n(7),n(9),n(12),n(8),n(13);var r=n(32),o=n(1),c=(n(114),n(51),n(30),n(4),n(38),n(59),n(52)),l=n(175);function f(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function v(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var m={name:"File",computed:v(v(v({},Object(c.d)(["showController"])),Object(c.d)("repo",["tags","files"])),{},{tagNames:function(){return this.tags.map((function(e){return e.name}))},fileNames:function(){return this.files.map((function(e){return e.name}))}}),data:function(){return{fileSource:"Examples",fileLoading:!1,fileExample:"DamagedHelmet.gltf",fileInput:null,fileURL:"",animations:[],repoOwner:"BlockResearchGroup",repoName:"Phoenix",pat:null,folder:"data",tag:"",file:""}},methods:v(v(v({},Object(c.b)("repo",["getTags","getFiles","getFile"])),Object(c.b)("scene",["refreshTree"])),{},{load:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){var n,r,o,content;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,"URL"===e.fileSource&&(n=e.fileURL),"Local"!==e.fileSource){t.next=7;break}return r=function(e){return new Promise((function(t,n){var r=new FileReader;r.readAsDataURL(e),r.onload=function(){return t(r.result)},r.onerror=function(e){return n(e)}}))},t.next=6,r(e.fileInput);case 6:n=t.sent;case 7:if("Examples"===e.fileSource&&(n=e.fileExample,window.location.host.includes("localhost")||(n="/GLTF_viewer/"+n)),e.fileLoading=!0,o=function(t){window.scene.add(t.scene),window.mixer=new l.AnimationMixer(t.scene),window.animations=t.animations.map((function(e){return{name:e.name,action:mixer.clipAction(e)}})),console.log(t),e.fileLoading=!1,e.refreshTree(window.scene)},"Repo"!==e.fileSource){t.next=17;break}return t.next=13,e.getFile({owner:e.repoOwner,repo:e.repoName,pat:e.pat,path:e.folder+"/"+e.file,ref:e.tag});case 13:content=t.sent,window.loader.parse(content,"/",o),t.next=18;break;case 17:window.loader.load(n,o);case 18:t.next=25;break;case 20:t.prev=20,t.t0=t.catch(0),console.log(t.t0),e.fileLoading=!1,alert(t.t0);case 25:case"end":return t.stop()}}),t,null,[[0,20]])})))()},fetch:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getTags({owner:e.repoOwner,repo:e.repoName,pat:e.pat});case 2:case"end":return t.stop()}}),t)})))()}}),watch:{pat:function(){this.fetch()},tag:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getFiles({owner:e.repoOwner,repo:e.repoName,pat:e.pat,path:e.folder,ref:e.tag});case 2:case"end":return t.stop()}}),t)})))()}},mounted:function(){var e=this;return Object(r.a)(regeneratorRuntime.mark((function t(){return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!(e.repoName&&e.repoOwner&&e.pat)){t.next=3;break}return t.next=3,e.fetch();case 3:case"end":return t.stop()}}),t)})))()}},d=n(62),w=n(63),h=n.n(w),O=n(581),_=n(568),x=n(569),j=n(252),y=n(169),k=n(37),S=n(570),V=n(571),L=n(572),R=n(577),P=n(92),component=Object(d.a)(m,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-list",[n("v-list-item",[n("v-list-item-content",[n("v-radio-group",{model:{value:e.fileSource,callback:function(t){e.fileSource=t},expression:"fileSource"}},[n("v-radio",{attrs:{value:"Repo",label:"Repo"}}),e._v(" "),n("v-radio",{attrs:{value:"Local",label:"Local"}}),e._v(" "),n("v-radio",{attrs:{value:"URL",label:"URL"}}),e._v(" "),n("v-radio",{attrs:{value:"Examples",label:"Examples"}})],1)],1)],1),e._v(" "),"Examples"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-select",{attrs:{label:"Examples",items:["DamagedHelmet.gltf","DragonAttenuation.glb","InterpolationTest.glb"]},model:{value:e.fileExample,callback:function(t){e.fileExample=t},expression:"fileExample"}})],1)],1):e._e(),e._v(" "),"Repo"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-row",[n("v-col",[n("v-text-field",{attrs:{label:"Owner"},model:{value:e.repoOwner,callback:function(t){e.repoOwner=t},expression:"repoOwner"}}),e._v(" "),n("v-text-field",{attrs:{label:"Repo"},model:{value:e.repoName,callback:function(t){e.repoName=t},expression:"repoName"}}),e._v(" "),n("v-text-field",{attrs:{label:"PAT"},model:{value:e.pat,callback:function(t){e.pat=t},expression:"pat"}}),e._v(" "),e.pat?n("v-text-field",{attrs:{label:"Folder"},model:{value:e.folder,callback:function(t){e.folder=t},expression:"folder"}}):e._e(),e._v(" "),e.pat?n("v-select",{attrs:{label:"Version",items:e.tagNames},model:{value:e.tag,callback:function(t){e.tag=t},expression:"tag"}}):e._e(),e._v(" "),e.tag?n("v-select",{attrs:{label:"File",items:e.fileNames},model:{value:e.file,callback:function(t){e.file=t},expression:"file"}}):e._e()],1)],1)],1)],1):e._e(),e._v(" "),"Local"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-file-input",{attrs:{"truncate-length":"15",label:"Local File"},model:{value:e.fileInput,callback:function(t){e.fileInput=t},expression:"fileInput"}})],1)],1):e._e(),e._v(" "),"URL"===e.fileSource?n("v-list-item",[n("v-list-item-content",[n("v-text-field",{attrs:{label:"URL"},model:{value:e.fileURL,callback:function(t){e.fileURL=t},expression:"fileURL"}})],1)],1):e._e(),e._v(" "),n("v-list-item",[n("v-list-item-content",[n("v-btn",{attrs:{loading:e.fileLoading},on:{click:e.load}},[e._v("Load")])],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports;h()(component,{VBtn:O.a,VCol:_.a,VFileInput:x.a,VList:j.a,VListItem:y.a,VListItemContent:k.a,VRadio:S.a,VRadioGroup:V.a,VRow:L.a,VSelect:R.a,VTextField:P.a})},263:function(e,t,n){"use strict";n.r(t);n(10),n(7),n(9),n(4),n(12),n(8),n(13);var r=n(1),o=(n(30),n(52)),c=n(175);function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}function f(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var v={name:"Scene",computed:f({},Object(o.d)("scene",["tree"])),data:function(){return{useHdri:!1,upAxis:"Y"}},watch:{upAxis:function(e){"Y"===e?(window.camera.up.set(0,1,0),window.controls.updateCameraUp()):(window.camera.up.set(0,0,1),window.controls.updateCameraUp())}},methods:f(f({},Object(o.b)("scene",["refreshTree"])),{},{show:function(e){var t=this.getObject(e.id);t.visible=!t.visible},remove:function(e){if(window.confirm("Are you sure you want to delete ".concat(e.name,"?"))){var t=this.getObject(e.id);t.parent.remove(t),this.refreshTree(window.scene)}},getObject:function(e){var t;return window.scene.traverse((function(n){n.id==e&&(t=n)})),t},showHdri:function(){this.useHdri?window.scene.background=window.hdri:window.scene.background=new c.Color(16777215)}})},m=n(62),d=n(63),w=n.n(d),h=n(256),O=n(257),_=n(251),x=n(252),j=n(169),y=n(37),k=n(570),S=n(571),V=n(573),L=n(580),component=Object(m.a)(v,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-list",[n("v-list-item",[n("v-list-item-content",[n("v-switch",{attrs:{label:"HDRI"},on:{change:e.showHdri},model:{value:e.useHdri,callback:function(t){e.useHdri=t},expression:"useHdri"}})],1)],1),e._v(" "),n("v-list-item",[n("v-list-item-content",[n("v-radio-group",{attrs:{label:"Up Axis"},model:{value:e.upAxis,callback:function(t){e.upAxis=t},expression:"upAxis"}},[n("v-radio",{attrs:{label:"Y",value:"Y"}}),e._v(" "),n("v-radio",{attrs:{label:"Z",value:"Z"}})],1)],1)],1),e._v(" "),n("v-list-item",[n("v-list-item-content",[n("v-card",[n("v-card-title",[e._v("Scene")]),e._v(" "),n("v-treeview",{attrs:{items:e.tree,hoverable:"","selected-color":"green"},scopedSlots:e._u([{key:"prepend",fn:function(t){var r=t.item;return[e.getObject(r.id).visible?n("v-icon",{on:{click:function(t){return e.show(r)}}},[e._v("\n              mdi-eye\n            ")]):e._e(),e._v(" "),e.getObject(r.id).visible?e._e():n("v-icon",{on:{click:function(t){return e.show(r)}}},[e._v("\n              mdi-eye-off\n            ")]),e._v(" "),n("v-icon",{on:{click:function(t){return e.remove(r)}}},[e._v(" mdi-delete ")])]}},{key:"label",fn:function(t){var r=t.item;return[n("span",[e._v(e._s(r.name))])]}}])})],1)],1)],1)],1)}),[],!1,null,null,null);t.default=component.exports;w()(component,{VCard:h.a,VCardTitle:O.a,VIcon:_.a,VList:x.a,VListItem:j.a,VListItemContent:y.a,VRadio:k.a,VRadioGroup:S.a,VSwitch:V.a,VTreeview:L.a})},264:function(e,t,n){"use strict";n.r(t);var r={name:"Animation",computed:{animations:function(){return window.animations?window.animations:[]}}},o=n(62),c=n(63),l=n.n(c),f=n(251),v=n(252),m=n(169),d=n(37),component=Object(o.a)(r,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-list",[0==e.animations.length?n("v-list-item",[n("v-list-item-content",[e._v(" No animations available. ")])],1):e._e(),e._v(" "),e._l(e.animations,(function(t,i){return n("v-list-item",{key:i},[n("v-list-item-content",[n("v-list-item-title",[e._v(e._s(t.name))]),e._v(" "),n("div",[n("v-icon",{attrs:{color:"green"},on:{click:function(e){return t.action.play()}}},[e._v("mdi-play")]),e._v(" "),n("v-icon",{attrs:{color:"red"},on:{click:function(e){return t.action.stop()}}},[e._v("mdi-stop")])],1)],1)],1)}))],2)}),[],!1,null,null,null);t.default=component.exports;l()(component,{VIcon:f.a,VList:v.a,VListItem:m.a,VListItemContent:d.a,VListItemTitle:d.b})},312:function(e,t,n){var content=n(395);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,n(18).default)("dc093880",content,!0,{sourceMap:!1})},345:function(e,t,n){"use strict";n(10),n(7),n(9),n(4),n(12),n(8),n(13);var r=n(1),o=n(261),c=n(52);function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}var f={name:"DefaultLayout",components:{Controller:o.default},computed:Object(c.d)(["showController"]),data:function(){return{clipped:!1,drawer:!1,fixed:!1,items:[{icon:"mdi-apps",title:"Welcome",to:"/"},{icon:"mdi-chart-bubble",title:"Inspire",to:"/inspire"}],miniVariant:!1,title:"GLTF Viewer"}},methods:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({},Object(c.b)(["toggleController"]))},v=f,m=n(62),d=n(63),w=n.n(d),h=n(567),O=n(579),_=n(581),x=n(574),j=n(251),y=n(575),k=n(576),S=n(339),component=Object(m.a)(v,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-app",{attrs:{dark:""}},[n("v-app-bar",{attrs:{fixed:"",app:""}},[n("v-toolbar-title",{domProps:{textContent:e._s(e.title)}}),e._v(" "),n("v-spacer"),e._v(" "),n("v-btn",{attrs:{icon:""},on:{click:function(t){return t.stopPropagation(),e.toggleController.apply(null,arguments)}}},[n("v-icon",[e._v("mdi-menu")])],1)],1),e._v(" "),n("v-main",[n("Nuxt")],1),e._v(" "),n("Controller"),e._v(" "),n("v-footer",{attrs:{app:""}},[n("span",[e._v("© "+e._s((new Date).getFullYear()))])])],1)}),[],!1,null,null,null);t.a=component.exports;w()(component,{Controller:n(261).default}),w()(component,{VApp:h.a,VAppBar:O.a,VBtn:_.a,VFooter:x.a,VIcon:j.a,VMain:y.a,VSpacer:k.a,VToolbarTitle:S.a})},349:function(e,t,n){n(350),e.exports=n(351)},394:function(e,t,n){"use strict";n(312)},395:function(e,t,n){var r=n(17)(!1);r.push([e.i,"h1[data-v-35e10596]{font-size:20px}",""]),e.exports=r},518:function(e,t,n){"use strict";n.r(t),n.d(t,"state",(function(){return r})),n.d(t,"mutations",(function(){return o})),n.d(t,"actions",(function(){return c}));var r=function(){return{showController:!0,scene:null}},o={setShowController:function(e,t){e.showController=t},setScene:function(e,t){e.scene=t}},c={toggleController:function(e){var t=e.state;(0,e.commit)("setShowController",!t.showController),console.log(t.showController)}}},519:function(e,t,n){"use strict";n.r(t),function(e){n.d(t,"state",(function(){return c})),n.d(t,"mutations",(function(){return l})),n.d(t,"actions",(function(){return f}));var r=n(32),o=(n(4),n(74),n(114),n(224)),c=function(){return{tags:[],files:[]}},l={setTags:function(e,t){e.tags=t},setFiles:function(e,t){e.files=t}},f={getTags:function(e,t){return Object(r.a)(regeneratorRuntime.mark((function n(){var r,c,l,f,v,m;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r=e.commit,c=t.owner,l=t.repo,f=t.pat,v=new o.a({auth:f}),n.next=5,v.request("GET /repos/{owner}/{repo}/tags",{owner:c,repo:l});case 5:m=n.sent,r("setTags",m.data),console.log(m);case 8:case"end":return n.stop()}}),n)})))()},getFiles:function(e,t){return Object(r.a)(regeneratorRuntime.mark((function n(){var r,c,l,f,path,v,m,d;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return r=e.commit,c=t.owner,l=t.repo,f=t.pat,path=t.path,v=t.ref,m=new o.a({auth:f}),n.next=5,m.request("GET /repos/{owner}/{repo}/contents/{path}",{owner:c,repo:l,path:path,ref:v});case 5:d=n.sent,r("setFiles",d.data),console.log(d);case 8:case"end":return n.stop()}}),n)})))()},getFile:function(t,n){return Object(r.a)(regeneratorRuntime.mark((function r(){var c,l,f,path,v,m,d;return regeneratorRuntime.wrap((function(r){for(;;)switch(r.prev=r.next){case 0:return t.commit,c=n.owner,l=n.repo,f=n.pat,path=n.path,v=n.ref,m=new o.a({auth:f}),r.next=5,m.request("GET /repos/{owner}/{repo}/contents/{path}",{owner:c,repo:l,path:path,ref:v});case 5:return d=r.sent,console.log(d),r.abrupt("return",e.from(d.data.content,"base64").toString("utf8"));case 8:case"end":return r.stop()}}),r)})))()}}}.call(this,n(326).Buffer)},533:function(e,t){},534:function(e,t,n){"use strict";n.r(t),n.d(t,"state",(function(){return r})),n.d(t,"mutations",(function(){return o})),n.d(t,"actions",(function(){return c}));n(51),n(33),n(30);var r=function(){return{tree:[]}},o={setTree:function(e,t){e.tree=t}},c={refreshTree:function(e,t){var n=e.commit,r=function e(t){return t.children.map((function(t){return{name:"<".concat(t.type,">").concat(t.name),selected:!1,id:t.id,children:e(t)}}))}(t);n("setTree",r)}}}},[[349,9,2,10]]]);