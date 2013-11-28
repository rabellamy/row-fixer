The Problem
===========

Sometimes you want different elements on the page to line up with each other. If these elements are in separate containers and they have dynamic content, then CSS is usually not enough.

Example Diagram
===============

To demonstrate, you want this:

     ---------------------     ---------------------     ---------------------
    |      Header 1       |   |      Header 2       |   |      Header 3       |
    |                     |   |                     |   |                     |
    |     My Subitle      |   |      My Longer      |   |       My Very       |
    |                     |   |      Subtitle       |   |      Very Very      |
    |                     |   |                     |   |      Very Long      |
    |                     |   |                     |   |      Subtitle       |
    |                     |   |                     |   |                     |
    | My longest          |   | My short paragraph  |   | My paragraph text   |
    | paragraph text My   |   | text                |   | My paragraph text   |
    | longest paragraph   |   |                     |   | My paragraph text   |  
    | text My longest     |   |                     |   |                     |
    | paragraph text My   |   |                     |   |                     | 
    | longest paragraph   |   |                     |   |                     | 
    | text                |   |                     |   |                     |
     ---------------------     ---------------------     ---------------------

But you get this:

     ---------------------     ---------------------     ---------------------
    |      Header 1       |   |      Header 2       |   |      Header 3       |
    |                     |   |                     |   |                     |
    |     My Sutbitle     |   |      My Longer      |   |       My Very       |
    |                     |   |      Subtitle       |   |      Very Very      | 
    | My longest          |   |                     |   |      Very Long      |
    | paragraph text M    |   | My short paragraph  |   |      Subtitle       |
    | longest paragraph   |   | text                |   |                     |                   
    | text My longest     |    ---------------------    | My paragraph text   |
    | paragraph text My   |                             | My paragraph text   |
    | longest paragraph   |                             | My paragraph text   |
    | text                |                              ---------------------
     ---------------------                               

You might consider giving a single height to all of the elements that need to line up. But that height may be too big and look ridiculous if you have content of very different lengths (like above). And if the height is ever too small, you would need to have a vertical scroll on the elements, which can look ugly.

You might run into this situation when pulling content from a CMS (such as a product on a product-listing page). You might not be able to change the html source order of the content in order to line up certain inner elements with another piece of content (by using tables, perhaps). And even if you could change the source order, this would probably cause a problem when making the content responsive (and would probably break any styles you need on the element that contains those elements, i.e. "my-container" in the example above).

The Solution (in a nutshell)
============================

- Figure out which elements belong on the same row.
- Find the height of the biggest one in the row.
- Set that max height to all of the elements in that row.

Let's say you have a bunch of container elements with class "my-container" and inside those containers are h1's and p's that you want aligned with each other: 

    <div class="my-container">
        <h1> Title </h1>
        <p>
            Content Content Content Content Content Content
        </p>
    </div>
    <div class="my-container">
        <h1> Another Title </h1>
        <p>
            Content Content Content Content Content Content
            Content Content Content Content Content Content
            Content Content Content Content Content Content
            Content Content Content Content Content Content
        </p>
    </div>

This plugin will go through all of those h1 elements and find their vertical position. h1 elements whose tops are at the same vertical position (plus/minus some small threshold) are considered to belong to same row. The plugin then finds the maximum height of all h1 tags in that row, and assigns that maximum height to every h1 in that row so that they all now begin and end at the same place. It then does the same for the p elements in that row. Then it will figure out the next row until they are all done.

Example Usage
=============

In the above example html, we want h1 tags inside the "my-container" element to line up with h1 tags inside other "my-container" elements. The same goes for h3 tags with h3 tags, and p tags with p tags.

Create a simple config object with a property called "targets". This property will be an array that contains selectors for the elements that need to be resized, from highest vertical position on the page to lowest vertical position:

    var config = {
         "targets" : [
             'h1', 'h3', 'p'
         ]
     }
     
Then call the plugin's "fixRows" function on the containers of those targets, passing the config option:
     
    var $containers = $('.my-container');
    
    // Initial row-fixing
    $containers.fixRows(config);
    
    // Fixing rows may be useful after these events as well
    $(window).on("load resize", function() { 
        $containers.fixRows(config)
    });


Example Code
============

Open test.html in your browser. You will see a responsive grid that goes from four column to three column to two column to one column. There are three items in each container that need to line up with other items on the page. These are the title, subtitle, and paragraph. Some of the items are invisible on certain viewports. You can see that these items are in different containers, yet they line up correctly regardless of visibility and number of columns.

Extra
=====

If you are concerned about people who do not have JavaScript turned on, you could set explicit heights on the elements that need to be lined up, with scroll-bars in case of overflow:

    .my-container h1, 
    .my-container h3, 
    .my-container p {
        height: 250px;
        overflow: scroll;
    }

This plugin will then override these settings if JavaScript is turned on.
