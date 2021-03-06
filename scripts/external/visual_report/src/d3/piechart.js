function piechart () {
    var limit = 20;
    var getAngle = function (d) {
	return (180 / Math.PI * (d.startAngle + d.endAngle) / 2 - 90);
    };
    function exports(_selection, width, height, numCol, url) {
	_selection.each(function(d, i) {

	    var context = d3.select(this).select('g.piecharts');
	    
	    if (context.empty()){
		context = d3.select(this).append('g').classed('piecharts',true);
	    }

	    var categories = d.map(function(el){
		return el.name;
	    });
	    
	    var numOrganism;
	    context.attr('transform','translate('+ (width+100) + ',' + height + ')');
	    var radius = Math.min(width, height) / 2;
	    var colors = d3.scaleOrdinal(d3.schemeCategory20b);
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
	    

            
            var aEnter = enterSelection
                    .append('a')
                    .attr('transform', 'translate(0,-100)');
	    
	    aEnter
                .append('text')
                .classed('title',true);
	    
	    aEnter
                .append('title');
	    
	    


            
	    var pieE = enterSelection
		.append('g')
	    	.classed('pie',true);
	    
	    
	    var update = enterSelection  
		.merge(updateSelection);

            var a = update
                .select('a')
                .attr('href',function(d){
                    return url + 'tree.html?' +d.name;
                });
	    a
                .select('text.title')
                .style('font-size','14px')
                .style('text-decoration','underline')
                .text(function(d){
		    var countTotal = d3.sum(d.data.map(function(el){
			return el.count;
		    }));
		    return d.name+"("+d.id+") ["+countTotal+"]";

		});
	    a
		.select('title')
		.text(function(d){
		    return d.data.map(function(obj){
			return obj.name + ' (' + obj.count + ')';
		    }).join(' | ');
		});
            
	    update.attr('transform',function(d,i){
                var column = i % numCol;
                var line   = parseInt(i / numCol);
                
	        return 'translate(' + (column * 250 ) + ', ' + ((height+200) * line) + ')';
	    });
	    
	    var pies = update
		.select('g.pie')
	    	.attr('transform',function(d,i) {
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
		    
		    return 'translate('+width/2+',0)'+
                        'rotate('+ rotate + ')';
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
		}, function(d) {return d.data.id});
	    
	    
	    var arcEnter = arcSelection
		.enter()
		.append('g')
		.classed('arc',true);

	    arcEnter
	    	.append('title');
	    
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
			xcenter = (parseInt(substringName(d.data.name).length) * 6)/2;
			transform += 'rotate(180, '+xcenter+',0)';
		    }
		    return transform;
		})
		.text(function(d){
		    return substringName(d.data.name || '') + '(' + d.data.count + ')';
		});


	    arcUpdate
		.select('title')
		.text(function(d){return d.data.name + " ("+d.data.id+")";});
	    
	    
	    function substringName (name) {
		var length = name.length;
		return (length > limit) ? name.substring(0,limit) : name;
	    }
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
