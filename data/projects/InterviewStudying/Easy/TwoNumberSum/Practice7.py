#!/usr/bin/python3

array = [-5,-1,3,4,10]
targetSum = 2

def twoNumberSum(array, targetSum):
    array.sort()
    lp = 0
    rp = len(array) - 1
    
    while lp < rp:
        currentSum = array[lp] + array[rp]
        if currentSum == targetSum:
            return [array[lp], array[rp]]
        elif currentSum < targetSum:
            lp += 1
        elif currentSum > targetSum:
            rp -= 1
    return []
    

if __name__ == "__main__":
    print(twoNumberSum(array, targetSum))

