#!/usr/bin/python3
array = [
            [19, 32, 33, 34, 25, 8],
            [16, 15, 14, 13, 12, 11],
            [18, 31, 36, 35, 26, 9],
            [1, 2, 3, 4, 5, 6],
            [20, 21, 22, 23, 24, 7],
            [17, 30, 29, 28, 27, 10]
      ]

def spiralTraverse(array):
    # TODO: Define result array
    result = []
    # TODO: Create variables to store startRow, endRow, startCol and endCol
    # NOTE: len is 0 when string or list is empty (1,2,3,4,5)
    startRow, endRow = 0, len(array) - 1
    startCol, endCol = 0, len(array[0]) - 1
    #TODO: Recurse through the list
    spiralFiller(array, startRow, endRow, startCol, endCol,\
                                                    result)
    # TODO: Return results
    return result

def spiralFiller(array, startRow, endRow, startCol, endCol,\
        results):
    #TODO: if the start pointers, exceed the bounds, return None
    if startRow > endRow or startCol > endCol:
        return
    #TODO: Iterate through the top
    for col in range(startCol, endCol + 1):
        results.append(array[startRow][col])
    #TODO: Iterate through the right
    for row in range(startRow + 1, endRow + 1):
        results.append(array[row][endCol])
    #TODO: Iterate through bottom
    for col in reversed(range(startCol, endCol)):        
        # NOTE: What if there is no row or column in the middle
        #           a 4x4 has no middle
        if startRow > endRow or startCol > endCol:
            break
        results.append(array[endRow][col])
    #TODO: Iterate through left
    for row in reversed(range(startRow + 1], endRow)):
        if startRow > endRow or startCol > endCol:
            break
        results.append(array[row][startCol])

    spiralFiller(array, startRow + 1, endRow - 1, \
                        startCol + 1, endCol - 1, result)


if __name__ == "__main__":
    print(spiralTraverse(array))
