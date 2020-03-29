$(document).ready(function(){
    console.log("Nothing has been done yet");
    $("#menu_links > .col-4 > a").one("click", function(){
        var sectionUrl = $(this).attr("data-url");
        var callMethod = "POST";
        var dataHTML = "<h1>New Content</h1>";
        
        $.ajax({
            url: sectionUrl,
            type: callMethod,
            cache: false,
            data: {
                'html': dataHTML
            },
            dataType: 'html',
            success: function(htmlReturned) {
                $("#content").html(htmlReturned);
                console.log("Executed Once.");
            }
        });
    });
});