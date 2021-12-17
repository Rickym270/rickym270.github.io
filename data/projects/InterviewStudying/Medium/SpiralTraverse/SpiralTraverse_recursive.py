#!/usr/bin/python3
# TIME: O(n) 
# SPACE: O(n)
def spiralTraverse(array):
    # TODO: Create results to be returned
    results = []
    # TODO: Call function the populate results
    # NOTE: We have to subtract 1 to get the index of the last
    #       row/col
    spiralFil(array, 0, len(array) - 1, 0, len(array[0]) - 1\
            result)
    # TODO: Return result
    return result

#TODO: Create a function that will populate results
# NOTE: Must take an array, takes bounds.
#           start/end row, start/end col
#           result array
def spiralFill(array, startRow, endRow, startCol, endCol,\
                result):
    # TODO: Create the case where the function doesn't run
    #       recursively anymore
    if startRow > endRow or startCol > endCol:
        return
    # NOTE: We add one because range is not inclusive at the endi
    # NOTE: Starts wth first argument, but does not end with 
    #       secxond argument
    #       for i in range(1,10)
    #           - 1,2,3,4,5,6,7,8,9
    # We want it to be inclusive
    # TODO: Iterate along top 
    for col in range(startCol, endCol + 1):
        result.append(array[col])

    # TODO: Iterate along left
    for row in range(startRow + 1, endRow + 1):
        result.append(array[row])

    # TODO: Iterate along bottom
    for col in range(startCol + 1, endCol):
        result.append(array[col])

    # TODO: Iterate along left
    for row in range(starRow + 1, endRow):
        result.append(array[row])

    # NOTE: This is recursive so instead of\
    #       incrementing/decrementing the start/end row/column, 
    #       in place, you would call the function again with the 
    #       values decremented/incremented in the call
    sprialFill(array, startRow + 1, endRow - 1, startCol + 1, \
                endCol - 1)
    
