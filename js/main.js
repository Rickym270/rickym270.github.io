$(document).ready(function(){
    console.log("Nothing has been done yet");
    jQuery(function(){
        jQuery("#menu_links > .col-4 > a").click(function(){            
            var sectionUrl = $(this).attr("data-url");
            jQuery("#content").load(sectionUrl, function(){
                console.log("Loaded");
            })
        });
    });
});
