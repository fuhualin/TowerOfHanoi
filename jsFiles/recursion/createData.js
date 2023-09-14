var w = 650, h = 250,
    num = document.getElementById("elements").value, 
    speed = document.getElementById("speed").value,
    //algo = "selectionSort",
    dataSet, scale, padding = 2, timer, 
    states = {"default": 0, "sorted": 1, "minimum": 2, "compare": 3, "swapping":4, "inactive": 5},
    color = ["cyan", "blue", "red", "green", "yellow", "lightgray"],
    paused = true, initPlay = true, hline = -1, // hline - which line to highlight in code
    urlcpp, urljava, urlpython, urlpseudo, urlindex = 0, //urlindex - which code url is currently selected
    expandArea = false, textShow = true, strAction="", //textshow - toggle-text on bars, expandArea - zoomin or out, strAction - current action label
    strDefault = "Press PLAY button to start sorting", // default action Label
    record, extraRecord, playIndex = 0, tempdata, 
    minValue = 10, maxValue = 110, maxElements = 10, 
    source = 0, aux = 1, destination = 2,
    polewidth = w/160, poleheigth = h - (3*h/4), polex = [w/4, w/2, 3*w/4],barheight = h/14, //10 bars can be put in one pole
    svg;

generateData(num);
visualBars(dataSet);
document.getElementById("stop").disabled = true; 
actionLabel(strDefault);

function print(arr)
{
    var output = "";
    for(var k = 0; k<arr.length; k++)
        output+= arr[k].value + " ";

    console.log("output = " + output);
}

function setMaxNum()
{
    num = maxElements;
    document.getElementById("elements").value = num;
}

function recordData(dataSet)
{
    record[source].push(cloneData(dataSet[source]));
    record[aux].push(cloneData(dataSet[aux]));
    record[destination].push(cloneData(dataSet[destination]));
    extraRecord.push([hline, strAction]);
    //record polenum too
}

function actionLabel(str)
{
    d3.select("#action").text(str);
}

function addNotify(value)
{
    actionLabel(value + " has been added. (Range: [" + minValue + ", " + maxValue + "])");
}

function cloneData(data)
{
    var clone = [];
    for(var k = 0; k<data.length; k++)
    {
        clone.push({ value : data[k].value, state : data[k].state, pole: data[k].pole });
    }
    return clone;
}

function createTempdata()
{
    tempdata = [[], [], []]; 
    tempdata[source] = cloneData(dataSet[source]);
    tempdata[aux] = cloneData(dataSet[aux]);
    tempdata[destination] = cloneData(dataSet[destination]);
}

function copyTempToDataSet()
{
    dataSet = [[], [], []]; 
    dataSet[source] = cloneData(tempdata[source]);
    dataSet[aux] = cloneData(tempdata[aux]);
    dataSet[destination] = cloneData(tempdata[destination]);
}

function generateData(num)
{
    dataSet = [[], [], []];
    for(var i = 0; i<num ; i++)
    {
        //poles - 0 = source, 1 = auxillary, 2 = destination
        dataSet[source][i] = { value : minValue + Math.floor((Math.random()*num*10)),
                        state: states.default, pole: 0 };                 
        if(dataSet[source][i].value > maxValue) dataSet[source][i].value = maxValue;
    }
    dataSet[source].sort(function(a, b) {
        return parseInt(b.value) - parseInt(a.value);
    });

    scale = d3.scale.linear()
            .domain([0, d3.max(dataSet[source], function(d) {return d.value} )])
            .range([0, w/3]);

    createTempdata();   
}

function visualBars(dataSet)
{
    dataSet[source].sort(function(a, b) {
        return parseInt(b.value) - parseInt(a.value);
    });
   
    scale = d3.scale.linear()
            .domain([0, d3.max(dataSet[source], function(d) {return d.value} )])
            .range([0, w/4]);

            
    document.getElementById("visualBox").innerHTML = "";

    svg = d3.select("#visualBox")
            .append("svg")
            .attr("width", w)
            .attr("height", h)
            .attr("style", "outline: thin solid black;");
        
    var div = d3.select("#visualBox").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

    print(dataSet);
    

    var sourcepole = svg.append("rect")
                .attr("x", polex[source])
                .attr("y", poleheigth)
                .attr("width", polewidth)
                .attr("height", 3*h/4)
                .style("fill", "black");

    var auxilarypole = svg.append("rect")
                .attr("x", polex[aux])
                .attr("y", poleheigth)
                .attr("width", polewidth)
                .attr("height", 3*h/4)
                .style("fill", "black");

    var destinationpole = svg.append("rect")
                .attr("x", polex[destination])
                .attr("y", poleheigth)
                .attr("width", polewidth)
                .attr("height", 3*h/4)
                .style("fill", "black");

    var bars = svg.selectAll(".bar")
                .data(dataSet[source])
                .enter()
                    .append("g")
                    .attr("class","bar");


    var midx, xcord;

    bars.append("rect")
        .attr("x", function(d) { 
            //finding value of x such that bar fits in the middle of the pole
            midx = (2*polex[d.pole] + polewidth)/2;
            xcord = (midx - scale(d.value - padding)/2);
            return xcord;
        })
        .attr("y", function(d, i) {
            return h - ((i+1) * (barheight))-1;  //-1 to show the bottom black boundary
        })   
        .attr("width", function(d) {return scale(d.value - padding); })
        .attr("height", function(d) {return barheight; })
        .attr("style", "outline: thin solid black;")
        .style("fill", function(d) {return color[d.state]; } )
        .on("mouseover", function(d, i) {
            var rect = d3.select(this);
            rect.attr("class", "hover");
            var val = d.value;
            div.transition()
              .duration(50)
              .style("opacity", 0.9);
            div.html("<span class='amount'>" + val + "</span>")
              .style("left", xcord + "px")
              .style("top", (d3.event.pageY - 150) + "px");
          })
          .on("mouseout", function() {
            var rect = d3.select(this);
            rect.attr("class", "mouseoff");
            div.transition()
              .duration(500)
              .style("opacity", 0);
          });

    if(textShow === true)
    {
        bars.append("text")
        .attr("fill","black")
        .attr("x", function(d) { 
            var midpoint = (2*polex[d.pole] + polewidth)/2;
            return midpoint - 7;
        })
        .attr("y", function(d, i) {
            return h - (i * (barheight)) - (h/50); 
        })
        .style("font-size", function(d) { return  h/20 + "px"; })
        .text(function(d) { return d.value; });
    }
}

function redrawBars(dataSet, index)
{
    var bars = svg.selectAll("rect")
                .data(dataSet[index])
                .transition()
                .duration(speed / 2)
                
    bars.attr("x", function(d) { 
            //finding value of x such that bar fits in the middle of the pole
            midx = (2*polex[d.pole] + polewidth)/2;
            xcord = (midx - scale(d.value - padding)/2);
            return xcord;
    });
    bars.attr("y", function(d, i) {
            return h - (((i+1)) * (barheight))-1; 
    });   
    bars.attr("width", function(d) {return scale(d.value - padding); });
    bars.attr("height", function(d) {return barheight; });
    bars.attr("style", "outline: thin solid black;");
    bars.style("fill", function(d) {return color[d.state]; });

    var txt = svg.selectAll("text")
                .data(dataSet[index])
                .transition()
                .duration(speed/2);

    txt.attr("fill","black")
   .attr("x", function(d) { 
        var midpoint = (2*polex[d.pole] + polewidth)/2;
        return midpoint - 7;
    })
    .attr("y", function(d, i) {
        return h - (i * (barheight)) - (h/50); 
    })
    .style("font-size", function(d) { return  h/20 + "px"; })
    .text(function(d) { return d.value; });
}

document.getElementById("text-show").addEventListener("click", function()
{
    if(textShow === false) textShow = true;
    else textShow = false;
    copyTempToDataSet();
    visualBars(dataSet);
    createTempdata(); solveData();
});

document.getElementById("random").addEventListener("click", function()
{
    actionLabel(strDefault);
    clearInterval(timer);
    paused = true; 
    // enable and disable things, and also change the play-pause icon
    d3.select("#play>span").classed("glyphicon-play",true);
    d3.select("#play>span").classed("glyphicon-pause",false);

    document.getElementById("play").disabled = false; 
    document.getElementById("stepback").disabled = false; 
    document.getElementById("stepforward").disabled = false;

    document.getElementById("stop").disabled = true;

    document.getElementById("add").disabled = false; 
    document.getElementById("addrandom").disabled = false;

    speed = document.getElementById("speed").value;
    num = document.getElementById("elements").value;
    if(num > maxElements) setMaxNum();

    generateData(num);
    init(); // will make initPlay = true
    visualBars(dataSet);
    createTempdata();
    solveData();
});

document.getElementById("addrandom").addEventListener("click", function()
{
    // the dataSet[source] becomes empty as solveData() is executed, so tempdata has to be copied first
    copyTempToDataSet(); //bring unsolved value to dataSet and adding rand
    //clearInterval(timer);
    if(num < maxElements)
    {
        var rand;
        if(num == 0)
        {
            rand = { value : Math.floor(minValue + Math.random() * 10 ),
                       state : states.default, pole: 0 };
        }
        else
        {
            rand = { value : minValue + Math.floor(Math.random() * d3.max(dataSet[source], function(d) {return d.value + 3;}) ),
                       state : states.default, pole: 0 };
        }

        if(rand.value > maxValue) rand.value = maxValue;
        dataSet[source].push(rand);
        num++; 
        document.getElementById("elements").value = num;
        addNotify(dataSet[source][dataSet[source].length - 1].value);
        visualBars(dataSet); //sorting is performed in this function
        createTempdata(); //copy dataSet to tempdata, tempdata is used for step back function
        solveData();
    }
    
});

document.getElementById("add").addEventListener("click", function()
{
    //clearInterval(timer);
    if(num < maxElements)
    {
        if(parseInt(document.getElementById("addtextfield").value) < minValue)
            document.getElementById("addtextfield").value = minValue;
        else if(parseInt(document.getElementById("addtextfield").value) > maxValue)
            document.getElementById("addtextfield").value = maxValue;

        var rand = { value : parseInt(document.getElementById("addtextfield").value),
               state : states.default, pole: 0 };

        copyTempToDataSet();
        dataSet[source].push(rand);
        num++; 
        document.getElementById("elements").value = num;
        addNotify(dataSet[source][dataSet[source].length - 1].value);
        visualBars(dataSet);
        createTempdata();
        print(dataSet[source]);
        solveData();
    }
    
});

document.getElementById("clear").addEventListener("click", function()
{
    clearInterval(timer);
    actionLabel(strDefault);
    paused = true; 
    init(); // will make initPlay = false
    // enable and disable things, and also change the play-pause icon
    d3.select("#play>span").classed("glyphicon-play",true);
    d3.select("#play>span").classed("glyphicon-pause",false);

    document.getElementById("play").disabled = false; 
    document.getElementById("stepback").disabled = false; 
    document.getElementById("stepforward").disabled = false;

    document.getElementById("stop").disabled = true;

    document.getElementById("add").disabled = false; 
    document.getElementById("addrandom").disabled = false;

    speed = document.getElementById("speed").value;
    num = 0;
    generateData(num);
    visualBars(dataSet);
    document.getElementById("elements").value = num;
    if(num > maxElements) setMaxNum();
});

document.getElementById("expand").addEventListener("click", function()
{
    if(expandArea === false)
    {
        d3.select("#visual-area").classed("col-lg-7", false);
        d3.select("#visual-area").classed("col-lg-12", true);    
        d3.select("#expand>span").classed("glyphicon-resize-full", false);    
        d3.select("#expand>span").classed("glyphicon-resize-small", true);    
        d3.select("#color-table").classed("col-md-2", false);
        d3.select("#color-table").classed("col-md-4", true);
        d3.select("#element-control").classed("col-md-5", false);
        d3.select("#element-control").classed("col-md-8", true);

        expandArea = true; w = 1100; h = 300;
        copyTempToDataSet();
        visualBars(dataSet);
        createTempdata();
        solveData();
    }
    else
    {
        d3.select("#visual-area").classed("col-lg-7", true);
        d3.select("#visual-area").classed("col-lg-12", false);
        d3.select("#color-table").classed("col-md-4", false);
        d3.select("#color-table").classed("col-md-2", true);
        d3.select("#element-control").classed("col-md-8", false);
        d3.select("#element-control").classed("col-md-5", true);
        d3.select("#expand>span").classed("glyphicon-resize-small", false);
        d3.select("#expand>span").classed("glyphicon-resize-full", true);    
        expandArea = false; w = 650; h = 200;
        copyTempToDataSet();
        visualBars(dataSet);        
        createTempdata();
        solveData();
    } 
});

