(function ($) {
    "use strict";       
     
    $.fn.fixRows = function(config) {
        var targets = config && config.targets,
        lineupRows = [],
        groupOfInnerElements,
        numberOfInnerElementsPerGroupSoFar,
        i, 
        errorInfo = [],
        self = this;
        
        if ( !targets || (!targets.length) || (targets.length === 0) ) {
            console.log("config object was not valid:");
            console.log(targets);
            return;
        }
        
        // "self" is the outer container that holds the
        // inner elements that need to be lined up 
        for (i = 0; i < targets.length; i++) {
            // Filter out invisible elements because they will have zero heights
            groupOfInnerElements = self.find(targets[i]).filter(":visible");
            
            if (i > 0) {
                if (groupOfInnerElements.length !== numberOfInnerElementsPerGroupSoFar) {
                    console.log(
                        "There are " + groupOfInnerElements.length + " visible inner-elements of type \"" + 
                        targets[i] + "\" while there were " + numberOfInnerElementsPerGroupSoFar +
                        " visible inner-element of the other types so far. There must be the same number."
                        );
                        
                    return;
                }               
            }
            
            lineupRows.push(groupOfInnerElements);
            
            numberOfInnerElementsPerGroupSoFar = groupOfInnerElements.length;
        }
        
        lineUpHeights(lineupRows);
        
        function lineUpHeights(lineupRows) {
            var currentRow = [], newRow, currentRowTopPosition, 
            i, j, k, thisTarget, thisTargetTopPosition, initialRow, beginningIndexOfThisRow,
            endIndexOfThisRow, numberOfLineupItemsLeft
                      
            beginningIndexOfThisRow = 0;            
            initialRow = lineupRows[0];    
            currentRow.push($(initialRow[0]));
            currentRowTopPosition = currentRow[0].position().top;
            
            for (i = 1; i < initialRow.length; i++) {
                thisTarget = $(initialRow[i]);
                thisTargetTopPosition = thisTarget.position().top;

                // If the position is within plus/minus 3 pixels, consider it to be on the same row
                if ((thisTargetTopPosition <= currentRowTopPosition + 3) && (thisTargetTopPosition >= currentRowTopPosition - 3)) {
                    currentRow.push(thisTarget);
                } else {
                    // This row is done, so now we set the correct heights on each other row
                    setMaxHeights(currentRow);                    
                    endIndexOfThisRow = i - 1;                    
                    setMaxHeightsOnOtherRows(beginningIndexOfThisRow, endIndexOfThisRow, lineupRows);

                    newRow = [];
                    newRow.push(thisTarget);
                    
                    // Element may have moved after the elements in the previous row were resized,
                    // so get its position again
                    currentRowTopPosition = thisTarget.position().top
                    
                    beginningIndexOfThisRow = endIndexOfThisRow + 1;
                    
                    currentRow = newRow;
                }
            }

            //Deal with the last row
            setMaxHeights(currentRow);
            endIndexOfThisRow = i - 1;
            setMaxHeightsOnOtherRows(beginningIndexOfThisRow, endIndexOfThisRow, lineupRows);            
        }

        // Helper function for lineUpHeights
        function setMaxHeights(currentRow) {
            var maxHeight, thisHeight, j;

            currentRow.forEach(function (e) {
                e.css( { "height" : "auto" } );
            });

            maxHeight = currentRow[0].height();

            for (j = 1; j < currentRow.length; j++) {
                thisHeight = currentRow[j].height();

                if (thisHeight > maxHeight) {
                    maxHeight = thisHeight;
                }
            }

            // Set the max on all in the row. Overflow-visible is useful if we are
            // setting default css heights (as a fallback for JavaScript being turned off)
            // with scroll bars for overflow. We don't want to see those scroll bars if
            // this code is setting heights.
            for (j = 0; j < currentRow.length; j++) {
                currentRow[j].css({ "overflow-y" : "visible", "height" : maxHeight });
            }
        }
        
        function setMaxHeightsOnOtherRows(beginningIndex, endIndexInclusive, lineupRows) {        
           var numberOfLineupRowsLeft = lineupRows.length - 1, i, j, row;
           
            for (i = 0; i < numberOfLineupRowsLeft; i++) {
                row = [];
                
                for (j = beginningIndex; j <= endIndexInclusive; j++) {
                    row.push($(lineupRows[i+1][j])); // i+1 because 0th is the initial inner row
                }   
                
                setMaxHeights(row);
            }        
        }
    }
})(jQuery.noConflict());
