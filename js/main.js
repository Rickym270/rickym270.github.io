$(document).ready(function(){
    var location_name = location.href.split("/")[3];
    if(location_name == "index.html" || location_name == ""){
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
