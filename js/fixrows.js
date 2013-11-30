(function ($) {
    "use strict";       
     
    $.fn.fixRows = function(config) {
        var i, errorInfo = [], groupsOfInnerElements, targets = config && config.targets
        
        if (!validateTargets(targets)) {
            return;
        }
                
        // "this" is the outer container that holds the
        // inner elements that need to be lined up.
        // "targets" is like ['h1', 'h3', 'p']
        groupsOfInnerElements = getgroupsOfInnerElements(this, targets);
        
        // groupsOfInnerElements is like 
        // [
        //   [h1, h1, h1, h1, h1, h1],
        //   [h3, h3, h3, h3, h3, h3],
        //   [p,  p,  p,  p, p, p]
        // ]
        lineUpHeights(groupsOfInnerElements);
    }
    
    function validateTargets(targets) {
        if ( !targets || (!targets.length) || (targets.length === 0) ) {
            console.log("config object was not valid:");
            console.log(targets);
            return false;
        }
        
        return true;
    }
    
    function getgroupsOfInnerElements(container, targets) {
        var groupOfInnerElements, numberOfInnerElementsPerGroupSoFar, groupsOfInnerElements = [], i

        for (i = 0; i < targets.length; i++) {
            // Filter out invisible elements because they will have zero heights
            groupOfInnerElements = container.find(targets[i]).filter(":visible");
            
            if (numberOfInnerElementsPerGroupSoFar) {
                if (groupOfInnerElements.length !== numberOfInnerElementsPerGroupSoFar) {
                    console.log(
                        "There are " + groupOfInnerElements.length + " visible inner-elements of type \"" + 
                        targets[i] + "\" while there were " + numberOfInnerElementsPerGroupSoFar +
                        " visible inner-element of the other types so far. There must be the same number."
                        );
                        
                    return;
                }               
            }
            
            groupsOfInnerElements.push(groupOfInnerElements);
            
            numberOfInnerElementsPerGroupSoFar = groupOfInnerElements.length;
        }
        
        return groupsOfInnerElements;
    }
    
    function lineUpHeights(groupsOfInnerElements) {
        var currentVerticalRow = [], newRow, currentVerticalRowTopPosition, i, j, k, thisInnerElement, 
            thisInnerElementTopPosition, initialGroupOfInnerElements, beginningIndexOfThisVerticalRow,
            endIndexOfThisVerticalRow, numberOfLineupItemsLeft
                  
        beginningIndexOfThisVerticalRow = 0;  
        initialGroupOfInnerElements = groupsOfInnerElements[0]; // the highest group, like [h1, h1, h1, h1, h1, h1]
        currentVerticalRow.push($(initialGroupOfInnerElements[0])); // [h1]
        currentVerticalRowTopPosition = currentVerticalRow[0].position().top;
        
        for (i = 1; i < initialGroupOfInnerElements.length; i++) {
            thisInnerElement = $(initialGroupOfInnerElements[i]);
            thisInnerElementTopPosition = thisInnerElement.position().top;

            // If the position is within plus/minus 3 pixels, consider it to be on the same row
            if (elementIsInRow(thisInnerElementTopPosition, currentVerticalRowTopPosition)) {
                currentVerticalRow.push(thisInnerElement);
            } else {
                // This row is done, so now we set the correct heights on each other row
                endIndexOfThisVerticalRow = i - 1;   
                setMaxHeightsOnRows(beginningIndexOfThisVerticalRow, endIndexOfThisVerticalRow, groupsOfInnerElements);   

                newRow = [];
                newRow.push(thisInnerElement);
                
                // Element may have moved after the elements in the previous row were resized,
                // so get its position again
                currentVerticalRowTopPosition = thisInnerElement.position().top;
                
                beginningIndexOfThisVerticalRow = endIndexOfThisVerticalRow + 1;
                
                currentVerticalRow = newRow;
            }
        }

        //Deal with the last row
        endIndexOfThisVerticalRow = i - 1;
        setMaxHeightsOnRows(beginningIndexOfThisVerticalRow, endIndexOfThisVerticalRow, groupsOfInnerElements);            
    }
    
    function elementIsInRow(thisInnerElementTopPosition, currentVerticalRowTopPosition) {
        var threshold = 2; // px
        return (
                (thisInnerElementTopPosition <= currentVerticalRowTopPosition + threshold) && 
                (thisInnerElementTopPosition >= currentVerticalRowTopPosition - threshold)
               );
    }

    // Helper function for lineUpHeights
    function setMaxHeights(currentVerticalRow) {
        var maxHeight, thisHeight, i;

        currentVerticalRow.forEach(function (e) {
            e.css( { "height" : "auto" } );
        });

        maxHeight = currentVerticalRow[0].height();

        for (i = 1; i < currentVerticalRow.length; i++) {
            thisHeight = currentVerticalRow[i].height();

            if (thisHeight > maxHeight) {
                maxHeight = thisHeight;
            }
        }

        // Set the max on all in the row. Overflow-visible is useful if we are
        // setting default css heights (as a fallback for JavaScript being turned off)
        // with scroll bars for overflow. We don't want to see those scroll bars if
        // this code is setting heights.
        currentVerticalRow.forEach(function (e) {
            e.css({ "overflow-y" : "visible", "height" : maxHeight });
        });
    }
    
    function setMaxHeightsOnRows(beginningIndex, endIndexInclusive, groupsOfInnerElements) {
        var i, j, row;
       
        for (i = 0; i < groupsOfInnerElements.length; i++) {
            row = [];
            
            for (j = beginningIndex; j <= endIndexInclusive; j++) {
                row.push($(groupsOfInnerElements[i][j]));
            }   
            
            setMaxHeights(row);
        }        
    }
})(jQuery.noConflict());
