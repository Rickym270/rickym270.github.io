#!/usr//bin/python3
array = [-1, -5, -10, -1100, -1100, -1101, -1102, -9001]

def isMonotonic(array):
    isNonDecreasing = True
    isNonIncreasing = True

    for i in range(1, len(array)):
        curNum = array[i]
        prevNum = array[i - 1]

        if curNum > prevNum:
            isNonIncreasing = False
        elif curNum < prevNum:
            isNonDecreasing = False
    return isNonIncreasing or isNonIncreasing


if __name__ == "__main__":
    print(isMonotonic(array))
