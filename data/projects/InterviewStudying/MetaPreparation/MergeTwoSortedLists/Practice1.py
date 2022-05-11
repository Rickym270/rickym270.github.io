#!/usr/bin/python3

def mergeTwoLists(self, l1: ListNode, l2: ListNode) -> ListNode:
    # TODO: Init temp = dummy = ListNode(0)
    temp = dummy = ListNode(0)
    # TODO: Iterate while l1 != None and l2 != None
    while l1 != None and l2 != None:
        # TODO: If l1 < l1
        if l1.val < l2.val:
            # TODO: Set temp.next = l1
            temp.next = l1
            # TODO: Update next position as current
            l1 = l1.next
        else:
            temp.next = l2
            l2 = l2.next
        # TODO: Increment temp
        temp = temp.next
    # Set temp.next = l1 or l2
    temp.next = l1 or l2
    # Return pointer to beginning
    return dummy.next
