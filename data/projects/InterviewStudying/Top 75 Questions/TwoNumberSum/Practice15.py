#!/usr/bin/python3
# Time: O(n)
# Space: O(1)
array = [-2, -4, 0, 5, 2]
targetSum = 0

def twoNumberSum(array_one, target_sum):
    array_one.sort()
    lp = 0
    rp = len(array) - 1

    while lp < rp:
        current_sum = array[lp] + array[rp]
        if current_sum == target_sum:
            return [array[lp], array[rp]]
        elif current_sum < targetSum:
            lp += 1
        else:
            rp -= 1
    return []

if __name__ == "__main__":
    print(twoNumberSum(array, targetSum))