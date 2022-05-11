#!/usr/bin/python3

'''
    Problem: Find the two numbers that add up to the targetSum.
        [11, 2, 5, 6, 4, 8, 1], 10
'''

def twoNumberSum(arr, targetSum):
    arr.sort()
    lp = 0
    rp = len(arr) - 1

    while lp < rp:
        currentSum = arr[lp] + arr[rp]
        if currentSum == targetSum:
            return [arr[lp], arr[rp]]
        elif currentSum < targetSum:
            lp += 1
        elif currentSum > targetSum:
            rp -= 1
    return []

if __name__ == "__main__":
    print(twoNumberSum([3, 5, -4, 8, 11, 1, -1, 6], 10))
