#!/usr/bin/python3

def validateSubsequence(array, sequence):
    arrIdx = 0
    seqIdx = 0
    while arrIdx < len(array) and seqIdx < len(sequence):
        if array[arrIdx] == sequence[seqIdx]:
            seqIdx += 1
        arrIdx += 1
    return seqIdx == len(sequence)

if __name__ == "__main__":
    print(validateSubsequence([5, 1, 22, 25, 6, -1, 8, 10], [1, 6, -1, 10]))
