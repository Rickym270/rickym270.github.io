#!/usr/bin/python3

array = [1,2,5]
targetSum = 6

def twoNumberSum(array, targetSum):
    array.sort()
    lp = 0
    rp = len(array) - 1

    while lp < rp:
        currentSum = array[lp] + array[rp]
        if currentSum == targetSum:
            return [array[lp], array[rp]]
        elif targetSum > currentSum:
            lp += 1
        elif targetSum < currentSum:
            rp -= 1
    return []

if __name__ == "__main__":
    print(twoNumberSum(array, targetSum))

