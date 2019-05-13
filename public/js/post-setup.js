// Изменение настроек через POST-запрос и JQuery.
// https://grokonez.com/node-js/integrate-nodejs-express-jquery-ajax-post-get-bootstrap-view

$(document).ready(function() {
     // SUBMIT FORM
      $("#set_form").submit(function(event) {
      // Prevent the form from submitting via the browser.
      event.preventDefault();
      ajaxPost();
      // Показать сообщение об успешном изменении настроек (см. файл script.js)
      displaySuccessMsg();
      // Скрыть сообщение через 5 сек
      setTimeout(hideSuccessMsg, 5000);
    });
          
    function ajaxPost(){
        
        // PREPARE FORM DATA
        var formData = {
          lang: $("#set_lang").val(),
          style: parseInt($("#set_style").val())
        }

        console.log(formData);
        
        // DO POST

        $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "/applysettings",
        data: JSON.stringify(formData),
        dataType : 'json',
        success : function(element) {
          console.log(JSON.stringify(element));
          
        },
        error : function(e) {
         // alert("Error!")
          console.log("ERROR: ", e);
        }
      });
        
       
   
 }
      
      
});






    

    

