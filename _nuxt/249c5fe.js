(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{524:function(e,t,n){"use strict";n.r(t);var r=n(1),o=(n(45),n(61),n(11),n(9),n(10),n(5),n(14),n(8),n(15),n(227)),c=n(525),h=n(526),d=n(527),l=n(78);function w(object,e){var t=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);e&&(n=n.filter((function(e){return Object.getOwnPropertyDescriptor(object,e).enumerable}))),t.push.apply(t,n)}return t}var m={name:"ThreeView",data:function(){return{scene:new o.ib,camera:new o.ab(75,window.innerWidth/window.innerHeight,.1,1e3),controls:[],renderer:new o.xb({antialias:!0,width:500,height:window.innerHeight}),light:new o.m("hsl(0, 100%, 100%)"),axes:new o.c(5),clock:new o.i,speed:.01}},created:function(){this.scene.add(this.camera),this.scene.add(this.light),this.scene.add(this.axes),this.light.position.set(0,0,10),this.camera.position.z=5,this.scene.background=new o.j("hsl(0, 100%, 100%)")},mounted:function(){var e,t=this;this.$refs.canvas.appendChild(this.renderer.domElement),this.controls=new c.a(this.camera,this.renderer.domElement),this.updateDimensions(),window.addEventListener("resize",this.updateDimensions),this.controls.rotateSpeed=1,this.controls.zoomSpeed=5,this.controls.panSpeed=.8,this.controls.noZoom=!1,this.controls.noPan=!1,this.controls.staticMoving=!0,this.controls.dynamicDampingFactor=.3,window.loader=new h.a,e=window.location.host.includes("localhost")?"/studio_small_08_4k.hdr":"/GLTF_viewer/studio_small_08_4k.hdr",(new d.a).load(e,(function(e){e.mapping=o.o,t.scene.background=e,t.scene.environment=e})),window.scene=this.scene,this.animate()},methods:function(e){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?w(Object(source),!0).forEach((function(t){Object(r.a)(e,t,source[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(source)):w(Object(source)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(source,t))}))}return e}({animate:function(){requestAnimationFrame(this.animate),this.renderer.render(this.scene,this.camera),this.controls.update(),window.mixer&&window.mixer.update(this.clock.getDelta())},updateDimensions:function(){var e=this.$refs.container.clientWidth,t=this.$refs.container.clientHeight;this.renderer.setSize(e,t),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()}},Object(l.c)(["setScene"]))},f=m,O=n(93),v=n(111),j=n.n(v),y=n(539),component=Object(O.a)(f,(function(){var e=this.$createElement,t=this._self._c||e;return t("v-container",{ref:"container",staticClass:"pa-0 ma-0",attrs:{fluid:"","fill-height":""}},[t("div",{ref:"canvas"})])}),[],!1,null,null,null);t.default=component.exports;j()(component,{VContainer:y.a})}}]);