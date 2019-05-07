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
    outputExport = doc.getElementById('outputExport');

// Change page without "a href"
function go_to(url){
    loc.href = url;
}

function goPosition(position){
    his.go(position);
}

// EULA UI
var agreedOKBtn = doc.getElementById('agreedOKBtn'),
    agreedChkbox = doc.getElementById('agreed');

function eulaBtnToggle(){
    if (!agreedChkbox.checked) {
        agreedChkbox.checked = true;
        agreedOKBtn.disabled = false;
    } else {
        agreedChkbox.checked = false;
        agreedOKBtn.disabled = true;
    }
}

// Parsing UI
function toggleStartButton(){
    if (filepicker.files != 0){
        outputStart.disabled = false;
    } else {
        outputStart.disabled = true;
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


// Settings UI
function displaySuccessMsg(){
    successMsg.style.display = 'block';
}

function hideSuccessMsg(){
    successMsg.style.display = 'none';
}



