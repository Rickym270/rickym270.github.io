#!/usr/bin/python3
l1 = [1, 2, 4]
l2 = [1, 3, 4]
def mergeTwoLists(l1, l2):
    # TODO: Create temp, res thats the same ;ength as l1 + l2
    temp = res = [-1] * (len(l1) * len(l2))
    # TODO: Create pointers
    l1_ptr, l2_ptr = 0, 0
    i = 0

    # TODO: Iterate through arrays while l1 < l1_ptr
    while l1_ptr < len(l1) and l2_ptr < len(l2):
        # TODO: Check which elemt is greaster, save that into
        if l1[l1_ptr] < l2[l2_ptr]:
            temp[i] = l1[l1_ptr]
            l1_ptr += 1
        elif l1[l1_ptr] > l2[l2_ptr]:
            temp[i] = l2[l2_ptr]
            l2_ptr += 1
        else:
            # TODO: Equal so save both
            temp[i] = l1[l1_ptr]
            temp[i+1] = l2[l2_ptr]
            l1_ptr += 1
            l2_ptr += 1
            i += 1
        i += 1
    #TODO: Save the remaining amounts
    temp[i:] = l1[l1_ptr:] or l2[l2_ptr:]
    return temp




if __name__ == "__main__":
    print(mergeTwoLists(l1, l2))
