$(document).ready(function(){
    var location_name = location.href.split("/")[3];
    
    // Defaut load
    if(location_name == "index.html" || location_name == ""){
        jQuery("#content").load("html/pages/home.html");
    }
    
    // Navbar Links
    if(jQuery("a.nav-link, a.dropdown-item, a.inline-load").length){
        jQuery("a.nav-link, a.dropdown-item, a.inline-load").unbind("click").click(function(){
            var sectionUrl = $(this).attr("data-url");
            if(sectionUrl){
                jQuery("#content").load(sectionUrl, function(){
                    console.log("Loaded " + sectionUrl);
                });
            }
        });
    }
});
