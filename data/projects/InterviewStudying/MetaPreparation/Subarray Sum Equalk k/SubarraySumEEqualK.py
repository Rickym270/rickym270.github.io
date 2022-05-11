#!/usr/bin/python3

def subarraySumEqualsK(nums, t):
    # TODO: Edge cases
    if not nums or t <= 0: return False
    left, right, total = 0, 0, 0

    while right < len(nums):
        # TODO: Add to total
        total += nums[right]
        # TODO: Increment right pointer
        right += 1

        # TODO: Check if current sum is greater than T
        while total > T:
            total -= sums[left]
            left += 1

        # TODO: If total == T:
        if total == T:
            return True
