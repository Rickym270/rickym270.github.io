#!/usr/bin/python3
'''
    You are given an array arr of N integers. For each index i, you are required to
    determine the number of contiguous subarrays that fulfill the following conditions:
        The value at index i must be the maximum element in the contiguous subarrays
        These contiguous subarrays must either start from or end on index i.

    Output
        An array where each index i contains an integer denoting the maximum number of contiguous subarrays of arr[i]
        Example:
            arr = [3, 4, 1, 6, 2]
            output = [1, 3, 1, 5, 1]
        Explanation:
            For index 0 - [3] is the only contiguous subarray that starts (or ends)
                            with 3, and the maximum value in this subarray is 3.
            For index 1 - [4], [3, 4], [4, 1]
            For index 2 - [1]
            For index 3 - [6], [6, 2], [1, 6], [4, 1, 6], [3, 4, 1, 6]
            For index 4 - [2]
            So, the answer for the above input is [1, 3, 1, 5, 1]
'''
arr = [3, 4, 1, 6, 2]
def count_subarrays(arr):
    # Write your code here
    # NOTE: Output[i] = L[i] + R[i] - 1
    # TODO: Get length of array
    n = len(arr) # 5
    # TODO: Create empty array of 1's. Ex. [1, 1, 1, 1, 1]
    res = [1 for _ in arr]
    stack = [-1]

    #left
    # 0, 1, 2, 3, 4
    for i in range(n):
        # Skips first iteration because len(stack) == 1 and 1 is not > 1
        # NOTE: We want to keep stack at > one number while last element of array is
        #       less than current element
        #           This will only run on the second iteration since len(stack) is not > 1 until second iteration
        #
        while len(stack) > 1 and arr[stack[-1]] < arr[i]:
            # NOTE: No empty stack so ensure there is always at least one element because there should be a "window"
            # NOTE: Last recorded position is less than the current element
            stack.pop()

        res[i] += i - stack[-1] - 1
        stack.append(i)

    # from right
    stack = [n]
    for i in range(n - 1, -1, -1):
        while len(stack) > 1 and arr[stack[-1]] < arr[i]:
            stack.pop()
        res[i] += stack[-1] - i - 1
        stack.append(i)
    return res

if __name__ == "__main__":
    print(count_subarrays(arr))
