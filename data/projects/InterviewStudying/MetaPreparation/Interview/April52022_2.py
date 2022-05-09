'''
Q2 Merge Interval Lists:
    -Consider the concept of a 'sorted, non-overlapping interval list'
     - which is an array of intervals that don't overlap with each other and are sorted by interval start.
    -Given two of these interval lists, return a 3rd interval list that is the union of the input interval lists.
    For example:
        Input:
            {[1,2], [3,9]}
            {[4,6], [8,10], [11,12]}
        Output should be:
            {[1,2], [3,10], [11,12]}
'''
l1 = [[1, 2], [3, 9]]
l2 = [[4, 6], [8, 10], [11, 12]]

def merge_interval_lists(A, B):
    # TODO: Use two pointers
    i, j = 0, 0
    # TODO: Define res
    res = []

    # TODO: While within either bounds
    while i < len(A) or j < len(B):
        # TODO: If out of bounds for first one, swithc focus and increment
        if i == len(A):
            current = B[j]
            j += 1
        elif j == len(B):
            current = A[i]
            i += 1
        # TODO: Check if first elemtn is less than second
        elif A[i][0] <= B[j][0]:
            current = A[i]
            i += 1
        else:
            current = B[j]
            j += 1

        # TODO: if last element of res >= first element of current
        if res and res[-1][-1] >= current[0]:
            res[-1][-1] = max(res[-1][-1], current[-1])
        else:
            res.append(current)


    # i = 0
    # j = 0
    # res = []
    # # TODO: While within bounds
    # while i < len(A) or j < len(B):
    #     # TODO: If first pointer is at the end, switch focus to sec
    #     #           iNCREMENT j
    #     if i == len(A):
    #         curr = B[j]
    #         j += 1
    #     elif j == len(B):
    #         curr = A[i]
    #         i += 1
    #     elif A[i][0] < B[j][0]:
    #         curr = A[i]
    #         i += 1
    #     else:
    #         curr = B[j]
    #         j += 1
    #
    #     if res and res[-1][-1] >= curr[0]:
    #         res[-1][-1] = max(res[-1][-1], curr[-1])
    #     else:
    #         res.append(curr)
    #
    # print(res)

if __name__ == "__main__":
    print(merge_interval_lists(l1, l2))