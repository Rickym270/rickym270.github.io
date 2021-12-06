#!/usr/bin/python3
'''
    [-2, -1, 0, 5, 10]

    [0, 1, 4, 25, 100]

'''
def sortedSquareArray(array):
    squared_array = [0 for _ in array]
    smallerValueIdx = 0
    greaterValueIdx = len(array) - 1

    for idx in reversed(range(len(array))):
        smallerValue = array[smallerValueIdx]
        greaterValue = array[greaterValueIdx]

        if abs(smallerValue) > abs(greaterValue):
            squared_array[idx] = smallerValue * smallerValue
            smallerValueIdx += 1
        else:
            squared_array[idx] = greaterValue * greaterValue
            greaterValueIdx -= 1

    return squared_array


if __name__ == "__main__":
    print(sortedSquareArray([-2, -1, 0, 5, 10]))

