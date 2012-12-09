(function($) {

  var defaults = {
    'height': '500',
    'width': '500',
    'zOffset': '10',
    'draggable': true
  };
  // will be the jquery selection of the images
  var images;
  var settings = {};
  var methods = {
    init: function(options) {
      settings = $.extend({}, defaults, options);
      // lets do all our css manipulations
      images = this.children('img');
      if (images.length == 0) {
        console.log('DPL - no images, aborting setup');
        return this
      }
      this.css({
        'display': 'block',
        'height': settings.height,
        'width': settings.width,
        'border': '1px solid black',
      });

      images.wrapAll("<div id='dpl-drag-container' />");

      this.children('#dpl-drag-container').css({
        'height': settings.height,
        'width': settings.width,
        'overflow': 'hidden',
        'position': 'relative',
        'top': 0,
        'left': 0
      });

      // setup each image
      images.each(function(i) {
        el = $(this);
        el.addClass('dpl-layer dpl-layer-' + (images.length - i));
        el.data('layer', (images.length - i));
        el.css({
          'position': 'absolute',
          'z-index': (settings.zOffset + images.length - i)
        });
      });

      // make it draggable when the 
      var draggable = images.filter('.draggable');
      if (settings.draggable) {
        if (draggable.length == 0) {
          images.draggable();
        } else {
          draggable.draggable().removeClass('draggable');
        }
      }
    },
    getData: function() {
      var data = {};
      images.each(function() {
        var el = $(this);
        data['image-' + el.data('layer')] = {
          image: el.attr('src'),
          positionX: el.position().left,
          positionY: el.position().top,
          layer: el.data('layer')
        }
      });
      return data;
    },
    changeLayerImage: function(layerNumber, newSource) {
      images.filter('.dpl-layer-' + layerNumber).attr('src', newSource);
    }
  };

  $.fn.dragPhotoLayers = function(method) {
    var el = this;
    // Method calling logic
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else if (typeof method === 'object' || !method) {
      return methods.init.apply(this, arguments);
    } else {
      $.error('Method ' + method + ' does not exist on jQuery.dragPhotoLayers');
    }
    // return the jquery object to enable chaning
    return this
  };
})(jQuery);
