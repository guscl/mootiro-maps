(function(){var e,t,n;e=((n=window.komooNS)!=null?n.require_baseUrl:void 0)||"/static/js",t={baseUrl:e,paths:{lib:"../lib",templates:"../templates","spock-gallery":"../spock_gallery/jquery.spock-gallery.min",jquery:"../lib/jquery-1.7.1.min",underscore:"../lib/underscore-min",backbone:"../lib/backbone-min",async:"../lib/requirejs/async",goog:"../lib/requirejs/goog",text:"../lib/requirejs/text",propertyParser:"../lib/requirejs/propertyParser",infobox:"vendor/infobox_packed",reForm:"../lib/reForm",markerclusterer:"vendor/markerclusterer_packed"},shim:{underscore:{exports:"_"},backbone:{deps:["underscore","jquery"],exports:"Backbone"},infobox:{deps:["googlemaps"],exports:"InfoBox"},reForm:{deps:["jquery","underscore","backbone"],exports:"reForm"},markerclusterer:{deps:["googlemaps"],exports:"MarkerClusterer"}},deps:["map/compat","map/utils"]},typeof requirejs!="undefined"&&requirejs!==null&&requirejs.config(t),window.require==null&&(window.require=t)}).call(this);