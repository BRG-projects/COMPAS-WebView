(window.webpackJsonp=window.webpackJsonp||[]).push([[9,5,6],{691:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return j}));var n=r(57),o=r(58),h=(r(32),r(694),r(17)),c=r(695),l=r(701),d=r(696),m=r(697),f=r(692),w=r(698),v=r(699),O=r(233);O.a.install({THREE:h});var j=function(){function e(){Object(n.a)(this,e),this.scene=new h.Scene,this.perspectiveCamera=new h.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),this.perspectiveCamera.position.set(10,10,10),this.perspectiveCamera.up.set(0,0,1),this.orthographicCamera=new h.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,.1,1e3),this.orthographicCamera.position.set(10,10,10),this.orthographicCamera.up.set(0,0,1),this.camera=this.perspectiveCamera,this.controls=null,this.renderer=new h.WebGLRenderer({antialias:!0}),this.pointLight=new h.PointLight(16777215,.5,50),this.ambientLight=new h.AmbientLight(16777215,1),this.axes=new h.AxesHelper(5),this.grid=new h.GridHelper(10,10),this.clock=new h.Clock,this.defaultGroup=new h.Group,this.interactiveGroup=new h.Group,this.objectsGroup=new h.Group,this.loader=new c.a,this.clock=new h.Clock,this.mixer=null,this.hdri=null,this.selected=null,this.pointer=new h.Vector2,this.raycaster=new h.Raycaster,this.enableTransformControls=!1}return Object(o.a)(e,[{key:"setup",value:function(e){var t=this;this.refs=e,this.defaultGroup.name="Default",this.camera.add(this.pointLight),this.pointLight.position.set(5,5,5),this.defaultGroup.add(this.ambientLight),this.defaultGroup.add(this.perspectiveCamera),this.defaultGroup.add(this.orthographicCamera),this.axes.geometry.attributes.position.count=4,this.axes.material.depthTest=!1,this.grid.material.depthTest=!1,this.axes.renderOrder=-1,this.grid.renderOrder=-2,this.grid.rotateX(-Math.PI/2),this.defaultGroup.add(this.grid),this.defaultGroup.add(this.axes),this.scene.add(this.defaultGroup),this.interactiveGroup.add(this.objectsGroup),this.scene.add(this.interactiveGroup),this.scene.background=new h.Color(15658734),this.refs.canvas.appendChild(this.renderer.domElement),this.controls=new O.a(this.camera,this.renderer.domElement),this.transformControls=new v.a(this.camera,this.renderer.domElement),this.transformControls.name="Gimbal",this.scene.add(this.transformControls),this.transformControls.addEventListener("dragging-changed",(function(e){t.controls.enabled=!e.value})),this.composer=new l.a(this.renderer),this.renderPass=new d.a(this.scene,this.camera),this.composer.addPass(this.renderPass),this.outlinePass=new m.a(new h.Vector2(window.innerWidth,window.innerHeight),this.interactiveGroup,this.camera),this.outlinePass.edgeThickness=2,this.outlinePass.edgeStrength=10,this.composer.addPass(this.outlinePass),this.effectFXAA=new f.a(w.a),this.effectFXAA.uniforms.resolution.value.set(1/window.innerWidth,1/window.innerHeight),this.composer.addPass(this.effectFXAA),this.updateDimensions(),window.addEventListener("resize",this.updateDimensions)}},{key:"select",value:function(e){console.log("select",e),e?(this.selected=e,e.selected=!0,this.outlinePass.selectedObjects=[e],this.attachGimbal(e)):(this.selected=null,this.outlinePass.selectedObjects=[],this.transformControls.detach())}},{key:"attachGimbal",value:function(e){this.enableTransformControls&&(this.transformControls.attach(e),(new h.Box3).setFromObject(e).getCenter(this.transformControls.position),this.transformControls.position.sub(e.position))}},{key:"focus",value:function(e){this.controls.fitToSphere(e,!0)}},{key:"start",value:function(){var e=this;!function animate(){var t=e.clock.getDelta();e.controls.update(t),requestAnimationFrame(animate),e.composer.render(),e.mixer&&e.mixer.update(t)}()}},{key:"updateDimensions",value:function(){var e=three.refs.container.clientWidth,t=three.refs.container.clientHeight;three.renderer.setSize(e,t),three.composer.setSize(e,t),three.effectFXAA.uniforms.resolution.value.set(1/e,1/t),three.camera===three.perspectiveCamera?three.camera.aspect=e/t:three.camera===three.orthographicCamera&&(three.camera.left=-e/2,three.camera.right=e/2,three.camera.top=t/2,three.camera.bottom=-t/2),three.camera.updateProjectionMatrix()}},{key:"adaptAttributesColorToTheme",value:function(e){this.objectsGroup.traverse((function(t){!t.isAttributes||"edges"!==t.name&&"vertices"!==t.name||t.invertColor(e)}))}}]),e}()},700:function(e,t,r){"use strict";r.r(t);r(6),r(10),r(11),r(8),r(12);var n=r(23),o=r(1),h=(r(102),r(7),r(3),r(36)),c=r(691);function l(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,r)}return t}function d(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?l(Object(source),!0).forEach((function(t){Object(o.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):l(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}var m={name:"ThreeView",data:function(){return{three:new c.default}},computed:Object(h.d)("scene",["mode","attributeMode"]),mounted:function(){window.three=this.three,this.three.setup(this.$refs),this.three.start()},methods:d(d(d({},Object(h.b)("scene",["select","getActiveAttributeObj","getEditingObj"])),Object(h.b)("property",["showProperties"])),{},{onMouseMove:function(e){this.three.pointer.x=e.offsetX/e.target.width*2-1,this.three.pointer.y=-e.offsetY/e.target.height*2+1},onMouseDown:function(){var e=this;return Object(n.a)(regeneratorRuntime.mark((function t(){var r,n,o,h,c,l,d,m;return regeneratorRuntime.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e.three.raycaster.setFromCamera(e.three.pointer,e.three.camera),"Scene"!==e.mode){t.next=17;break}if(!((r=(r=e.three.raycaster.intersectObjects(e.three.interactiveGroup.children)).filter((function(e){return"Mesh"===e.object.type}))).length>0)){t.next=14;break}return console.log("raytrace intersects",r),(n=r[0].object).isAttributes&&(n=n.parent),o=n.id,t.next=11,e.select({id:o});case 11:e.$root.$emit("highlight"),t.next=15;break;case 14:e.select({});case 15:t.next=27;break;case 17:if("Attributes"!==e.mode){t.next=27;break}return t.next=20,e.getEditingObj();case 20:return h=t.sent,e.three.raycaster.params.Points.threshold=e.three.raycaster.params.Line.threshold=h.raycastThreshold,t.next=24,e.getActiveAttributeObj();case 24:c=t.sent,(l=e.three.raycaster.intersectObject(c)).length?(d=void 0!==l[0].index?l[0].index:l[0].faceIndex,m=c.indexToKey(d),e.select({attributeKey:m}),e.$root.$emit("highlight")):e.select({});case 27:case"end":return t.stop()}}),t)})))()}})},f=r(47),w=r(44),v=r.n(w),O=r(688),component=Object(f.a)(m,(function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("v-container",{ref:"container",staticClass:"pa-0 ma-0",attrs:{fluid:"","fill-height":""}},[r("div",{ref:"canvas",on:{mousemove:e.onMouseMove,dblclick:e.onMouseDown}})])}),[],!1,null,null,null);t.default=component.exports;v()(component,{VContainer:O.a})},711:function(e,t,r){"use strict";r.r(t);var n={components:{ThreeView:r(700).default},name:"IndexPage"},o=r(47),component=Object(o.a)(n,(function(){var e=this.$createElement;return(this._self._c||e)("ThreeView")}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{ThreeView:r(700).default})}}]);