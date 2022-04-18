#!/usr/bin/python3

def subarray_sums(nums, k):
    # TODO: Base checks
    if not nums or k <= 0: return False
    left, right, total = 0,0,0

    # TODO: Iterate while right < len(nums)
    while right < len(nums):
        total += nums[right]
        right += 1

        while total > k:
            total -= nums[left]
            left += 1

        if total == k:
            return True

    return False

