(function(){define(["jquery","map/maps"],function(e,t){return function(e){var n,r,i,s;return r=function(e){var t;return t=e.data.map,n(t),i(t),t.refresh()},n=function(t,n){var r,i;return n==null&&(n=e("#map-panel")),r=e("body").innerHeight()-e("#top").innerHeight()-e(".upper_bar").innerHeight()-5,e(t.element).height(r),n.height(r),i=e(".panel-info-wrapper"),i&&(r-=i.height()+30),e(".panel",n).height(r-146)},i=function(t,n){var r,i;n==null&&(n=e("#map-panel")),i=n.innerWidth();try{r=n.position().left}catch(s){r=0}return e(t.element).css({marginLeft:i+r,width:"auto"})},s={init:function(n){return this.each(function(){var i,s,o,u,a,f;i=e(this),i.addClass("komoo-map-googlemap"),o=e.extend({element:i.get(0)},e.fn.komooMap.defaults,n),o.width!=null&&i.width(o.width),o.height!=null&&i.height(o.height);if((o!=null?o.type:void 0)==="preview"&&!(o!=null?(u=o.geojson)!=null?(a=u.features)!=null?(f=a[0])!=null?f.geometry:void 0:void 0:void 0:void 0)&&(o!=null?!o.force:!void 0)){i.html(e("<div>").addClass("placeholder").text("Informação geométrica não disponível")),i.parent().parent().find(".see-on-map").hide();return}s=t.makeMap(o),i.data("map",s),o.mapType!=null&&s.googleMap.setMapTypeId(o.mapType);if(o.height==="100%")return e(window).resize({map:s},r),e(window).resize()})},edit:function(t){var n;return(n=e(this).data("map"))!=null&&n.editFeature(t),e(this)},geojson:function(t){var n,r;return t==null?(n=e(this).data("map"))!=null?n.getGeoJson():void 0:(r=e(this).data("map"))!=null?r.loadGeoJson(t):void 0},goTo:function(t){var n,r;return(n=e(this).data("map"))!=null&&n.panTo((r=t.position)!=null?r:t.address,t.displayMarker),e(this)},highlight:function(t){var n;return(n=e(this).data("map"))!=null&&n.highlightFeature(t.type,t.id),e(this)},resize:function(){return e(window).resize()}},e.fn.komooMap=function(t){return s[t]?s[t].apply(this,Array.prototype.slice.call(arguments,1)):typeof t=="object"||!t?s.init.apply(this,arguments):e.error("Method "+t+" does not exist on jQuery.komooMap")},e.fn.komooMap.defaults={type:"editor"}}(e)})}).call(this)