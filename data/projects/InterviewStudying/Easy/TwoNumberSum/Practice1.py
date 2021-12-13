#!/usr/bin/python3

'''
    Problem: Find the two numbers that add up to the targetSum.
        [2,1,4,7,8], 11
'''

def twoNumberSum(arr, targetSum):
    lp = 0
    rp = 0
    arr.sort()

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
    twoNumberSum([2, 1, 4, 7, 8], 11)
