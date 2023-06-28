#!/usr/bin/python3
'''
     You are given an array arr of N integers. For each index i, you are required to
    determine the number of contiguous subarrays that fulfill the following conditions:
        The value at index i must be the maximum element in the contiguous subarrays
        These contiguous subarrays must either start from or end on index i.

    Output
        An array where each index i contains an integer denoting the maximum number of
        contiguous subarrays of arr[i]
        Example:
            arr = [3, 4, 1, 6, 2]
            output = [1, 3, 1, 5, 1]
        Explanation:
            For index 0 - [3] is the only contiguous subarray that starts (or ends) with 3, and the maximum value in this subarray is 3.
            For index 1 - [4], [3, 4], [4, 1]
            For index 2 - [1]
            For index 3 - [6], [6, 2], [1, 6], [4, 1, 6], [3, 4, 1, 6]
            For index 4 - [2]
            So, the answer for the above input is [1, 3, 1, 5, 1]
'''
arr = [3, 4, 1, 6, 2]
# 1, 3, 1, 5, 1
def count_subarrays(array):
    # TODO: Initialize vars
    n = len(arr)
    res = [1 for _ in array]
    # TODO: Initiate auxillary ds
    stack = [-1]

    # TODO: Iterate left
    for i in range(n):
        # TODO: While there is more than one element in stack and previous is less
        #           than current, pop stack
        while len(stack) > 1 and arr[stack[-1]] < arr[i]:
            stack.pop()
        res[i] += i - stack[-1] - 1
        stack.append(i)

    # TODO: Reset stack and Iterate right
    stack = [n]
    #1, 2, 1, 4, 1
    for i in reversed(range(n)):
        while len(stack) > 1 and arr[stack[-1]] < arr[i]:
            stack.pop()
        res[i] += stack[-1] - i - 1
        stack.append(i)

    # TODO: return rs
    return res

if __name__ == "__main__":
    print(count_subarrays(arr))