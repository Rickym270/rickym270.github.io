#!/usr/bin/python3.8
'''
    Given a singly linked list and an integer k, remove the kth last element from the list. k is guaranteed to be
    smaller than the length of the list.

    The list is very long, so making more than one pass is prohibitively expensive.

    Do this in constant space and in one pass.
'''
k = 3
# TODO: Define the node
class Node:
    def __init__(self, val=None, node=None):
        self.data = val
        self.next = node

class Singly_LinkedList:
    def __init__(self):
        self.head = None

    def print_list(self):
        print_val = self.head
        while print_val:
            print(print_val.data)
            print_val = print_val.next


def find_kth_last_element(head, k):
    # TODO: Create and maintain a "fast" pointer
    fast = None
    for i in range(len(head)):
        if i == 0:
            fast = head
        else:
            fast = fast.next
    # TODO: Create slow pointers
    slow, slow_prev = head, None

    # TODO: Iterate slow pointer
    while fast.next:
        fast = fast.next
        slow_prev = slow
        slow = slow.next



if __name__ == "__main__":
    SLinkedList = Singly_LinkedList()
    SLinkedList.head = Node("M")
    node_a = Node("A")
    node_d = Node("D")
    SLinkedList.head.next = node_a
    node_a.next = node_d

    SLinkedList.print_list()
    print(find_kth_last_element(SLinkedList, k))
