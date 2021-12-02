$("#docsNavigatrior > a").on('click',function(e){
    e.preventDefault();
    var attr = $(this).attr('href');
    if(attr!='#' || (typeof attr != typeof undefined || attr!=false)){
        $('#FAQMain').load(attr);
    }
});
