#!/usr/bin/python3

array = [-3, -2, 0, 5, 10]
targetSum = 7

def twoNumberSum(array, targetSum):
    array.sort()
    lp = 0
    rp = len(array) - 1

    while lp < rp:
        current_sum = array[lp] + array[rp]
        if current_sum == targetSum:
            return [array[lp], array[rp]]
        elif current_sum < targetSum:
            lp += 1
        elif current_sum > targetSum:
            rp -= 1
    return []

if __name__ == "__main__":
    print(twoNumberSum(array, targetSum))
