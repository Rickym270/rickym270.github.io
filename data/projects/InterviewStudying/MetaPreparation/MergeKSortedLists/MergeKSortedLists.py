#!/usr/bin/python3
problem_sets = [
    [[1, 4, 5], [1, 3, 4], [2, 6]]
]

def merge_k_lists(lists):
    if not lists:
        return None
    if len(lists) == 1:
        return lists[0]

    # TODO: Get mid of the llsts array
    mid = len(lists) // 2
    # TODO: Merge lists at both sides of mid
    l, r = merge_k_lists(lists[:mid]), merge_k_lists(lists[mid:]) 5
    return merge(l, r)

def merge(l, r):
    # TODO: Init dummy, temp = ListNode(0)
    dummy = temp = ListNode(0)

    # TODO: Iterate while list exists
    while l and r:
        if l.val < r.val:
            # TODO: Set temp.next focus to smaller value
            temp.next = l
            l = l.next
        else:
            temp.next = r
            r = r.next
        r = r.next
    temp.next = r or l
    return dummy.next


if __name__ == "__main__":
    for set in problem_sets:
        print(merge_k_lists(set))
