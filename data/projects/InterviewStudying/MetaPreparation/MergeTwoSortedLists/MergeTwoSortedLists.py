#!/usr/bin/python3

def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
    # TODO: Init dummy, temp and set it equal to linked_list[0]
   dummy = temp = ListNode(0)

    while l1 != None and l2 != None:
        # TODO: Add smaller one to linked list
        if l1.val < l2.val:
            # TODO: Add smaller val to the linked list
            #           Set temp.next = to l1.
            #       REMEMBER: temp is a pointer to the og linked list
            temp.next = l1
            # TODO: Go to the next value of l1
            l1 = l1.next
        else:
            temp.next = l2
            l2 = l2.next

        temp = temp.next
    # TODO: Add whatever is left to the linked list
    temp.next = l1 or l2

    # TODO: Return the pointer to the LinkedList that we've been modifying
    return dummy.next