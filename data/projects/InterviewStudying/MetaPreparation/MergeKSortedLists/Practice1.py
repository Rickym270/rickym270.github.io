#!/usr/bin/python3
### DIVIDE AND CONQUER
problem_sets = [
    [[1, 4, 5], [1, 3, 4], [2, 6]]
]

def merge_k_lists(lists):
    # TODO: Check if list exists
    if not lists:
        return None
    # TODO: Check if list exists
    if len(lists) == 1:
        return lists[0]
    # TODO: Find mid point
    mid = len(lists) // 2
    # TODO: Get left and right
    l, r = merge_k_lists(lists[mid:]), merge_k_lists(lists[:mid])
    # TODO: Merge left and right
    return merge(l, r)

def merge(l1, r1):
    # TODO: Init dummy = temp = ListNode(0)
    dummy = temp = ListNode(0)

    # TODO: Iterate while l1 and l2
    while l1 and r1:
        if l1.val < r1.val:
            temp.next = l1
            l1 = l1.next
        else:
            temp.next = r1
            r1 = r1.next
        # TODO: Increment by default
        temp = temp.next
    # TODO: Save remainder
    temp.next = l1 or r1
    return dummy.next

if __name__ == "__main__":
    for set in problem_sets:
        print(merge_k_lists(set))
