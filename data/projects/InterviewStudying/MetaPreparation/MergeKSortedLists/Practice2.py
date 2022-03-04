#!/usr/bin/python3
### DIVIDE AND CONQUER
problem_sets = [
    [[1, 4, 5], [1, 3, 4], [2, 6]]
]

def merge_k_lists(lists):
    # TODO: Determine if list exists
    if not lists:
        return None

    # TODO: If lists is only one element, return that element
    if len(lists) == 1:
        return lists[0]

    # TODO: Get the mid point
    mid = len(lists) // 2
    # TODO: Get l, r
    l, r = merge_k_lists(lists[:mid]), merge_k_lists(lists[mid:])

    # TODO: Return l,r merged
    return merge(l, r)

def merge(lp, rp):
    dummy = temp = ListNode(0)

    while lp and rp:
        if lp.val < rp.val:
            temp.next = lp
            lp = lp.next
        else:
            temp.next = rp
            rp = rp.next
        # TODO: Regardless increment
        temp = temp.next
    # TODO: Append remaining items
    temp.next = lp or rp
    return  dummy.next

if __name__ == "__main__":
    for set in problem_sets:
        print(merge_k_lists(set))
