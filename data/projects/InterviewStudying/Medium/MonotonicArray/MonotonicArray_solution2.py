#!/usr/bin/python3
'''
    Check whether or not it is non decreasing and whether or not
    it is non increasing
'''
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

def isMonotonic(array):
    isNonDecreasing = True
    isNonIncreasing = True
    # NOTE: We start from the second number (idx=1) because we 
    #       are comparing the current number with the previous
    for i in range(1, len(array)):
        # TODO: Compare the values
        if array[i] < array[i-1]:
            # It is decreasing so set to false
            isNonDecreasing = False
        if array[i] > array[i-1]:
            # It is increasing so set to false
            isNonIncreasing = False

    return isNonDecreasing or isNonIncreasing

if __name__ == "__main__":
    print(isMonotonic(array))
