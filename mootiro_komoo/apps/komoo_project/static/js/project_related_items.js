(function() {

  define(['lib/underscore-min', 'lib/backbone-min'], function() {
    var $;
    $ = jQuery;
    window.PartnersLogo = Backbone.Model.extend({
      toJSON: function(attr) {
        return Backbone.Model.prototype.toJSON.call(this, attr);
      }
    });
    window.PartnersLogoView = Backbone.View.extend({
      className: 'partner-logo',
      tagName: 'li',
      initialize: function() {
        _.bindAll(this, 'render');
        return this.template = _.template("<a href=\"<%= url %>\">\n    <img src=\"<%= url %>\" class=\"ad_image_gallery_thumb\" />\n</a>");
      },
      render: function() {
        var renderedContent;
        console.log('rendering model: ', this.model.toJSON());
        renderedContent = this.template(this.model.toJSON());
        $(this.el).html(renderedContent);
        return this;
      }
    });
    window.PartnersLogos = Backbone.Collection.extend({
      model: PartnersLogo
    });
    window.PartnersLogosView = Backbone.View.extend({
      initialize: function() {
        _.bindAll(this, 'render');
        this.template = _.template("<div class=\"proj-partners-title\">Parceiros:</div>\n<div id=\"logos-gallery\" class=\"ad-gallery\">\n    <div class=\"ad-image-wrapper\"></div>\n    <div class=\"ad-controls\"></div>\n    <div class=\"ad-nav\">\n        <div class=\"ad-thumbs\">\n            <ul class=\"ad-thumb-list\"></ul>\n        </div>\n    </div>\n</div>");
        return this.collection.bind('reset', this.render);
      },
      render: function() {
        var $gallery, $logos, collection;
        collection = this.collection;
        this.$el.html(this.template());
        $logos = this.$('.ad-thumb-list');
        $gallery = this.$('#logos-gallery');
        collection.each(function(logo) {
          var view;
          console.log('-----', logo);
          view = new PartnersLogoView({
            model: logo
          });
          return $logos.append(view.render().$el);
        });
        $gallery.adGallery({
          width: 250,
          height: 150,
          update_window_hash: false,
          slideshow: {
            enable: true,
            autostart: true,
            speed: 3500
          }
        });
        return this;
      }
    });
    return $(function() {
      var panelInfoView, partnersLogosView;
      KomooNS.drawFeaturesList();
      panelInfoView = new PanelInfoView({
        model: new PanelInfo(KomooNS.obj)
      });
      $('.panel-info-wrapper').append(panelInfoView.render().$el);
      partnersLogosView = new PartnersLogosView({
        collection: new PartnersLogos().reset(KomooNS.obj.partners_logo)
      });
      return $('.panel-info-wrapper').append(partnersLogosView.render().$el);
    });
  });

}).call(this);