




App.Methods.WidthCanvas();
App.Methods.dataResponsive.push(App.Methods.WidthCanvas);
App.Methods.Resize(App.Methods.dataResponsive);


// Create new layers and adding new models
App.Methods.View([

  {
    models: [
      App.Methods.Slider({
        slides:App.Models.dataSlider,
        width: 600,
        height: 400,
        x: 100,
        y: 100,
        speed: 500,
        interval: 2000
      })
    ]
  },




]);
