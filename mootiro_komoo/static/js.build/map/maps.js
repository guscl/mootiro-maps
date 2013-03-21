(function(){var e=function(e,t){return function(){return e.apply(t,arguments)}},t=Object.prototype.hasOwnProperty,n=function(e,n){function i(){this.constructor=e}for(var r in n)t.call(n,r)&&(e[r]=n[r]);return i.prototype=n.prototype,e.prototype=new i,e.__super__=n.prototype,e},r=Array.prototype.indexOf||function(e){for(var t=0,n=this.length;t<n;t++)if(t in this&&this[t]===e)return t;return-1};define(["googlemaps","underscore","map/core","map/collections","map/features","map/geometries","map/controls","map/maptypes","map/providers"],function(t,i,s,o,u,a){var f,l,c,h,p,d,v,m;return window.komoo==null&&(window.komoo={}),(m=window.komoo).event==null&&(m.event=t.event),h=function(s){function f(t){var n;this.options=t!=null?t:{},this.addFeature=e(this.addFeature,this),f.__super__.constructor.call(this),this.element=(n=this.options.element)!=null?n:document.getElementById(this.options.elementId),this.features=o.makeFeatureCollectionPlus({map:this}),this.components={},this.addComponent("map/controls::Location"),this.initGoogleMap(this.options.googleMapOptions),this.initFeatureTypes(),this.handleEvents()}return n(f,s),f.prototype.featureTypesUrl="/map_info/feature_types/",f.prototype.googleMapDefaultOptions={zoom:12,center:new t.LatLng(-23.55,-46.65),disableDefaultUI:!1,streetViewControl:!0,scaleControl:!0,panControlOptions:{position:t.ControlPosition.RIGHT_TOP},zoomControlOptions:{position:t.ControlPosition.RIGHT_TOP},scaleControlOptions:{position:t.ControlPosition.RIGHT_BOTTOM,style:t.ScaleControlStyle.DEFAULT},mapTypeControlOptions:{mapTypeIds:[t.MapTypeId.ROADMAP,t.MapTypeId.HYBRID]},mapTypeId:t.MapTypeId.HYBRID},f.prototype.addControl=function(e,t){return this.googleMap.controls[e].push(t)},f.prototype.loadGeoJsonFromOptons=function(){var e,t;if(this.options.geojson)return t=this.loadGeoJSON(this.options.geojson,this.options.zoom==null),e=t.getBounds(),e!=null&&this.fitBounds(e),t!=null&&t.setMap(this,{geometry:!0,icon:!0}),this.publish("set_zoom",this.options.zoom)},f.prototype.initGoogleMap=function(e){return e==null&&(e=this.googleMapDefaultOptions),this.googleMap=new t.Map(this.element,e),this.handleGoogleMapEvents(),$(this.element).trigger("initialized",this)},f.prototype.handleGoogleMapEvents=function(){var e,t=this;return e=["click","idle","maptypeid_changed"],e.forEach(function(e){return komoo.event.addListener(t.googleMap,e,function(n){return t.publish(e,n)})})},f.prototype.initFeatureTypes=function(){var e,t=this;return this.featureTypes==null&&(this.featureTypes={}),this.options.featureTypes!=null?((e=this.options.featureTypes)!=null&&e.forEach(function(e){return t.featureTypes[e.type]=e}),this.loadGeoJsonFromOptons()):$.ajax({url:this.featureTypesUrl,dataType:"json",success:function(e){return e.forEach(function(e){return t.featureTypes[e.type]=e}),t.loadGeoJsonFromOptons()}})},f.prototype.handleEvents=function(){var e=this;return this.subscribe("features_loaded",function(t){return komoo.event.trigger(e,"features_loaded",t)}),this.subscribe("close_clicked",function(){return komoo.event.trigger(e,"close_click")}),this.subscribe("drawing_started",function(t){return komoo.event.trigger(e,"drawing_started",t)}),this.subscribe("drawing_finished",function(t,n){komoo.event.trigger(e,"drawing_finished",t,n);if(n===!1)return e.revertFeature(t);if(t.getProperty("id")==null)return e.addFeature(t)}),this.subscribe("set_location",function(n){var r;return n=n.split(","),r=new t.LatLng(n[0],n[1]),e.googleMap.setCenter(r)}),this.subscribe("set_zoom",function(t){return e.setZoom(t)})},f.prototype.addComponent=function(e,t,n){var r=this;return t==null&&(t="generic"),n==null&&(n={}),i.isString(e)?e=this.start(e,"",n):e=this.start(e),this.data.when(e).done(function(){var e,n,i,s,o;o=[];for(i=0,s=arguments.length;i<s;i++)e=arguments[i],e.setMap(r),(n=r.components)[t]==null&&(n[t]=[]),r.components[t].push(e),o.push(typeof e.enable=="function"?e.enable():void 0);return o})},f.prototype.enableComponents=function(e){var t,n=this;return(t=this.components[e])!=null?t.forEach(function(e){return typeof e.enable=="function"?e.enable():void 0}):void 0},f.prototype.disableComponents=function(e){var t,n=this;return(t=this.components[e])!=null?t.forEach(function(e){return typeof e.disable=="function"?e.disable():void 0}):void 0},f.prototype.getComponentsStatus=function(e){var t,n,i=this;return t=[],(n=this.components[e])!=null&&n.forEach(function(e){if(e.enabled===!0)return t.push("enabled")}),r.call(t,"enabled")>=0?"enabled":"disabled"},f.prototype.clear=function(){return this.features.removeAllFromMap(),this.features.clear()},f.prototype.refresh=function(){return t.event.trigger(this.googleMap,"resize")},f.prototype.saveLocation=function(e,t){return e==null&&(e=this.googleMap.getCenter()),t==null&&(t=this.getZoom()),this.publish("save_location",e,t)},f.prototype.goToSavedLocation=function(){return this.publish("goto_saved_location"),!0},f.prototype.goToUserLocation=function(){return this.publish("goto_user_location")},f.prototype.handleFeatureEvents=function(e){var t,n=this;return t=["mouseover","mouseout","mousemove","click","dblclick","rightclick","highlight_changed"],t.forEach(function(t){return komoo.event.addListener(e,t,function(r){return n.publish("feature_"+t,r,e)})})},f.prototype.goTo=function(e,t){return t==null&&(t=!0),this.publish("goto",e,t)},f.prototype.panTo=function(e,t){return t==null&&(t=!1),this.goTo(e,t)},f.prototype.makeFeature=function(e,t){var n;return t==null&&(t=!0),n=u.makeFeature(e,this.featureTypes),t&&this.addFeature(n),this.publish("feature_created",n),n},f.prototype.addFeature=function(e){return this.handleFeatureEvents(e),this.features.push(e)},f.prototype.revertFeature=function(e){if(e.getProperty("id")==null)return e.setMap(null)},f.prototype.getFeatures=function(){return this.features},f.prototype.getFeaturesByType=function(e,t,n){return this.features.getByType(e,t,n)},f.prototype.showFeaturesByType=function(e,t,n){var r;return(r=this.getFeaturesByType(e,t,n))!=null?r.show():void 0},f.prototype.hideFeaturesByType=function(e,t,n){var r;return(r=this.getFeaturesByType(e,t,n))!=null?r.hide():void 0},f.prototype.showFeatures=function(e){return e==null&&(e=this.features),e.show()},f.prototype.hideFeatures=function(e){return e==null&&(e=this.features),e.hide()},f.prototype.centerFeature=function(e,t){var n;return n=e instanceof u.Feature?e:this.features.getById(e,t),this.panTo(n!=null?n.getCenter():void 0,!1)},f.prototype.loadGeoJson=function(e,t,n){var r,i,s=this;return t==null&&(t=!1),n==null&&(n=!0),r=o.makeFeatureCollection({map:this}),(e!=null?e.type:void 0)==null||!e.type==="FeatureCollection"?r:((i=e.features)!=null&&i.forEach(function(e){var t;return t=s.features.getById(e.properties.type,e.properties.id),t==null&&(t=s.makeFeature(e,n)),r.push(t)}),t&&r.getBounds()!=null&&this.googleMap.fitBounds(r.getBounds()),this.publish("features_loaded",r),r)},f.prototype.loadGeoJSON=function(e,t,n){return this.loadGeoJson(e,t,n)},f.prototype.getGeoJson=function(e){var t;return e==null&&(e={}),e.newOnly==null&&(e.newOnly=!1),e.currentOnly==null&&(e.currentOnly=!1),e.geometryCollection==null&&(e.geometryCollection=!1),t=e.newOnly?this.newFeatures:e.currentOnly?o.makeFeatureCollection({map:this.map,features:[this.currentFeature]}):this.features,t.getGeoJson({geometryCollection:e.geometryCollection})},f.prototype.getGeoJSON=function(e){return this.getGeoJson(e)},f.prototype.drawNewFeature=function(e,t){var n;return n=this.makeFeature({type:"Feature",geometry:{type:e},properties:{name:"New "+t,type:t}}),this.publish("draw_feature",e,n)},f.prototype.editFeature=function(e,t){return e==null&&(e=this.features.getAt(0)),t!=null&&e.getGeometryType()===a.types.EMPTY?(e.setGeometry(a.makeGeometry({geometry:{type:t}})),this.publish("draw_feature",t,e)):this.publish("edit_feature",e)},f.prototype.setMode=function(e){return this.mode=e,this.publish("mode_changed",this.mode)},f.prototype.selectCenter=function(e,t){return this.selectPerimeter(e,t)},f.prototype.selectPerimeter=function(e,t){return this.publish("select_perimeter",e,t)},f.prototype.highlightFeature=function(){return this.centerFeature.apply(this,arguments),this.features.highlightFeature.apply(this.features,arguments)},f.prototype.getBounds=function(){return this.googleMap.getBounds()},f.prototype.setZoom=function(e){if(e!=null)return this.googleMap.setZoom(e)},f.prototype.getZoom=function(){return this.googleMap.getZoom()},f.prototype.fitBounds=function(e){return e==null&&(e=this.features.getBounds()),this.googleMap.fitBounds(e)},f.prototype.getMapTypeId=function(){return this.googleMap.getMapTypeId()},f}(s.Mediator),v=function(e){function t(e){t.__super__.constructor.call(this,e),this.addComponent("map/controls::AutosaveMapType"),this.addComponent("map/maptypes::CleanMapType","mapType"),this.addComponent("map/controls::DrawingManager","drawing"),this.addComponent("map/controls::SearchBox")}return n(t,e),t}(h),c=function(e){function t(e){t.__super__.constructor.call(this,e),this.addComponent("map/controls::AutosaveMapType"),this.addComponent("map/maptypes::CleanMapType"),this.addComponent("map/controls::SaveLocation"),this.addComponent("map/controls::StreetView"),this.addComponent("map/controls::DrawingManager"),this.addComponent("map/controls::DrawingControl"),this.addComponent("map/controls::GeometrySelector"),this.addComponent("map/controls::SupporterBox"),this.addComponent("map/controls::PerimeterSelector"),this.addComponent("map/controls::SearchBox")}return n(t,e),t}(h),p=function(e){function r(){r.__super__.constructor.apply(this,arguments)}return n(r,e),r.prototype.googleMapDefaultOptions={zoom:12,center:new t.LatLng(-23.55,-46.65),disableDefaultUI:!0,streetViewControl:!1,scaleControl:!0,scaleControlOptions:{position:t.ControlPosition.RIGHT_BOTTOM,style:t.ScaleControlStyle.DEFAULT},mapTypeId:t.MapTypeId.HYBRID},r}(h),d=function(e){function t(e){t.__super__.constructor.call(this,e),this.addComponent("map/controls::AutosaveMapType"),this.addComponent("map/maptypes::CleanMapType","mapType"),this.addComponent("map/controls::AutosaveLocation"),this.addComponent("map/controls::StreetView"),this.addComponent("map/controls::Tooltip","tooltip"),this.addComponent("map/controls::InfoWindow","infoWindow"),this.addComponent("map/controls::SupporterBox"),this.addComponent("map/controls::LicenseBox"),this.addComponent("map/controls::SearchBox")}return n(t,e),t.prototype.loadGeoJson=function(e,n,r){var i,s=this;return n==null&&(n=!1),r==null&&(r=!0),i=t.__super__.loadGeoJson.call(this,e,n,r),i.forEach(function(e){return e.setMap(s,{geometry:!0})}),i},t}(h),l=function(e){function t(e){t.__super__.constructor.call(this,e),this.addComponent("map/providers::FeatureProvider","provider"),this.addComponent("map/controls::FeatureClusterer","clusterer",{featureType:"Community",map:this})}return n(t,e),t}(d),f=function(e){function t(e){t.__super__.constructor.call(this,e),this.addComponent("map/controls::DrawingManager"),this.addComponent("map/controls::DrawingControl"),this.addComponent("map/controls::GeometrySelector"),this.addComponent("map/controls::PerimeterSelector"),this.goToSavedLocation()||this.goToUserLocation()}return n(t,e),t}(l),window.komoo.maps={Map:h,Preview:p,AjaxMap:l,makeMap:function(e){var t,n;e==null&&(e={}),t=(n=e.type)!=null?n:"map";if(t==="main")return new f(e);if(t==="editor")return new c(e);if(t==="view")return new l(e);if(t==="static")return new d(e);if(t==="preview"||t==="tooltip")return new p(e);if(t==="userEditor")return new v(e)}},window.komoo.maps})}).call(this);