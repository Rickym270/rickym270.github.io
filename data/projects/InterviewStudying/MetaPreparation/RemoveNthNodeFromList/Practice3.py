#!/usr/bin/python3
problems = [
    [[1, 2, 3, 4, 5], 2]
]

# Definition for singly-linked list.
# class ListNode:
#     def __init__(self, val=0, next=None):
#         self.val = val
#         self.next = next

def remove_nth_node(head, nth_node):
    # TODO: Use slow and fast pointers
    slow = fast = head

    # TODO: Get fast
    for _ in range(nth_node):
        fast = fast.next

    # TODO: Does fast exist?
    if not fast.next:
        return head.next

    # TODO: Iterate while fast exists
    while fast.next:
        # TODO: Update current vals
        fast = fast.next
        slow = slow.next
    slow = slow.next.next

    return head

if __name__ == "__main__":
    for problem_set in problems:
        print("Head: {} n = {}".format(problem_set[0], problem_set[1]))
        print(remove_nth_node(problem_set[0], problem_set[1]))
        print("\n\n")
