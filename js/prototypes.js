



// Create layers, models
function ViewKonva(array) {
  this.all = array(this);
  var thisObj = this;
  var canvas = App.Canvas.Stage,
		  messageError = function(message) {
		    console.log('Error: Missing '+message);
		    return;
		  };
  thisObj.AllElements(this.all, function(obj, indexLayer){
    var layer = new Konva.Layer;
    if(!layer) messageError('layer! array['+indexLayer+']');
    if(!obj.models) messageError('model! array['+indexLayer+']');
    else {
	    thisObj.AllElements(obj.models, function(models, indexView){
	      var path = 'array['+indexLayer+']['+indexView+']',
	      		group = new Konva.Group;

	      if(models.render) {

          if(models.group) models.group(canvas, layer, group, indexView);
          if(models.layer) models.layer(canvas, layer, indexView);

		      if(models.dataModel[0].image) {
	          thisObj.LoadImages(models.dataModel,function(img, d, i){

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
	          thisObj.AllElements(models.dataModel, function(dataModel, i){
	            models.render(canvas, layer, dataModel, i);
	            if(models.model) {
	              group.add(models.model);
	            } else messageError('model! '+path );
	          });
		        layer.add(group);
		        canvas.add(layer);
		        if(models.initialize)
		        thisObj.AllElements(group.children, function(children, i){
		          models.initialize(canvas, layer, children, i);
		        });
		      }

	    	} else messageError('render! '+path);
	    });
		}
  });
}


ViewKonva.prototype.dataResponsive = [];

// Performs specific actions for each model
ViewKonva.prototype.AllElements = function(array, callback){
  array.forEach(callback);
}

// Loading one image
ViewKonva.prototype.LoadOneImage = function(image){
  var imageObj = new Image();
  imageObj.onload = function() {
    image.after(this, image.node);
  };
  imageObj.src = image.url;
}

// Loading for all images
ViewKonva.prototype.LoadImages = function(models,cb){
  var index = 0,
      img = [],
      dataImg = [];
  this.AllElements(models, function(data, i){
    dataImg[i] = data;
    img[i]=new Image();
    img[i].onload = function(event){
      cb(this, dataImg[index], index);
      index++;
    };
    img[i].src = data.image;
  });
}





ViewKonva.prototype.Screen = function(value, callBack) {
  var regScreen = /[^0-9]+/,
      regWH = value.replace(/[max-]|[0-9]/g, ''),
      upperCase = function(m){ return 'inner'+m.toUpperCase(); }
  if(window[regWH.replace(/\w/, upperCase)] <= value.replace(regScreen, '')) callBack(value);
}

ViewKonva.prototype.Events = function(element, event, anons){
  if(element.addEventListener) element.addEventListener(event, anons, false);
  else element.attachEvent(event, anons);
}

ViewKonva.prototype.Resize = function(methods) {
  this.Events(window, 'resize', function(){
    for(var i = 0; i < methods.length; i++) methods[i](i);
  });
}

ViewKonva.prototype.Responsive = function(elementWidth, reletiveWidth) {
  return (elementWidth - (App.Canvas.MainWidth - reletiveWidth));
}

ViewKonva.prototype.StyleElement = function(element, property){
  if(window.getComputedStyle(element) != undefined)
  return window.getComputedStyle(element).getPropertyValue(property);
}

ViewKonva.prototype.WidthCanvas = function() {
  //console.log(this);
  var conteiner = parseInt(this.StyleElement(App.Canvas.Stage.container(),'width'));
  App.Canvas.Stage.width(conteiner);
}





ViewKonva.prototype.SetInt = function(array) {
  var thisObj = this;
  this.allIntervals = array;
  thisObj.AllElements(this.allIntervals, function(all, index){

    if(all.autoplay)
    all.interval = setInterval(function(){
      all.startCount = all.startCount + all.countInterval;

      var checkEnd = (all.startCount === all.changeCountCheckStart);
      var checkStart = (all.startCount === all.changeCountCheckEnd);

      if(all.startInterval)
        all.startInterval(all.startCount);

      if(all.checkCountInterval && checkEnd || checkStart) {
        all.checkCountInterval(all.startCount, function(){
          if(checkEnd) {
            all.startCount = all.changeCountCheckEnd;
            return 'end';
          }
          if(checkStart) {
            all.startCount = all.changeCountCheckStart;
            return 'start';
          }
        });
      }

    }, all.step);

  });
}




ViewKonva.prototype.Slider = function(obj) {
  var thisObj = this;
	return  {
        dataModel: obj.slides,
        render: function(canvas, layer, data, index){
          this.model = new Konva.Image(data);
        },
        initialize: function(canvas, layer, models, image, index){

          models.position({
            x: obj.x + (thisObj.Responsive(obj.width, layer.width()) * index),
            y: obj.y
          });

          models.width(thisObj.Responsive(obj.width, layer.width()));
          models.height(obj.height);

          thisObj.dataResponsive.push(function(){
            models.width(thisObj.Responsive(obj.width, layer.width()));
            models.x(obj.x + (thisObj.Responsive(obj.width, layer.width()) * index));
          });

          layer.draw();
        },
        layer: function(canvas, layer, index){

          layer.setClip({
            x: obj.x,
            y: obj.y,
            width: thisObj.Responsive(obj.width, canvas.width()),
            height: obj.height
          });

          thisObj.dataResponsive.push(function(){
            layer.clipWidth( thisObj.Responsive(obj.width, canvas.width()) );
          });

        },
        group: function(canvas, layer, group, index){

          var allSlide = this.dataModel.length,
              activatePop = false;


          thisObj.SetInt([
            {
              step: (obj.interval)+(obj.speed),
              countInterval: -1,
              autoplay: true,
              startCount: 0,
              endCount: -2,
              changeCountCheckStart: -2,
              changeCountCheckEnd: 1,
              startInterval: function(count){
                if(activatePop) thisObj.dataResponsive.pop();

                thisObj.dataResponsive.push(function(){
                  group.x( thisObj.Responsive(obj.width, layer.width())*(count) );
                });

                activatePop = true;

                var tween = new Konva.Tween({
                    node: group,
                    duration: obj.speed/1000,
                    x: thisObj.Responsive(obj.width, layer.width())*count
                });

                tween.play();
              },
              checkCountInterval: function(count, check){
                if(check() === 'end') {}
                if(check() === 'start') {}
              }
            }
          ]);



        }
      };
}




