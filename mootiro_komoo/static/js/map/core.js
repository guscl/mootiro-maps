(function() {

  define(['jquery', 'underscore', 'backbone'], function($, _, Backbone) {
    'use strict';
    var Mediator, exports;
    Mediator = (function() {

      Mediator.prototype.loading = 0;

      Mediator.prototype.data = {
        deferred: $.Deferred,
        when: $.when
      };

      function Mediator() {
        this._components = {};
        this._pubQueue = [];
        this._pubsub = {};
        _.extend(this._pubsub, Backbone.Events);
      }

      Mediator.prototype._getComponent = function(component, id) {
        var components, _ref;
        components = (_ref = this._components[component]) != null ? _ref : {};
        if (!(components[id] != null)) {
          throw new Error("Could not be found a component '" + component + "' with id '" + id + "'");
        }
        return components[id];
      };

      Mediator.prototype._removeComponent = function(component, id) {
        var _ref;
        return (_ref = this._components[component]) != null ? delete _ref[id] : void 0;
      };

      Mediator.prototype.load = function(component, el, opts) {
        var componentModule, componentName, componentParts, dfd, id,
          _this = this;
        id = el;
        componentParts = component.split('::');
        componentModule = componentParts[0];
        componentName = componentParts[1];
        dfd = this.data.deferred();
        require([componentModule], (function(module) {
          var componentClass, instance;
          componentClass = module[componentName];
          try {
            instance = new componentClass(_this, el);
          } catch (e) {
            if (typeof console !== "undefined" && console !== null) {
              console.error(e.message);
            }
            if (typeof console !== "undefined" && console !== null) {
              console.warn("Could not initialize component '" + component + "'");
            }
            dfd.resolve();
            return;
          }
          return _this.data.when(instance.init(opts)).done(function() {
            _this._components[component][id].instance = instance;
            if (typeof console !== "undefined" && console !== null) {
              console.log("Component '" + component + "' initialized");
            }
            _this.publish("" + componentName + ":started", id);
            return dfd.resolve(instance);
          }).fail(function() {
            if (typeof console !== "undefined" && console !== null) {
              console.warn("Could not initialize component '" + component + "'");
            }
            return dfd.resolve(instance);
          });
        }), (function(e) {
          var failedId;
          if (e.requireType === 'timeout') {
            if (typeof console !== "undefined" && console !== null) {
              console.warn("Could not load module '" + e.requireModules + "'");
            }
          } else {
            failedId = e.requireModules && e.requireModules[0];
            require.undef(failedId);
            if (typeof console !== "undefined" && console !== null) {
              console.error(e.message);
            }
            if (typeof console !== "undefined" && console !== null) {
              console.warn("Could not initialize component '" + component + "'");
            }
          }
          return dfd.resolve();
        }));
        return dfd.promise();
      };

      Mediator.prototype.unload = function(component) {};

      Mediator.prototype.start = function(componentList, el, opts) {
        var component, componentList_, components, dfd, id, item, promises, ret, _base, _i, _len,
          _this = this;
        if (opts == null) opts = {};
        if (_.isString(componentList)) {
          componentList_ = [
            {
              component: componentList,
              el: el,
              opts: opts
            }
          ];
        } else if (!_.isArray(componentList)) {
          componentList_ = [componentList];
        } else {
          componentList_ = componentList;
        }
        if (!_.isArray(componentList_)) {
          throw new Error('componentList must be defined as an array');
        }
        promises = [];
        for (_i = 0, _len = componentList_.length; _i < _len; _i++) {
          item = componentList_[_i];
          component = item.component;
          el = item.el;
          opts = item.opts;
          this.loading++;
          id = el;
          if ((_base = this._components)[component] == null) _base[component] = {};
          components = this._components[component];
          if (components[id] != null) {
            if (typeof console !== "undefined" && console !== null) {
              console.error("Conflict: already exists one component '" + component + "' with id '" + id + "' ");
            }
          }
          this._components[component][id] = {
            type: component,
            el: el,
            opts: opts
          };
          dfd = this.data.deferred();
          promises.push(this.load(component, el, opts));
        }
        ret = this.data.when.apply($, promises);
        ret.done(function() {
          _this.loading -= arguments.length;
          return _this._processPublishQueue();
        });
        return ret;
      };

      Mediator.prototype.stop = function(component, el) {
        var cid, component_, dfd, done, id, ids, len, _i, _len;
        id = el;
        ids = !_.isArray(id) ? [id] : id;
        dfd = this.data.deferred();
        len = ids.length;
        done = 0;
        for (_i = 0, _len = ids.length; _i < _len; _i++) {
          cid = ids[_i];
          component_ = this._getComponent(component, cid);
          component_.instance.destroy().done(function() {
            $(component_.el).children().remove();
            this._removeComponent(component, cid);
            done++;
            if (done === len) return dfd.resolve();
          });
        }
        return dfd.promise();
      };

      Mediator.prototype.publish = function(message) {
        this._addToPublishQueue.apply(this, arguments);
        return this._processPublishQueue();
      };

      Mediator.prototype.subscribe = function(message, callback, context) {
        return this._pubsub.on(message, callback, context);
      };

      Mediator.prototype._addToPublishQueue = function(message) {
        return this._pubQueue.push(arguments);
      };

      Mediator.prototype._processPublishQueue = function() {
        var message;
        if (this.loading > 0) return false;
        message = this._pubQueue.shift();
        if (message != null) {
          this._pubsub.trigger.apply(this._pubsub, message);
          return this._processPublishQueue();
        }
      };

      return Mediator;

    })();
    exports = {
      Mediator: Mediator
    };
    return exports;
  });

}).call(this);
