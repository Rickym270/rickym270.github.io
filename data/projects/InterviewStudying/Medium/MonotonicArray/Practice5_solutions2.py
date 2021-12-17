#!/usr/bin/python3
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

def isMonotonic(array):
    isNonDecreasing = True
    isNonIncreasing = True
    
    for i in range(1, len(array)):
        if array[i] > array[i-1]:
            isNonIncreasing = False
        elif array[i] < array[i-1]:
            isNonDecreasing = False
    return isNonDecreasing or isNonIncreasing

if __name__ == "__main__":
    print(isMonotonic(array))
