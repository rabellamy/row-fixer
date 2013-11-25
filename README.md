row-fixer
=========

The Problem
===========

Sometimes you want different elements on the page to line up with each other, but they are buried inside container elements and you cannot change their html source order. This might happen when pulling content from a CMS and placing it into a pre-defined grid system like Bootstrap. You would have to set the heights of each element explicitly for several breakpoints, which can become impossible if the content is dynamic.

The Solution
============

This JavaScript code tries to figure out which elements belong on the same row. Then for each row, it finds the maximum height and assigns it to every element on the row. 

Example 
=======

The example here uses a three-column grid that becomes two-column on small tablets and one-column on mobile. There are three items in each container that need to line up with other items on the page. These are the title, subtitle, and paragraph. Some of the items are invisible on certain viewports. You can see that these items are in different containers yet line up correctly regardless of visibility and number of columns.

Note* I am using Bootstrap's grid system, but hacking the CSS so that we get two columns on small tablets (normally they would stack vertically at that point).
