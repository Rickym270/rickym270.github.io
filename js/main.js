$(document).ready(function(){
    console.log("Nothing has been done yet");
    var location_name = location.href.split("/")[3];
    if(location_name == "index.html"){
        jQuery("#content").load("home.html");
    }
    jQuery(function(){
        jQuery("#menu_links > .col-4 > a").click(function(){            
            var sectionUrl = $(this).attr("data-url");
            jQuery("#content").load(sectionUrl, function(){
                console.log("Loaded " + sectionUrl);
            })
        });
    });
});
