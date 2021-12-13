#!/usr/bin/python3
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

# TIME: O(n)
# SPACE: O(1)
def isMonotonic(array):
    isNonDecreasing = True
    isNonIncreasing = True

    for i in range(1, len(array)):
        currentNum = array[i]
        previousNum = array[i - 1]
        if previousNum > currentNum:
            isNonIncreasing = False
        if previousNum < currentNum:
            isNonDecreasing = False

    return isNonIncreasing or isNonDecreasing

if __name__ == "__main__":
    print(isMonotonic(array))
