$(function(){
    $("#speed-slider").slider({
        orientation: "horizontal",
        range: "min",
        min: 0,
        max: 100,
        value: 80,
        slide: function( event, ui ) {
            $("#amount").val( ui.value );
            $(this).find('.ui-slider-handle').text(ui.value);
            $('#speed').val(1001 - (ui.value)*10);

        },
        create: function(event, ui) {
            var v=$(this).slider('value');
            $(this).find('.ui-slider-handle').text(v);
        }
    });    
});


document.getElementById("play").addEventListener("click", function(){
    
    clearInterval(timer);
    
    document.getElementById("stop").disabled = false; 
 
    document.getElementById("stepback").disabled = true; 
    document.getElementById("stepforward").disabled = true; 
    document.getElementById("add").disabled = true; 
    document.getElementById("addrandom").disabled = true;    

    if(paused === false) //executes when pause button is clicked
    {
        d3.select("#play>span").classed("glyphicon-play",true);
        d3.select("#play>span").classed("glyphicon-pause",false);
        paused = true;
        clearInterval(timer);
        document.getElementById("stepback").disabled = false; 
        document.getElementById("stepforward").disabled = false; 
    }
    else // executes first - executes when play starts
    {
        d3.select("#play>span").classed("glyphicon-play",false);
        d3.select("#play>span").classed("glyphicon-pause", true);
        paused = false;
        speed = document.getElementById("speed").value;
        document.getElementById("stepback").disabled = true; 
        document.getElementById("stepforward").disabled = true; 
        if(initPlay === true) startPlay(true);
        else startPlay(false);
    } 
});

document.getElementById("stepback").addEventListener("click", function()
{
    clearInterval(timer);
    document.getElementById("add").disabled = true; 
    document.getElementById("addrandom").disabled = true;

    if(initPlay === true) init();
    if(playIndex>1) 
    {
        playIndex-=2;
        playing();
    }
});

document.getElementById("stepforward").addEventListener("click", function()
{
    clearInterval(timer);
    document.getElementById("add").disabled = true; 
    document.getElementById("addrandom").disabled = true;
    if(initPlay === true) init();
    playing();
});

document.getElementById("stop").addEventListener("click", function()
{
    clearInterval(timer);
    initPlay = true; init(); solveData();
    paused = true;
    //disable everyting except for play button and change play icon
    d3.select("#play>span").classed("glyphicon-play",true);
    d3.select("#play>span").classed("glyphicon-pause",false);
    
    document.getElementById("play").disabled = false;

    document.getElementById("stop").disabled = true; 
    document.getElementById("stepback").disabled = true; 
    document.getElementById("stepforward").disabled = true;
    // allow addition of emelements now
    document.getElementById("add").disabled = false; 
    document.getElementById("addrandom").disabled = false;
});

