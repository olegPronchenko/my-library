



// Create layers, models
function ViewKonva(array) {
  this.all = array(this);
  var mainObj = this,
      stage = App.Canvas.Stage,
      messageError = function(message) {
        console.log('Error: Missing '+message);
        return;
      };
  mainObj.AllElements(this.all, function(obj, indexLayer){
    var layer = new Konva.Layer;
    if(!layer) messageError('layer! array['+indexLayer+']');
    if(!obj.models) messageError('model! array['+indexLayer+']');
    else {
      mainObj.AllElements(obj.models, function(models, indexView){
        var path = 'array['+indexLayer+']['+indexView+']',
            group = new Konva.Group;

        if(models.render) {

          if(models.group) models.group(stage, layer, group, indexView);
          if(models.layer) models.layer(stage, layer, indexView);

          if(models.dataModel[0].image) {
            mainObj.LoadImages(models.dataModel,function(img, d, i){

              d.image = img;
              models.render(stage, layer, d, img, i);
              if(models.model) {
                group.add(models.model);
              } else messageError('model! '+path );

              layer.add(group);
              stage.add(layer);

              if(models.initialize)
                models.initialize(stage, layer, group.children[i], img, i);

            });
          } else {
            mainObj.AllElements(models.dataModel, function(dataModel, i){
              models.render(stage, layer, dataModel, i);
              if(models.model) {
                group.add(models.model);
              } else messageError('model! '+path );
            });

            layer.add(group);
            stage.add(layer);

            if(models.initialize)
            mainObj.AllElements(group.children, function(children, i){
              models.initialize(stage, layer, children, i);
            });
          }

        } else messageError('render! '+path);
      });
    }
  });
}

// data array for Responsive
ViewKonva.prototype.dataResponsive = [];

// Performs specific actions for each model
ViewKonva.prototype.AllElements = function(array, callback){
  array.forEach(callback);
}
ViewKonva.prototype.DefoultallElements = function(array, callback){
  for(var i = 0; i < array; i++) callback(array[i], i); 
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




// for check screen size
ViewKonva.prototype.Screen = function(value, callBack) {
  var regScreen = /[^0-9]+/,
      regWH = value.replace(/[max-]|[0-9]/g, ''),
      upperCase = function(m){ return 'inner'+m.toUpperCase(); }
  if(window[regWH.replace(/\w/, upperCase)] <= value.replace(regScreen, '')) callBack(value);
}

// for event 'resize'
ViewKonva.prototype.Events = function(element, event, anons){
  if(element.addEventListener) element.addEventListener(event, anons, false);
  else element.attachEvent(event, anons);
}

// event 'resize' for Responsive
ViewKonva.prototype.Resize = function(methods) {
  this.Events(window, 'resize', function(){
    for(var i = 0; i < methods.length; i++) methods[i](i);
  });
}

// calculating for Responsive
ViewKonva.prototype.Responsive = function(elementWidth, reletiveWidth) {
  return (elementWidth - (App.Canvas.MainWidth - reletiveWidth));
}

// for return style
ViewKonva.prototype.StyleElement = function(element, property){
  if(window.getComputedStyle(element) != undefined)
  return window.getComputedStyle(element).getPropertyValue(property);
}

// replace width of the Canvas on the width of the Container
ViewKonva.prototype.WidthCanvas = function() {
  var conteiner = parseInt(this.StyleElement(App.Canvas.Stage.container(),'width'));
  App.Canvas.Stage.width(conteiner);
}




// Set interval
ViewKonva.prototype.AllIntervals = [];
ViewKonva.prototype.SetInt = function(array) {
  var mainObj = this;
  mainObj.allIntervals = array;
  mainObj.AllElements(mainObj.allIntervals, function(all, index){

      all.next = function() {
        all.startCount = all.startCount + all.countInterval;

        var checkEnd = (all.startCount === all.changeCountCheckStart),
            checkStart = (all.startCount === all.changeCountCheckEnd);

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
      };
    if(all.autoplay) {
      all.play = function() {
        all.interval = setInterval(all.next, all.step);
      };
      all.pause = function() {
        clearInterval(all.interval);
      };
    }

  });
}



// Slider
ViewKonva.prototype.Slider = function(obj) {
  var mainObj = this;
  
  return  {
        dataModel: obj.slides,
        render: function(stage, layer, data, index){
          this.model = new Konva.Image(data);
        },
        initialize: function(stage, layer, models, image, index){

          models.position({
            x: obj.x + (mainObj.Responsive(obj.width, layer.width()) * index),
            y: obj.y
          });

          models.width(mainObj.Responsive(obj.width, layer.width()));
          models.height(obj.height);

          mainObj.dataResponsive.push(function(){
            models.width(mainObj.Responsive(obj.width, layer.width()));
            models.x(obj.x + (mainObj.Responsive(obj.width, layer.width()) * index));
          });

          layer.draw();
        },
        layer: function(stage, layer, index){

          layer.setClip({
            x: obj.x,
            y: obj.y,
            width: mainObj.Responsive(obj.width, stage.width()),
            height: obj.height
          });

          mainObj.dataResponsive.push(function(){
            layer.clipWidth( mainObj.Responsive(obj.width, stage.width()) );
          });

          layer.on('mouseover', mainObj.allIntervals[index].pause)
          .on('mouseout', mainObj.allIntervals[index].play);

        },
        group: function(stage, layer, group, index){

          var allSlide = this.dataModel.length,
              activatePop = false;

          mainObj.AllIntervals.push({
            step: (obj.interval)+(obj.speed),
            countInterval: -1,
            autoplay: true,
            startCount: 0,
            endCount: -2,
            changeCountCheckStart: -2,
            changeCountCheckEnd: 1,
            startInterval: function(count){
              if(activatePop) mainObj.dataResponsive.pop();
              mainObj.dataResponsive.push(function(){
                group.x( mainObj.Responsive(obj.width, layer.width())*(count) );
              });
              activatePop = true;
              new Konva.Tween({
                  node: group,
                  duration: obj.speed/1000,
                  x: mainObj.Responsive(obj.width, layer.width())*count
              }).play();
            },
            checkCountInterval: function(count, check){
              if(check() === 'end') {}
              if(check() === 'start') {}
            }
          });

          // add all Intervals
          mainObj.SetInt(mainObj.AllIntervals);
          // Play Interval
          mainObj.allIntervals[index].play();


        }
      };

}




