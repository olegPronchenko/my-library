







// Create new layers and adding new models
App.Views = new ViewKonva(function(mainObj){

  mainObj.dataResponsive.push(function(){
    mainObj.WidthCanvas();
  });
  mainObj.Resize(mainObj.dataResponsive);

  return [
    // slider
    {
      models: [
        mainObj.Slider({
          slides: App.Models.dataSlider,
          width: 600,
          height: 400,
          x: 100,
          y: 100,
          speed: 500,
          interval: 2000
        })
      ]
    },

    // Circles
    {
      models: [
        {
          dataModel: App.Models.dataCircleAll,
          render: function(stage, layer, data, index){
              this.model = new Konva.Circle(data);
          },
          initialize: function(stage, layer, models, index){

/*            for(var i = 0; i < this.dataModel.length; i++) 
              new Konva.Tween({
                node: models,
                duration: 4,
                x: Math.random() * stage.width(),
                y: Math.random() * stage.height(),
              }).play();*/

          },
          layer: function(stage, layer, index){},
          group: function(stage, layer, group, index){}
        }
      ]
    }

  ];

});

