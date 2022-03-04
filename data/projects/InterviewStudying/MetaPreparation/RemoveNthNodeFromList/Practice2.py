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
    # TODO: Init vars
    fast = slow = head

    # TODO: Fast forward fast pointer
    for _ in range(nth_node):
        fast = fast.next

    # TODO: does fast exist?
    if not fast:
        return head.next

    # TODO: Iterate through head
    while fast.next:
        fast = fast.next
        slow = slow.next
    # TODO: Increment slow pointer
    slow = slow.next.next

    # TODO: Return head
    return head

if __name__ == "__main__":
    for problem_set in problems:
        print("Head: {} n = {}".format(problem_set[0], problem_set[1]))
        print(remove_nth_node(problem_set[0], problem_set[1]))
        print("\n\n")
