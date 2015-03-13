







// Create new layers and adding new models
App.Prototypes = new ViewKonva(function(obj){

  obj.WidthCanvas();
  obj.dataResponsive.push(function(){
    obj.WidthCanvas();
  });
  obj.Resize(obj.dataResponsive);

  return [

    {
      models: [
        obj.Slider({
          slides:App.Models.dataSlider,
          width: 600,
          height: 400,
          x: 100,
          y: 100,
          speed: 500,
          interval: 2000
        })
      ]
    }

  ];

});

