(window.webpackJsonp=window.webpackJsonp||[]).push([[8,5],{675:function(e,t,n){"use strict";n.r(t);var r=n(55),o=n(56),h=(n(31),n(4),n(9),n(7),n(10)),c=n(676),l=n(685),d=n(678),m=n(679),f=n(674),w=n(680),v=n(681),G=n(682);G.a.install({THREE:h});var y=function(){function e(){Object(r.a)(this,e),this.scene=new h.Scene,this.camera=new h.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),this.controls=null,this.renderer=new h.WebGLRenderer({antialias:!0}),this.pointLight=new h.PointLight(16777215,.5,100),this.ambientLight=new h.AmbientLight(16777215,1),this.axes=new h.AxesHelper(5),this.grid=new h.GridHelper(10,10),this.clock=new h.Clock,this.defaultGroup=new h.Group,this.interactiveGroup=new h.Group,this.objectsGroup=new h.Group,this.loader=new c.a,this.clock=new h.Clock,this.mixer=null,this.hdri=null,this.selected=null,this.pointer=new h.Vector2,this.raycaster=new h.Raycaster,this.raycaster.params.Line.threshold=3,this.edgeMaterial=new h.LineBasicMaterial({color:16777215}),this.enableTransformControls=!1,this.mode="Scene",this.editingObj=null}return Object(o.a)(e,[{key:"setup",value:function(e){var t=this;this.refs=e,this.defaultGroup.name="Default",this.camera.position.set(5,5,5),this.camera.up.set(0,0,1),this.camera.add(this.pointLight),this.defaultGroup.add(this.ambientLight),this.defaultGroup.add(this.camera),this.axes.geometry.attributes.position.count=4,this.axes.material.depthTest=!1,this.grid.material.depthTest=!1,this.axes.renderOrder=-1,this.grid.renderOrder=-2,this.grid.rotateX(-Math.PI/2),this.defaultGroup.add(this.grid),this.defaultGroup.add(this.axes),this.scene.add(this.defaultGroup),this.interactiveGroup.add(this.objectsGroup),this.scene.add(this.interactiveGroup),this.scene.background=new h.Color(1973790),this.refs.canvas.appendChild(this.renderer.domElement),this.controls=new G.a(this.camera,this.renderer.domElement),this.transformControls=new v.a(this.camera,this.renderer.domElement),this.transformControls.name="Gimbal",this.scene.add(this.transformControls),this.transformControls.addEventListener("dragging-changed",(function(e){t.controls.enabled=!e.value})),this.composer=new l.a(this.renderer);var n=new d.a(this.scene,this.camera);this.composer.addPass(n),this.outlinePass=new m.a(new h.Vector2(window.innerWidth,window.innerHeight),this.interactiveGroup,this.camera),this.composer.addPass(this.outlinePass);var r=new f.a(w.a);r.uniforms.resolution.value.set(1/window.innerWidth,1/window.innerHeight),this.composer.addPass(r),this.updateDimensions(),window.addEventListener("resize",this.updateDimensions)}},{key:"select",value:function(e){console.log("select",e),e?(this.selected=e,e.selected=!0,this.outlinePass.selectedObjects=[e],this.enableTransformControls&&(this.transformControls.attach(e),e.geometry&&this.transformControls.position.copy(e.geometry.boundingSphere.center))):(this.selected=null,this.outlinePass.selectedObjects=[],this.transformControls.detach())}},{key:"focus",value:function(e){this.controls.fitToSphere(e,!0)}},{key:"start",value:function(){var e=this;!function animate(){var t=e.clock.getDelta();e.controls.update(t),requestAnimationFrame(animate),e.composer.render(),e.mixer&&e.mixer.update(t)}()}},{key:"updateDimensions",value:function(){var e=window.three.refs.container.clientWidth,t=window.three.refs.container.clientHeight;window.three.renderer.setSize(e,t),window.three.composer.setSize(e,t),window.three.camera.aspect=e/t,window.three.camera.updateProjectionMatrix()}},{key:"editAttributes",value:function(e){this.select(null),this.objectsGroup.children.forEach((function(e){e._visible=e.visible,e.visible=!1})),console.log(e),e.visible=!0,this.editingObj=e,this.mode="Attributes"}},{key:"exitEditAttributes",value:function(){this.objectsGroup.children.forEach((function(e){e.visible=!0})),this.editingObj=null,this.mode="Scene"}}]),e}(),j={name:"ThreeView",data:function(){return{three:new y}},mounted:function(){window.three=this.three,this.three.setup(this.$refs),this.three.start()},methods:{onMouseMove:function(e){this.three.pointer.x=e.offsetX/e.target.width*2-1,this.three.pointer.y=-e.offsetY/e.target.height*2+1},onMouseDown:function(){var e=this;if(this.three.raycaster.setFromCamera(this.three.pointer,this.three.camera),"Scene"===this.three.mode){var t=this.three.raycaster.intersectObjects(this.three.interactiveGroup.children);if((t=t.filter((function(e){return"Mesh"===e.object.type}))).length>0){console.log("raytrace intersects",t);var n=t[0].object;this.three.select(n)}else this.three.select()}else"Attributes"===this.three.mode&&this.three.editingObj.children.forEach((function(t){var n=e.three.raycaster.intersectObject(t);console.log(n)}))}}},C=n(54),k=n(52),x=n.n(k),O=n(670),component=Object(C.a)(j,(function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("v-container",{ref:"container",staticClass:"pa-0 ma-0",attrs:{fluid:"","fill-height":""}},[n("div",{ref:"canvas",on:{mousemove:e.onMouseMove,dblclick:e.onMouseDown}})])}),[],!1,null,null,null);t.default=component.exports;x()(component,{VContainer:O.a})},692:function(e,t,n){"use strict";n.r(t);var r={components:{ThreeView:n(675).default},name:"IndexPage"},o=n(54),component=Object(o.a)(r,(function(){var e=this.$createElement;return(this._self._c||e)("ThreeView")}),[],!1,null,null,null);t.default=component.exports;installComponents(component,{ThreeView:n(675).default})}}]);