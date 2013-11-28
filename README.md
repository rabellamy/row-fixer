The Problem
===========

Sometimes you want different elements on the page to line up with each other. If these elements are buried inside container elements, usually CSS is not enough if the content is dynamic. Consider the following HTML:

    <div class="my-container">
        <h1>Heading That Needs to Be Aligned With Other Headings</h1>
        <h3>
            Subtitle That Needs to Be Aligned With Other Subtitles
            Subtitle That Needs to Be Aligned With Other Subtitles
        </h3>
        <p>
            Paragraph that needs to be aligned with other paragraphs.
            Paragraph that needs to be aligned with other paragraphs.
            Paragraph that needs to be aligned with other paragraphs.
        </p>
    </div>
    
    <div class="my-container">
        <h1>Heading That Needs to Be Aligned With Other Headings</h1>
        <h3>Subtitle That Needs to Be Aligned With Other Subtitles</h3>
        <p>
            Paragraph that needs to be aligned with other paragraphs.
            Paragraph that needs to be aligned with other paragraphs.
            Paragraph that needs to be aligned with other paragraphs.
            Paragraph that needs to be aligned with other paragraphs.
            Paragraph that needs to be aligned with other paragraphs.
            Paragraph that needs to be aligned with other paragraphs.
        </p>
    </div>
    
As implied by the content above, you would like the <h1>, <h3>, and <p> elements inside of one "my-container" div to line up with other <h1>, <h3>, and <p> elements inside of other "my-container" div's.

If the content inside those elements is dynamic, you might consider giving them all the same height that you assume is big enough to contain them. That height may be too big and look ridiculous if you have content of very different lenghts. And if the height is ever too small, you would need to have a vertical scroll on the elements, which can look ugly.

You might run into this situation when pulling content from a CMS (such as a product on a product-listing page). You might not be able to change the html source order of the content in order to line up certain inner elements with another piece of content. And even if you could change the source order, this would probably cause a problem when making the content responsive (and would probably break any styles you need on the element that contains those elements, i.e. "my-container" in the example above).

The Solution
============

This jQuery plugin tries to figure out which elements are on the same row. Then for each row, it finds the maximum height and assigns it to every element on the row. This allows you to have dynamic and also responsive content, while ensuring that the inner elements you specify will always stay aligned.

Let's say you tell the plugin that all <p> elements inside "my-container" need to be aligned. This plugin then goes through all of those <p> elements and finds their vertical position. <p> elements whose tops are at the same vertical position (plus/minus some small threshold) are considered to belong to same row. The plugin then finds the maximum height of all <p> tags in a row, and assigns that maximum height to every <p> in that row so that they all now begin and end at the same place.

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
