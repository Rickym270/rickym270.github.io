#!/usr/bin/python3
array = [
    [1, 2, 3, 4],
    [12, 13, 14, 5],
    [11, 16, 15, 6],
    [10, 9, 8, 7]
  ]

def spiralTraverse(array):
    startRow, endRow = 0, len(array) - 1
    startCol, endCol = 0, len(array[0]) - 1
    result = []

    spiralFiller(array, startRow, endRow, startCol, endCol, result)

    return result

def spiralFiller(array, startRow, endRow, startCol, endCol, result):
    if startRow > endRow and startCol > endCol:
        return

    for col in range(startCol, endCol):
        result.append(array[startRow][col])
    for row in range(startRow + 1, endRow + 1):
        result.append(array[row][endCol])
    for col in reversed(range(startCol, endCol)):
        if startCol == endCol:
            break
        result.append(array[endRow][col])
    for row in reversed(range(startRow + 1, endRow)):
        if startRow == endRow:
            break
        result.append(array[startCol][row])

    spiralFiller(array, startRow+1, endRow-1, startCol+1, endRow-1, result)


if __name__ == "__main__":
    print(spiralTraverse(array))
