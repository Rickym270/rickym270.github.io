// Use event delegation for dynamically loaded content
$(document).on('click', '#docsNavigatrior > a', function(e){
    e.preventDefault();
    var attr = $(this).attr('href');
    if(attr && attr !== '#'){
        $('#FAQMain').load(attr);
    }
});
