function piechart () {
    
    var getAngle = function (d) {
	return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
    };
    function exports(_selection, width, height) {
	_selection.each(function(d, i) {
	    
	    console.log("dans piecharts");
	    var context = d3.select(this).select('g.piecharts');
	    
	    if (context.empty()){
		context = d3.select(this).append('g').classed('piecharts',true);
	    }
		
	    
	    context.attr('transform','translate('+ (width+100) + ',' + height + ')');
	    var radius = Math.min(width, height) / 2;
	    var colors = d3.scaleOrdinal(d3.schemeCategory20b)
	    var arc = d3.arc()
		.outerRadius(radius - 10)
		.innerRadius(0);
	    
	    var labelArc = d3.arc()
		.outerRadius(radius +2)
		.innerRadius(radius +2);
	    
	    var pie = d3.pie()
		.sort(null)
		.value(function(d) { return d.count; });
	    

	    var updateSelection = context
		.selectAll('g.pieDraw')
		.data(d,function(d){return d.id;});
	    
	    
	    // ENTER
	    var enterSelection = updateSelection
		.enter()
		.append('g')
		.classed('pieDraw',true);
	    
	    
	    var pieE = enterSelection
		.append('g')
	    	.classed('pie',true);
	    
	    
	    var update = enterSelection  
		.merge(updateSelection);
	    
	    update.attr('transform',function(d,i){
		var count = d.data.length;
		var rotate = 0;
		switch (count) {
		case 1 :
		    rotate = -90;
		    break;
		case 2 :
		    rotate = 0;
		    break;
		}
		
		return 'translate(0,' + ((height+150) * i) + ')'+
		    'rotate('+ rotate + ')';
	    });
	    
	    var pies = update
		.select('g.pie')
	    	.attr('transform',function(d,i){
		    return 'translate('+width/2+',0)'
		});
	    
	    // update
	    // 	.select('text')
	    // 	.text(function(d){return d.name})
	    // 	.attr('transform','translate(0, '+ (-height/2)+')');
	    
	    
	    // EXIT
	    updateSelection.exit().remove();
	    
	    var arcSelection = pies
		.selectAll('g.arc')
		.data(function(d){
		    return pie(d.data);
		});
	    
	    
	    var arcEnter = arcSelection
		.enter()
		.append('g')
		.classed('arc',true);
	    
	    arcEnter
		.append('path')
		.attr('d',arc);
	    
	    arcEnter
	    	.append('text');
	    
	    
	    // Update
	    var arcUpdate = arcEnter
		.merge(arcSelection);
	    
	    arcUpdate
		.select('path')
	    	.style('fill',function(d){
		    var c = colors(d.data.id);
		    return c;
		});
	    
	    arcUpdate
		.select('text')
	    	.attr("transform", function(d) {
		    var angle = getAngle(d);
		    var transform = "translate(" + labelArc.centroid(d) + ")"+
			"rotate(" + getAngle(d) + ")";
			
		    if (angle > 90 && d.data.name) {
			xcenter = (parseInt(d.data.name.length) * 6)/2;
			transform += 'rotate(180, '+xcenter+',0)';
		    }
		    return transform;
		})
		.text(function(d){
		    return d.data.name;
		});

	    
	    
	    arcSelection.exit().remove();

	    //Add the labels (Put it after to be on top of arcs)
	    // var labels = pieE
	    // 	.append('text');
	    
	    
	    // labels
	    // 	.merge(updateSelection.selectAll('text'))

	    // labels.exit().remove();
	    

	});
    }
    return exports;
}
