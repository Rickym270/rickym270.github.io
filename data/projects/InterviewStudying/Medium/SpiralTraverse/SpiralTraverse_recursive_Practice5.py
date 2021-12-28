array = [
    [1, 2, 3, 4],
    [12, 13, 14, 5],
    [11, 16, 15, 6],
    [10, 9, 8, 7]
  ]

def spiralTraverse(array):
    result = []
    startRow, endRow = 0, len(array) - 1
    startCol, endCol = 0, len(array) - 1

    spiralFill(array, startRow, endRow, startCol, endCol, result)

    return result

def spiralFill(array, startRow, endRow, startCol, endCol, result):
    if startRow > endRow or startCol > endCol:
        return
    for col in range(startCol, endCol + 1):
        result.append(array[startRow][col])
    for row in range(startRow + 1, endRow + 1):
        result.append(array[row][endCol])
    for col in reversed(range(startCol, endCol)):
        if startRow > endRow:
            break
        result.append(array[endRow][col])
    for row in reversed(range(startRow + 1, endRow)):
        if startCol > endCol:
            break
        result.append(array[row][startCol])

if __name__ == "__main__":
    print(spiralTraverse(array))