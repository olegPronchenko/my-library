var int = (function(w){
	var i,
	globObj,
	arrayCounts = [],
	allElements = function(e,cb){
    for(i=0;i<e.length;i++) cb(e[i],i);
  };
	return {
		start: function(obj){
			globObj = obj;
			allElements(obj,function(all,index){
				var interval,
				bodyInterval = function(){
					if(arrayCounts[index][1] == 'plus') arrayCounts[index][0]++;
					else if(arrayCounts[index][1] == 'minus') arrayCounts[index][0]--;


					if(arrayCounts[index][0] == (all.checkLast?all.checkLast:all.lastCount)) {

						if(all.changeLastCount === undefined) arrayCounts[index][0] = 0;
						else arrayCounts[index][0] = all.changeLastCount;

						all.endInterval(arrayCounts[index][0],'last');

						if(all.stopInterval == true)
							clearInterval(interval);
					} else if(arrayCounts[index][0] == (all.checkFirst?all.checkFirst:0)) {

						if(all.changeFirstCount === undefined) arrayCounts[index][0] = all.lastCount;
						else arrayCounts[index][0] = all.changeFirstCount;

						all.endInterval(arrayCounts[index][0],'first');
					} else {
						all.startInterval(arrayCounts[index][0]);
					}
				};


				if(all.autoplay == true)
				interval = setInterval(bodyInterval,all.step);

			arrayCounts.push(
				[0,
				(all.plus?'plus':'minus'),
				all.startInterval,
				all.lastCount,
				all.endInterval,
				all.checkFirst||false,
				all.checkLast||false,
				interval,
				bodyInterval,
				all.step,
				all.changeFirstCount||false,
				all.changeLastCount||false]
				);
			});
		},
		changeCount: function(n,objVal){
			if(objVal.count)
				arrayCounts[n][0] = objVal.count;
			if(objVal.minusPlus)
				arrayCounts[n][1] = objVal.minusPlus;
		},
		nextInt: function(n,mp){
			if(typeof mp === 'string') {
				if(mp == 'plus') arrayCounts[n][0]++;
				else if(mp == 'minus') arrayCounts[n][0]--;
			} else arrayCounts[n][0] = mp;


			if(arrayCounts[n][0] == (arrayCounts[n][6]!=false?arrayCounts[n][6]:arrayCounts[n][3])) {

				if(arrayCounts[n][11]==false) arrayCounts[n][0] = 0;
				else arrayCounts[n][0] = arrayCounts[n][11];

				arrayCounts[n][4](arrayCounts[n][0],'last');
			} else if(arrayCounts[n][0] == (arrayCounts[n][5]!=false?arrayCounts[n][5]:0)) {

				if(arrayCounts[n][10]==false) arrayCounts[n][0] = arrayCounts[n][3];
				else arrayCounts[n][0] = arrayCounts[n][10];

				arrayCounts[n][4](arrayCounts[n][0],'first');
			} else {
				//console.log(1);
				arrayCounts[n][2](arrayCounts[n][0]);
			}

		},
		startInt: function(n){
			arrayCounts[n][7] = setInterval(arrayCounts[n][8],arrayCounts[n][9]);
		},
		stopInt: function(n){
			clearInterval(arrayCounts[n][7]);
		},
		array: function(){
			return arrayCounts;
		}
	};
})(window);
