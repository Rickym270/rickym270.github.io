#!/usr/bin/python3
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

def isMonotonic(array):
    isNonIncreasing = True
    isNonDecreasing = True

    for i in range(1, len(array) - 1):
        if array[i-1] < array[i]:
            isNonIncreasing = False
        elif array[i-1] > array[i]:
            isNonDecreasing = False
    return isNonDecreasing or isNonIncreasing

if __name__ == "__main__":
    print(isMonotonic(array))

