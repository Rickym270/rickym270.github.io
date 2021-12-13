#!/usr/bin/python3

def twoNumberSum(arr, targetSum):
    lp = 0
    rp = len(arr) - 1 
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
    print(twoNumberSum([12,2,1,4,8,9], 12))

