#!/usr/bin/python3

def validateSequence(arr, sub):
    arr_idx = 0
    sub_idx = 0

    while arr_idx < len(arr) and sub_idx < len(sub):
        if arr[arr_idx] == sub[sub_idx]:
            sub_idx += 1
        arr_idx += 1

    return sub_idx == len(sub)

if "__main__" == __name__:
    print(validateSequence([1,2,3,4,5,6], [1,4,5,6]))

