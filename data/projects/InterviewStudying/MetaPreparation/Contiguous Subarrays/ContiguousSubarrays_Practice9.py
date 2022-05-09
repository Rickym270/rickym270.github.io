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
    # TODO: init res, stack arr len
    n = len(array)
    res = [1] * n
    stack = [-1]

    # TODO: Iterate left through array
    for i in range(n):
        # TODO: Remove previous element from the stack if it is less than the current element
        while len(stack) > 1 and arr[stack[-1]] < arr[i]:
            stack.pop()
        # TODO: res[i] += i - stack[-1] - 1
        res[i] += i - stack[-1] - 1
        # TODO: Append element to stack
        stack.append(i)

    # TODO: Do the same for right but previous element must be greater than current
    stack = [n]
    for i in reversed(range(n)):
        while len(stack) > 1 and arr[stack[-1]] < arr[i]:
            stack.pop()
        res[i] = stack[-1] - i - 1
        stack.append(i)
    return res

if __name__ == "__main__":
    print(count_subarrays(arr))
