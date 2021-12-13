#!/usr/bin/python4

def isValidSubsequence(arr, sequence):
    arr_idx = 0
    sequence_idx = 0

    while arr_idx < len(arr) and sequence_idx < len(sequence):
        if arr[arr_idx] == sequence[sequence_idx]:
            sequence_idx += 1
        arr_idx += 1

    return sequence_idx == len(sequence)

if __name__ == "__main__":
    print(isValidSubsequence([1,2,3,4,5,6,7,8,9], [1,4,6,7,9]))
    print(isValidSubsequence([1,2,3,4,5,6,7,8,9], [1,8,4,6,7,9]))
