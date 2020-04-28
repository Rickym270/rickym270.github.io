$(document).ready(function(){
    var location_name = location.href.split("/")[3];
    
    // Defaut load
    if(location_name == "index.html" || location_name == ""){
        jQuery("#content").load("html/pages/home.html");
    }
    
    // Navbar Links
        jQuery("a.nav-link").unbind("click").click(function(){            
            var sectionUrl = $(this).attr("data-url");
            console.log(sectionUrl);
            jQuery("#content").load(sectionUrl, function(){
                console.log("Loaded " + sectionUrl);
            })
        });
});
