/**
* jQuery.themeScript - $(document).ready startup function theming
* Written by Brant Burnett (http://www.btburnett.com/).
* Licensed under the GPL (http://www.gnu.org/licenses/gpl.html).
* Date: 2009/02/02
*
* @author Brant Burnett
* @version 1.0.0
*
**/

(function($) {
    var keys = {};

    var ts = $.themeScript = function(key) {
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
            return num == undefined ?
                $.makeArray(this) :
                this[num];
        },

        each: function(callback, args) {
            return $.each(this, callback, args);
        },

        exec: function() {
            var $t;
            if (this.key[0] == "-")
                $t = this.key;
            else
                if (($t = $(this.key)).size() == 0) return this;
            this.each(function() { this($t, $) });
            return this;
        },

        add: function(callback, idx) {
            if (callback) {
                if (idx && typeof idx == "string") {
                    idx = this.index(idx);
                    if (idx < 0) idx = undefined;
                }
                
                var a = (typeof callback == "function") ? [callback] : callback;
                if ((idx == undefined) || (idx >= this.length))
                    this.push.apply(this, a);
                else if (idx <= 0)
                    this.setArray(a.concat(this.get()));
                else
                    this.setArray(this.slice(0, idx).concat(a).concat(this.slice(idx)));
            }

            return this;
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
            if (typeof idx == "string")
                idx = this.index(idx);
            if (idx >= 0 && idx < this.length)
                this.splice(idx, count || 1);
            return this;
        },

        index: function(funcName) {
            for (var i = 0, l = this.length; i < l; i++)
                if (ts.getFuncName(this[i]) == funcName)
                return i;
            return -1;
        }
    };
    ts.fn.init.prototype = ts.fn;

    ts.extend = ts.fn.extend = $.extend;

    ts.each = function(callback, args) {
        $.each(keys, callback, args);
        return this;
    }

    ts.clear = function() {
        keys = {};
        return this;
    }

    ts.exec = function() {
        ts.each(function(n, v) { v.exec(); });
        return this;
    }

    ts.getFuncName = function(func) {
        var m = func.toString().match(/^function\s(\w+)/);
        return m ? m[1] : "anonymous";
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

    ts.bind();
})(jQuery);