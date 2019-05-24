// Global vars are cached
var doc = document,
    loc = location,
    his = history,
    navi = navigator,
    modern = Modernizr;

// Global vars for UI
var successMsg = doc.getElementsByClassName('msg__save-success')[0],
    filepicker = doc.getElementById('filepicker'),
    output = doc.getElementsByClassName('output')[0],
    outputStart = doc.getElementById('outputStart'),
    outputExport = doc.getElementById('outputExport'),
    outputClear = doc.getElementById('outputClear');

// Change page without "a href"
function go_to(url){
    loc.href = url;
}

function goPosition(position){
    his.go(position);
}

// Parsing UI
function toggleStartButton(){
    if (filepicker.files != 0){
        outputStart.disabled = false;
        outputClear.disabled = false;
    } else {
        outputStart.disabled = true;
        outputClear.disabled = true;
    }
}

function toggleExportButton(){
    if(outputExport.disabled) {
        outputExport.disabled = false;
    }
}

function showOutput(){
    if (output.style.display == 'none') {
        output.style.display = 'block';
    }
}

function pageClear(){
    loc.reload(); // page reload
}

// Settings UI
function displaySuccessMsg(){
    successMsg.style.display = 'block';
}

function hideSuccessMsg(){
    successMsg.style.display = 'none';
}



