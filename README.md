The Problem
===========

Sometimes you want different elements on a web page to vertically line up with each other. If these elements are in separate containers and they have dynamic content, then CSS is usually not enough.

To demonstrate, you want this:

     ---------------------       ---------------------       ---------------------
    |      Header 1       |     |      Header 2       |     |      Header 3       |
    |                     |     |                     |     |                     |
    |     My Subtitle     |     |      My Longer      |     |       My Very       |
    |                     |     |      Subtitle       |     |      Very Very      |
    |                     |     |                     |     |      Very Long      |
    |                     |     |                     |     |      Subtitle       |
    |                     |     |                     |     |                     |
    | My longest          |     | My short paragraph  |     | My paragraph text   |
    | paragraph text My   |     | text                |     | My paragraph text   |
    | longest paragraph   |     |                     |     | My paragraph text   |
    | text My longest     |     |                     |     |                     |
    | paragraph text My   |     |                     |     |                     |
    | longest paragraph   |     |                     |     |                     |
    | text                |     |                     |     |                     |
     ---------------------       ---------------------       ---------------------

But you get this:

     ---------------------       ---------------------       ---------------------
    |      Header 1       |     |      Header 2       |     |      Header 3       |
    |                     |     |                     |     |                     |
    |     My Subtitle     |     |      My Longer      |     |       My Very       |
    |                     |     |      Subtitle       |     |      Very Very      |
    | My longest          |     |                     |     |      Very Long      |
    | paragraph text My   |     | My short paragraph  |     |      Subtitle       |
    | longest paragraph   |     | text                |     |                     |
    | text My longest     |      ---------------------      | My paragraph text   |
    | paragraph text My   |                                 | My paragraph text   |
    | longest paragraph   |                                 | My paragraph text   |
    | text                |                                  ---------------------
     ---------------------

In this example, this plugin would set the height of each header to be the height of the tallest header. It then sets the height of each subtitle to be the height of the tallest subtitle, and so on.

So What?
========
You may have seen plugins that do this already. I believe I have added a couple of enhancements:

1 - This works for responsive grids. Let's say your grid is 5-column for one viewport, 3-column on another, and stacked on mobile. You wouldn't want each subtitle, for example, to have the max height of ALL subtitles. You would want it to have the max height of subtitles IN THE SAME VERTICAL ROW. This plugin detects which are on the same row and adapts.

2 - This works for multiple selectors inside a container. Setting the max height to just one selector (like a title) across several containers is fairly simple. Handling multiple selectors per container on a responsive grid is a little bit trickier. This is because as you assign heights to one group of elements (like all titles) the other groups of elements (subtitles, paragraphs, etc.) move around, and you must take this into account for everything to work out correctly.

When Might You Have This Problem?
=================================

This situation can occur, for example, when pulling dynamic content from a Content Management System (such as a product for a product-listing page). You may be placing that information into a pre-defined grid system, in which case the container you are placing it into prevents you from lining things up across several containers.

You might consider assigning a single height to all of the elements that need to line up with each other. But if the elements end up having very little content, that height may be too big and look ridiculous. And if the content ever exceeds that height, you would need to have a vertical scroll on the elements, which can look ugly.

Let's say you try to solve this problem by changing the HTML source order so that you place h1's next to h1's, p's next to p's, etc. You could place these elements in tables or use "display: inline-block" to line them up. Aside from the normal problems inherent to these methods, you would probably have to resort to tricks to make it appear as though each h1 and p belong to a single container. And you will probably have a hard time making your content responsive.

The Solution (in a nutshell)
============================

In terms of the example at the top of this page, this plugin would go through all of the header elements and find their vertical position. Header elements whose tops are at the same vertical position (plus/minus some small threshold) are considered to belong to same row. The plugin then finds the maximum height of all header elements in that vertical row, and assigns that maximum height to every header in that row so that they all now begin and end at the same place. It then does the same for the subtitle elements in that vertical row, and then the paragraphs. 

Then it will figure out which elements are on the second vertical row and repeat the process until all rows are done.

Example Usage
=============

Create a simple config object with a property called "targets". This property will be an array that contains selectors for the elements that need to be resized (in the context of the container), from highest vertical position on the page to lowest vertical position:

    var config = {
         "targets" : [
             'h1', 'p'
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

Open test.html in your browser. You will see a responsive grid system brought to you by [Singularity]. [A video] walk through of Singularity. The example goes from a one column, to a two column, to a four and five column asymmetric grid respectfully. There are three items in each container that need to line up with other items on the page. These are the title, subtitle, and paragraph. Some of the items are invisible on certain viewports. You can see that these items are in different containers, yet they line up correctly regardless of visibility and number of columns.

[Singularity]: http://singularity.gs/
[A video]: http://vimeo.com/63509346

Extra
=====

If you are concerned about people who do not have JavaScript turned on, you could set explicit heights on the elements that need to be lined up, with scroll-bars in case of overflow:

    .my-container h1,
    .my-container p {
        height: 250px;
        overflow: scroll;
    }

This plugin will then override these settings if JavaScript is turned on.
