


App.Models.dataRect = [
  {
    x: 20,
    y: 20,
    width: 800-40,
    height: 400,
    fill: '#999',
    strokeWidth: 1
  },

  {
    width: 300,
    height: 560,
    x: (800/2)-(300/2),
    y: 400+20,
    fill: '#666',
    strokeWidth: 1
  },

  {
    width: ((800-40)-300)/2,
    height: 200,
    x: 20,
    y: 400+20+40,
    fill: '#333',
    strokeWidth: 1
  }
];

App.Models.dataRect2 = [
  {
    x: 25,
    y: 25,
    width: 100,
    height: 50,
    fill: '#333',
    stroke: '#fff',
    draggable: true,
    strokeWidth: 1
  },

  {
    x: 100,
    y: 200,
    width: 30,
    height: 100,
    fill: '#333',
    stroke: '#fff',
    draggable: true,
    strokeWidth: 1
  }
];

App.Models.dataCircle = [
  {
    'x': 400,
    'y': 400,
    'radius': 70,
    'stroke': 'black',
    'fill': 'red',
    'draggable': true,
    'strokeWidth': 4
  },
  {
    'x': 500,
    'y': 200,
    'radius': 40,
    'stroke': 'black',
    'fill': 'red',
    'draggable': true,
    'strokeWidth': 4
  },
];


App.Models.dataCircleAll = [];

for(var i = 0; i < 30; i++) 
  App.Models.dataCircleAll.push({
    x: Math.random() * App.Canvas.Stage.getWidth(),
    y: Math.random() * App.Canvas.Stage.getHeight(),
    radius: 40,
    fill: '#999',
    draggable: true,
    strokeWidth: 4,
    shadowColor: 'black',
    shadowBlur: 10,
    shadowOffset: {x : 10, y : 10},
    shadowOpacity: 0.3
  });



App.Models.dataText = [
  {
    x: 250,
    y: 500,
    text: 'COMPLEX TEXT\n\nAll the world\'s a stage, and all the men and women merely players. They have their exits and their entrances.',
    fontSize: 18,
    fontFamily: 'Calibri',
    fill: '#000',
    width: 300,
    draggable: true,
    padding: 20,
    align: 'center'
  }
];


App.Models.dataContanerSlider = [
  {
    x: 20,
    y: 20,
    width: 400,
    height: 300,
    fill: '#999',
    strokeWidth: 1
  }
];
App.Models.dataSlider = [
  {
    image: 'img/darksiders_death.jpg',
    width: 400,
    //draggable: true,
    height: 300
  },
  {
    image: 'img/images.jpg',
    width: 400,
    //draggable: true,
    height: 300
  },
  {
    image: 'img/DarksidersII-5.jpg',
    width: 400,
    //draggable: true,
    height: 300
  }
];
