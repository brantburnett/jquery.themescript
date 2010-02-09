/**
* @license jQuery.themeScript - jQuery theming plugin
* Copyright (c) 2009-2010 Brant Burnett (http://www.btburnett.com/).
* Licensed under the GPL (http://www.gnu.org/licenses/gpl.html).
*
* Date:		2010/02/09
* Author:	Brant Burnett
* Version:	1.1.0
*/

(function($) {
    var keys = {}
		UNDEF = undefined;
		
	function getFuncName(func) {
        var m = func.toString().match(/^function\s+([\w\d_]+)/);
        return m ? m[1] : "anonymous";
    }

    var ts = $.themeScript = $.themescript = function(key) {
        if (!key)
            return keys;
        else if (keys[key])
            return keys[key];
        else
            return keys[key] = new ts.fn.init(key);
    }

    ts.fn = ts.prototype = {
        init: function(key) {
            this.key = key;
            return this.setArray([]);
        },

        setArray: function(elems) {
            this.length = 0;
            Array.prototype.push.apply(this, elems);
            return this;
        },

        size: function() {
            return this.length;
        },

        get: function(num) {
            return num == UNDEF ?
                $.makeArray(this) :
                this[num];
        },

        each: function(callback, args) {
            return $.each(this, callback, args);
        },

        exec: function(context) {
            var self = this,
				key = self.key,
				t;
				
            if (key[0] == "-") {
                t = key;
			}
            else
                if (!(t = $(key, context)).length) return self;
            
			self.each(function() { this(t, $, context) });
			
            return self;
        },

        add: function(callback, idx) {
			var self = this;
			
            if (callback) {
                if (idx && typeof idx == "string") {
                    idx = self.index(idx);
                    if (idx < 0) idx = UNDEF;
                }
                
                var a = (typeof callback == "function") ? [callback] : callback;
                if ((idx == UNDEF) || (idx >= self.length))
                    self.push.apply(self, a);
                else if (idx <= 0)
                    self.setArray(a.concat(self.get()));
                else
                    self.setArray(self.slice(0, idx).concat(a).concat(self.slice(idx)));
            }

            return self;
        },

        push: [].push,
        concat: [].concat,
        slice: [].slice,
        splice: [].splice,

        clear: function() {
            this.length = 0;
            return this;
        },

        remove: function(idx, count) {
			var self = this;
			
            if (typeof idx == "string")
                idx =  self.index(idx);
            if (idx >= 0 && idx <  self.length)
                 self.splice(idx, count || 1);
            return  self;
        },

        index: function(funcName) {
            for (var i = 0, l = this.length; i < l; i++)
                if (getFuncName(this[i]) == funcName)
                return i;
            return -1;
        }
    };
    ts.fn.init.prototype = ts.fn;
	
	$.fn.themescript = function(url, params, callback) {
		if (!this.length) return this;
		
		if (url == UNDEF) {
			ts.exec(this);
		} else {
			if (params && $.isFunction(params)) {
				callback = params;
				params = null;
			}
			
			this.load(url, params, function(responseText, res, status) {
				if (status === "success" || status === "notmodified")
					ts.exec(this);
				if (callback)
					this.each(callback, [responseText, res, status]);
			});
		}
		
		return this;
	}

    ts.extend = ts.fn.extend = $.extend;

    ts.each = function(callback, args) {
        $.each(keys, callback, args);
        return this;
    }

    ts.clear = function() {
        keys = {};
        return this;
    }

    ts.exec = function(context) {
        ts.each(function(n, v) { v.exec(context); });
        return this;
    }

    var bound = false;

    ts.bind = function() {
        if (!bound) {
            $(ts.exec);
            bound = true;
        }
        return this;
    }

    ts.unbind = function() {
        if (bound) {
            var i = $.inArray(ts.exec, $.readyList);
            if (i >= 0) $.readyList.splice(i, 1);
            bound = false;
        }
        return this;
    }
})(jQuery);