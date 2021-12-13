#!/usr/bin/python3
array = [
    [1, 2, 3, 4],
    [12, 13, 14, 5],
    [11, 16, 15, 6],
    [10, 9, 8, 7]
  ]
# Time: O(n) because we are visiting each value once
# Space: O(n) because we are creating an array but in reality its
#           more like O(1) space
def spiralTraverse(array):
    #TODO: Declare the array we will be returning
    result = []
    #TODO: Declare bounds (start/end row, start/end column)
    #NOTE: We can get these values just from the dimensions of 
    #       the 2D array
    startRow, endRow = 0, len(array) - 1
    startCol, endCol = 0, len(array[0]) - 1
    #TODO: Start the traversal
    #NOTE: Use a while loop, startingRow <= endingRow and 
    #       startingCol <= endCol
    #NOTE: <= is important because the row or col may just be
    #       single sized (1x120 or 120x1)
    while startRow <= endRow and startCol <= endCol:
        if startCol == endCol:
            break
        # TODO: Iterate through the column (top border)
        # NOTE: we add one to endCol so this loop is inclusive
        for col in range(startCol, endCol + 1):
            result.append(array[startRow][col])
        # TODO: Iterate through the row (right border)
        for row in range(startRow + 1, endRow + 1):
            result.append(array[row][endCol])

        # TODO: Go in reversed order because we want to go right
        #       to left
        for col in reversed(range(startCol, endCol)):
            result.append(array[endRow][col])

        for row in reversed(range(startRow + 1, endRow)):
            result.append(array[row][startCol])

        #TODO: Push all the boundaries inwards 
        startRow += 1
        endRow -= 1
        startCol += 1
        endCol -= 1
    return result


if __name__ == "__main__":
    print(spiralTraverse(array))
