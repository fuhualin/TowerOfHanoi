//hline - line number to highlight starting from 0
var pseudocode = "";
function displayCodeFromFile(filepath)
{
    var displayArea = document.getElementById('display-area');
    function readTextFile(file)
    {
        var rawFile = new XMLHttpRequest();
        rawFile.open("GET", file, false);
        rawFile.onreadystatechange = function ()
        {
            if(rawFile.readyState === 4)
            {
                if(rawFile.status === 200 || rawFile.status == 0)
                {
                    var allText = rawFile.responseText;
                    if(urlindex == 0) pseudocode = allText;
                    displayArea.innerHTML = allText; 
                }
            }
        }
        rawFile.send(null);
    }
    readTextFile(filepath);
}

function highlightCode(hline)
{
    var displayArea = document.getElementById('display-area');
    var allText = pseudocode;
    var lines = allText.split("\n");
    if(hline >= 0) lines[hline] = '<span class = "highlight-text">' + lines[hline] + '</span>';
    allText = lines.join("\n");
    displayArea.innerHTML = allText;
}

document.getElementById("pseudo-tab").addEventListener("click", function()
{
    urlindex = 0;
    displayCodeFromFile(urlpseudo);    
});

document.getElementById("cpp-tab").addEventListener("click", function()
{
    hline = -1;
    urlindex = 1;
    displayCodeFromFile(urlcpp);    
});

document.getElementById("java-tab").addEventListener("click", function()
{
    hline = -1;
    urlindex = 2;
    displayCodeFromFile(urljava);    
});

document.getElementById("python-tab").addEventListener("click", function()
{
    hline = -1;
    urlindex = 3;
    displayCodeFromFile(urlpython);    
});