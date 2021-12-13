#!/usr/bin/python3

'''
        [2,1,4,7,8], 11
'''

def twoNumberSum(arr, targetSum):
    arr_idx = 0
    while arr_idx < len(arr):
        needed_number = targetSum - arr[arr_idx]
        if needed_number in arr:
            return [arr[arr_idx], needed_number]
        arr_idx += 1
    return []

if __name__ == "__main__":
    print(twoNumberSum([2, 1, 4, 7, 8], 11))
