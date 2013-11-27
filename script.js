(function ($) {
    "use strict";
    $(function () {        
        /* User sets up this portion */
        
        var lineupRows  = [
            $(".rectangle h1"),
            $(".rectangle h3"),
            $(".rectangle .inner-div p")
        ];
        
        $(window).on("load resize", setHeights);
        setHeights();
        
        function setHeights(event) {
            lineUpHeights(lineupRows);
        }                
        /* End of user setup */
        
        function lineUpHeights(lineupRows) {
            var currentRow = [], $lineupRowsVisible = [], $thisVisibleRow, newRow, currentRowTopPosition, 
            i, j, k, thisTarget, thisTargetTopPosition, initialRow, beginningIndexOfThisRow,
            endIndexOfThisRow, numberOfLineupItemsLeft

            if (!lineupRows || lineupRows.length === 0) {
                console.log("lineupRows was null or its length was zero");
                return;
            }            
            
            // Convert each element to a jQuery object, and filter out invisible elements because they will have zero heights
            for (i = 0; i < lineupRows.length; i++) {
                $thisVisibleRow = lineupRows[i].filter(":visible").css({"overflow" : "visible"});
                $lineupRowsVisible.push($thisVisibleRow);
            }
                        
            beginningIndexOfThisRow = 0;            
            initialRow = $lineupRowsVisible[0];    
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
                    setMaxHeightsOnOtherRows(beginningIndexOfThisRow, endIndexOfThisRow, $lineupRowsVisible);

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
            
            setMaxHeightsOnOtherRows(beginningIndexOfThisRow, endIndexOfThisRow, $lineupRowsVisible);            
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
                currentRow[j].css({ "height" : maxHeight });
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
    });
    
})(jQuery.noConflict());
