#!/usr//bin/python3
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

def isMonotonic(array):
    #TODO: Traverse through the array from 1 because we are 
    #       comparing current with previous
    #           - If current is less than previous, 
    #               isNonDecreasing = False
    #           - If current is more than previous, 
    #               isNonIncreasing = False
    isNonDecreasing = True
    isNonIncreasing = True

    for i in range(1, len(array)):
        if array[i] < array[i - 1]:
            isNonDecreasing = False
        elif array[i] > array[i - 1]:
            isNonIncreasing = False
    return isNonIncreasing or isNonDecreasing

if __name__ == "__main__":
    print(isMonotonic(array))
