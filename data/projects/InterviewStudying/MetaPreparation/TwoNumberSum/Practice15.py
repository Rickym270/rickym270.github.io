#!/usr/bin/python3
# Time: O(n)
# Space: O(1)
array = [-2, -1, 0, 5, 1]
targetSum = 10

def twoNumberSum(nums, target_sum):
    # TODO: Define return list
    # TODO: Return pairs
    left = 0
    right = len(nums) - 1

    while left < right:
        current_sum = nums[left] + nums[right]

        if current_sum == target_sum:
            return [nums[left], nums[right]]
        elif current_sum < target_sum:
            left += 1
        else:
            right -= 1
    return []


if __name__ == "__main__":
    print(twoNumberSum(array, targetSum))