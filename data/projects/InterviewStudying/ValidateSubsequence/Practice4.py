#!/usr/bin/python3

def isValidSubsequence(arr, sequence):
    arr_idx = 0
    seq_idx = 0
    while arr_idx < len(arr) and seq_idx < len(sequence):
        if arr[arr_idx] == sequence[seq_idx]:
            seq_idx += 1
        arr_idx += 1

    return seq_idx == len(sequence)

if __name__ == "__main__":
    print(isValidSubsequence([1,2,3,4,5,6], [1,3,6]))
    print(isValidSubsequence([1,2,3,4,5,6], [1,3,7]))
