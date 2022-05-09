#!/usr/bin/pytho''''
# '''
# ''''
# NOTE: arr<class 'list'>, k <class 'int'>
def getTotalTime(arr):
    # TODO: Return highest possible penalty for a given output
    # [4, 2, 1, 3]
    # TODO: Take adventage of soritng properties
    arr = sorted(arr, reverse=True)
    # [4, 3, 2, 1] => [4, 7, 2, 1] => [4, 7, 9, 1] => [4, 7, 9, 10]
    # TODO: Reference the size of the array with a variable
    n = len(arr)
    # TODO: Account for base case
    if n == 1:
        return arr[0]

    # TODO: Iterate from n
    for i in range(n):
        # TODO: Check if i < n - 1
        if i < n-1:
            arr[i+1] = arr[i] + arr[i+1]

    return sum(arr[1:])
