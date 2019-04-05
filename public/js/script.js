// Global vars are cached
var doc = document,
    loc = location,
    his = history,
    navi = navigator,
    modern = Modernizr;


var successMsg = doc.getElementsByClassName('msg__save-success')[0];

// Change page without "a href"
function go_to(url){
    loc.href = url;
}

function goPosition(position){
    his.go(position);
}

// EULA file read
// https://ru.stackoverflow.com/questions/360173/Чтение-txt-документа

// @todo eula file read (server)

// EULA button

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


function displaySuccessMsg(){
    successMsg.style.display = 'block';
}

function hideSuccessMsg(){
    successMsg.style.display = 'none';
}

function apply(){
    displaySuccessMsg();
    // скрыть через 3 сек
    setTimeout(hideSuccessMsg, 3000);

}