

// Performs specific actions for each model
App.Methods.AllElements = function(array, callback){
	array.forEach(callback);
};

// Loading one image
App.Methods.LoadOneImage = function(image){
  var imageObj = new Image();
  imageObj.onload = function() {
    image.after(this, image.node);
  };
  imageObj.src = image.url;
};

// Loading for all images
App.Methods.LoadImages = function(models,cb){
  var index = 0,
 			img = [],
  		dataImg = [];
  App.Methods.AllElements(models, function(data, i){
    dataImg[i] = data;
    img[i]=new Image();
    img[i].onload = function(event){
      cb(this, dataImg[index], index);
      index++;
    };
    img[i].src = data.image;
  });
};



// Create layers, models
App.Methods.View = function(object) {
	var canvas = App.Canvas.Stage,
		  messageError = function(message) {
		    console.log('Error: Missing '+message);
		    return;
		  };
  App.Methods.AllElements(object, function(obj, indexLayer){
    var layer = new Konva.Layer;
    if(!layer) messageError('layer! array['+indexLayer+']');
    if(!obj.models) messageError('model! array['+indexLayer+']');
    else {
	    App.Methods.AllElements(obj.models, function(models, indexView){
	      var path = 'array['+indexLayer+']['+indexView+']',
	      		group = new Konva.Group;

	      if(models.render) {

          if(models.group) models.group(canvas, layer, group, indexView);
          if(models.layer) models.layer(canvas, layer, indexView);
          
		      if(models.dataModel[0].image) {
	          App.Methods.LoadImages(models.dataModel,function(img, d, i){

	            d.image = img;
	            models.render(canvas, layer, d, img, i);
	            if(models.model) {
		            group.add(models.model);
	          	} else messageError('model! '+path );
		          layer.add(group);
		          canvas.add(layer);

	            if(models.initialize)
	              models.initialize(canvas, layer, group.children[i], img, i);

	          });
		      } else {
	          App.Methods.AllElements(models.dataModel, function(dataModel, i){
	            models.render(canvas, layer, dataModel, i);
	            if(models.model) {
	              group.add(models.model);
	            } else messageError('model! '+path );
	          });
		        layer.add(group);
		        canvas.add(layer);
		        if(models.initialize)
		        App.Methods.AllElements(group.children, function(children, i){
		          models.initialize(canvas, layer, children, i);
		        });
		      }



	    	} else messageError('render! '+path);
	    });
		}
  });
};



App.Methods.dataResponsive = [];

App.Methods.Screen = function(value, callBack) {
  var regScreen = /[^0-9]+/,
      regWH = value.replace(/[max-]|[0-9]/g, ''),
      upperCase = function(m){ return 'inner'+m.toUpperCase(); }
  if(window[regWH.replace(/\w/, upperCase)] <= value.replace(regScreen, '')) callBack(value);
};

App.Methods.Events = function(element, event, anons){
  if(element.addEventListener) element.addEventListener(event, anons, false);
  else element.attachEvent(event, anons);
};

App.Methods.Resize = function(methods) {
  App.Methods.Events(window, 'resize', function(){
    for(var i = 0; i < methods.length; i++) methods[i](i);
  });
};

App.Methods.Responsive = function(elementWidth, reletiveWidth) {
  return (elementWidth - (App.Canvas.MainWidth - reletiveWidth));
};

App.Methods.StyleElement = function(element, property){
  if(window.getComputedStyle(element) != undefined)
  return window.getComputedStyle(element).getPropertyValue(property);
};

App.Methods.WidthCanvas = function() {
  var conteiner = parseInt(App.Methods.StyleElement(document.getElementById('container'),'width'));
  App.Canvas.Stage.width(conteiner);
};







App.Methods.Slider = function(obj){
	return  {
        dataModel: obj.slides,
        render: function(canvas, layer, data, index){
          this.model = new Konva.Image(data);
        },
        initialize: function(canvas, layer, models, image, index){

          models.position({
            x: obj.x + (App.Methods.Responsive(obj.width, layer.width()) * index),
            y: obj.y
          });

          models.width(App.Methods.Responsive(obj.width, layer.width()));
          models.height(obj.height);

          App.Methods.dataResponsive.push(function(){
            models.width(App.Methods.Responsive(obj.width, layer.width()));
            models.x(obj.x + (App.Methods.Responsive(obj.width, layer.width()) * index));
          });

          layer.draw();
        },
        layer: function(canvas, layer, index){

          layer.setClip({
            x: obj.x,
            y: obj.y,
            width: App.Methods.Responsive(obj.width, canvas.width()),
            height: obj.height
          });

          App.Methods.dataResponsive.push(function(){
            layer.clipWidth( App.Methods.Responsive(obj.width, canvas.width()) );
          });

        },
        group: function(canvas, layer, group, index){

          var count = 0,
              interval,
              allSlide = this.dataModel.length,
              activatePop = false;

            interval = setInterval(function(){
              count--;
/*              if(activatePop) App.Methods.dataResponsive.pop();

              App.Methods.dataResponsive.push(function(){
                group.x( App.Methods.Responsive(obj.width, layer.width())*(count===0?(-(allSlide+1)):count) );
              });
              
              activatePop = true;*/

              var tween = new Konva.Tween({
                  node: group,
                  duration: obj.speed/1000,
                  x: App.Methods.Responsive(obj.width, layer.width())*count
              });

              tween.play();

              if(count === (-(allSlide-1))) {
                count = 1;
              }

              
            },(obj.interval)+(obj.speed));



        }
      };
};




