#!/usr/bin/python3
'''
    Problem: Given two non-empty array integers, write a function that determines whether 
                the second array is a subsequence of the first array
'''
main_arr = [1, 2, 3, 4, 5, 6, 7, 8, 9]
sub_arr = [1, 5, 7, 9]

def isValidSubsequence(arr, sub):
    arr_idx = 0
    sub_idx = 0

    while arr_idx < len(arr) and sub_idx < len(sub):
        if arr[arr_idx] == sub[sub_idx]:
            sub_idx += 1
        arr_idx += 1
    
    return sub_idx == len(sub)

if __name__ == "__main__":
    print(isValidSubsequence(main_arr, sub_arr))
