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
    n = len(array)
    res = [1] * n
    stack = [-1]
    print(res)

    # TODO: Traverse left
    for i in range(n):
        # TODO: While stack has more than one element and previous number is less than current number
        while len(stack) > 1 and array[stack[-1]] < array[i]:
            stack.pop()
        # TODO: Add left result into res
        res[i] += i - stack[-1] - 1
        # TODO: Add current index into stack
        stack.append(i)

    # TODO: Traverse Right
    stack = [n]
    for i in reversed(range(n)):
        # TODO: Pop stack if len more than one and previous less than current
        while len(stack) > 1 and array[stack[-1]] < array[i]:
            stack.pop()
        res[i] += stack[-1] - i - 1
        stack.append(i)

    return res




if __name__ == "__main__":
    print(count_subarrays(arr))
