'''
    Given a list of integers, write a function that returns the largest sum of non-adjacent numbers. Numbers can be 0
    or negative.

    For example,
        [2, 4, 6, 2, 5] should return 13, since we pick 2, 6, and 5.
        [5, 1, 1, 5] should return 10, since we pick 5 and 5.

    Follow-up: Can you do this in O(N) time and constant space?
'''
nums = [2, 4, 6, 2, 5]
nums2 = [5, 1, 1, 5]
def largest_nonadjacent_sums1(arr, i=0):
    # TODO: We need 3 pointers
    s0 = 0
    s2 = max(0, arr[0])
    s1 = max(s2, arr[1])

    # TODO: Iterate through arr
    for i in range(2, len(arr)):
        # TODO: Update s0
        s0 = max(s1, s2 + arr[i])
        s2 = s1
        s1 = s0
    return s0

def largest_nonadjacent_sums(arr, i=0):
    # TODO: Init s0
    s0 = 0
    # TODO: Init s1 and s2.
    #       NOTE: s1 > s2 because s2 gets the first greatest from 0 - arr[0]
    #                             s1 gets the second (most) greatest from s2 to arr[0]
    s2 = max(0, arr[0])
    s1 = max(s2, arr[1])
    # TODO: Since we have two maxes, start iterating from 2 - len(arr)
    for k in range(2, len(arr)):
        # TODO: Set s0 to be the max between s1 and s2 + current element
        #           s0 = max(Second greatest, First Greatest + current)
        s0 = max(s1, s2 + arr[k])
        # TODO: Update s2 and s1
        s2 = s1
        s1 = s0
    return s0

if __name__ == "__main__":
    print(largest_nonadjacent_sums1(nums))
