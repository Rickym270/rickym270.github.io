#!/usr/bin/python3

def remove_kth_element(nums, k):
    # TODO: Init fast and slow pointers
    fast = slow = nums[0]

    # TODO: Iterate to get fast
    for _ in range(len(nums)):
        fast = fast.next

    # TODO: While there is a fast
    while fast.next:
        # TODO: Update fast and slow
        fast = fast.next
        slow = slow.next
    slow = slow.next.next

    return nums[0]''

