(function ($) {
    $(function () {    
        var config = {
             "targets" : [
                 'h1', 'h3', '.inner-div p'
             ]
         }
         
         var $containers = $('.rectangle');
         
        // Initial row-fixing
         $containers.fixRows(config);
         
        // Fixing rows may be useful after these events as well
        $(window).on("load resize", function() { 
            $containers.fixRows(config)
        });
     });
})(jQuery.noConflict());
