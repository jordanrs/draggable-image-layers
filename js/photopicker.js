(function($) {

  var defaults = {
    'height': '500',
    'width': '500',
    'zOffset': '10',
    'draggable': true,
    'resizable': true
  };
  // will be the jquery selection of the images
  var images;
  var settings = {};
  
  var layerImages = function(image, count){
    var el = $(image);
    el.addClass('dragger-layer dragger-layer-' + (images.length - count));
    el.data('layer', (images.length - count));
    el.css({
      'position': 'absolute',
      'z-index': (settings.zOffset + images.length - count)
    });
  };
  
  var makeResizable = function(image){
    var el = $(image)
    if(el.hasClass('resizable')){
      el.resizable({aspectRatio: true});
    };
  };
  
  var makeDraggable = function(image){
    var el = $(image)
    var dragOptions = { containment: "parent" };
    if (el.hasClass('draggable') && !el.hasClass('resizable')){
      el.draggable(dragOptions);
    }
    else if (el.hasClass('draggable') && el.hasClass('resizable')){
      el.closest('.ui-wrapper').draggable(dragOptions);
    };
  };
  
  var setupContainers = function(){
        // setup css on the original container
        this.css({
          'display': 'block',
          'height': settings.height,
          'width': settings.width,
          'border': '1px solid black',
        });

        // wrap it all in a container and add css
        images.wrapAll("<div id='dragger-drag-container' />");
        this.children('#dragger-drag-container').css({
          'height': settings.height,
          'width': settings.width,
          'overflow': 'hidden',
          'position': 'relative',
          'top': 0,
          'left': 0
        });
  };
  
  var methods = {
    init: function(options) {
      settings = $.extend({}, defaults, options);
      
      // lets do all our css manipulations
      images = this.children('img');
      if (images.length == 0) {
        console.log('dragger - no images, aborting setup');
        return this
      }
      
      setupContainers.call(this);

      // setup each image on top of one another
      images.each(function(i) {
        layerImages(this, i);
        makeResizable(this);
        makeDraggable(this);
      });
      
    },
    getData: function() {
      var data = {};
      var position;
      images.each(function() {
        var el = $(this);
        if (el.hasClass('draggable') && el.hasClass('resizable')){
          position = el.closest('.ui-wrapper').position();
        } else {
          position = el.position();
        };
        data['image-' + el.data('layer')] = {
          image: el.attr('src'),
          position: position,
          width: el.width(),
          height: el.height(),
          layer: el.data('layer')
        }
      });
      return data;
    },
    changeLayerImage: function(layerNumber, newSource) {
      images.filter('.dragger-layer-' + layerNumber).attr('src', newSource);
    }
  };

  // nice pattern for calling methods
  $.fn.dragger = function(method) {
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
