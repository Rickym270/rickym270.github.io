#!/usr/bin/python3

def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
    temp = dummy = ListNode(0)

    # TODO: Iterate t hrough list while l1 != None and l2 != None
    while l1 != None and l2 != None:
        if l1.val < l2.val:
            # TODO: Change temp.next = l1
            temp.next = l1
            l1 = l1.next
        else:
            temp.next = l2
            l2 = l2.next

        # TODO: Default, increment temp
        temp = temp.next
    # TODO: Default add remainder to list
    temp.next = l1 or l2
    # TODO: Return dummy
    return dummy.next