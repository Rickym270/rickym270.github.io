#!/usr/bin/python3
# Time: O(n)
# Space: O(1)
array = [-2, -1, 0, 5, 1]
targetSum = 0

def twoNumberSum(nums, target_sum):
    # TODO: Return list
    res = []

    # TODO: Iterate through nums
    for i in range(len(nums)):
        idxOne = i + 1

        while idxOne < len(nums):
            current_sum = nums[i] + nums[idxOne]
            if current_sum == target_sum:
                res.append([nums[i], nums[idxOne]])

            idxOne += 1
    return res

if __name__ == "__main__":
    print(twoNumberSum(array, targetSum))