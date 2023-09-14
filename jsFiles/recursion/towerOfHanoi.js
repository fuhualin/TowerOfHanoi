urlpseudo = "./jsFiles/recursion/algoCode/towerOfHanoi";
urlcpp = "./jsFiles/recursion/algoCode/towerOfHanoi.cpp";
urljava = "./jsFiles/recursion/algoCode/towerOfHanoi.java";
urlpython = "./jsFiles/recursion/algoCode/towerOfHanoi.py";
d3.select("#algo-name").text("Tower Of Hanoi");
displayCodeFromFile(urlpseudo);
solveData();

function swap(i, j)
{
    var temp = dataSet[i];
    dataSet[i] = dataSet[j]; 
    dataSet[j] = temp;
}
//quickSort
function playing()
{
    if(playIndex >= 0 && playIndex<record[source].length)
    {
        dataSet[source] = cloneData(record[source][playIndex]);
        dataSet[aux] = cloneData(record[aux][playIndex]);
        dataSet[destination] = cloneData(record[destination][playIndex]);

        hline = extraRecord[playIndex][0];
        strAction = extraRecord[playIndex][1];
        if(urlindex == 0) highlightCode(hline);
        actionLabel(strAction);
        redrawBars(dataSet, source);
        redrawBars(dataSet, aux);
        redrawBars(dataSet, destination);
        playIndex++;
        print(dataSet[source]); print(dataSet[aux]); print(dataSet[destination]);
    }
    else
    {
        clearInterval(timer);
    }
}

function init()
{
    initPlay = false;
    for(var k = 0; k < dataSet[source].length; k++)
    {
        dataSet[source][k].state = states.default;
    }
}

function solveData()
{
    record = [[], [], []]; extraRecord = []; hline = -1; playIndex = 0;
    strAction = "Starting to Sort";
    recordData(dataSet);
    var from = 0, aux = 1, to = 2;

    function towerOfHanoi(n, from, to, aux)
    {
        if(n == 1)
        {
            // move disk 1 from to to
            var disk = dataSet[from][dataSet[from].length-1]; 
            dataSet[from].pop();
            disk.pole = to;
            dataSet[to].push(disk);

            return;
        }
        towerOfHanoi(n-1, from, aux, to);
        // move disk n from to to
        var disk = dataSet[from][dataSet[from].length-1]; 
        dataSet[from].pop();
        disk.pole = to;
        dataSet[to].push(disk);
        
        towerOfHanoi(n-1, aux, to, from);
    }
    towerOfHanoi(num, from, to, aux);
    recordData(dataSet);

}

function startPlay(firstPlay) // if firstPlay is true then playing, else its resume
{
    if(firstPlay === true) init();
    timer = setInterval(function() { playing() }, speed );   
}


