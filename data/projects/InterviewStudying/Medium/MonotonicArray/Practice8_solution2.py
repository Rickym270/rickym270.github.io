#!/usr//bin/python3
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

def isMonotonic(array):
    isNonDecreasing = True
    isNonIncreasing = True

    for i in range(1, len(array)):
        prevNum = array[i - 1]
        currNum = array[i]
        if currNum > prevNum:
            isNonIncreasing = False
        elif currNum < prevNum:
            isNonDecreasing = False
    return isNonIncreasing or isNonDecreasing

if __name__ == "__main__":
    print(isMonotonic(array))
