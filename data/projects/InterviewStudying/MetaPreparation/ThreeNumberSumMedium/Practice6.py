#!/usr/bin/data
array = [12, 3, 1, 2, -6, 5, -8, 6]
targetSum = 0

def threeNumberSum(array, targetSum):
    array.sort() # O(nlogn)
    results = []
    for i in range(len(array) - 1):
        current = array[i]
        lp = i + 1
        rp = len(array) - 1

        while lp < rp:
            currentSum = array[i] + array[lp] + array[rp]
            if currentSum == targetSum:
                results.append([array[i], array[lp], array[rp]])
                lp += 1
                rp -= 1
            elif currentSum < targetSum:
                lp += 1
            elif currentSum > targetSum:
                rp -= 1
    return results

if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))
