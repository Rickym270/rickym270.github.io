#!/usr/bin/python3
'''
Given an array of integers, return a new array such that each
    element at index i of the new array is the product of all the
    numbers in the original array except the one at i.
For example, if our input was [1, 2, 3, 4, 5], the expected output
    would be [120, 60, 40, 30, 24]. If our input was [3, 2, 1], the
    expected output would be [2, 3, 6].
Follow-up: what if you can't use division?
'''
#arr = [3, 2, 1] # [2, 3, 6]
arr = [1, 2, 3, 4, 5] # [120, 60, 40, 30, 24]

def array_of_products(arr):
    # TODO: Define returned array
    length = len(arr)
    res = [1 for _ in arr]

    temp = 1
    # TODO: Iterate through array left -> right
    for i in range(length):
        res[i] = temp
        temp *= arr[i]

    temp = 1
    # TODO: Iterate in reverse (right -> left)
    for i in range(length - 1, -1, -1):
        res[i] *= temp
        temp *= arr[i]

    return res

if __name__ == "__main__":
    print(array_of_products(arr))