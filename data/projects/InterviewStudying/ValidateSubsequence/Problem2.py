#!/usr/bin/python3

array = [2, 4, 6, 8, 10, 12, 14]
subsequence = [8, 10, 14]


def isValidSubsequence(arr, sub):
    arr_idx = 0
    sub_idx = 0

    while arr_idx < len(arr) and sub_idx < len(sub):
        if arr[arr_idx] == sub[sub_idx]:
            sub_idx += 1
        arr_idx += 1
    
    return sub_idx == len(sub)

if __name__ == "__main__":
    print(isValidSubsequence(array, subsequence))

