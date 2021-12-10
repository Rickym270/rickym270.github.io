#!/usr/bin/python3

array = [-2, -1, 0, 5, 19]
sequence = [-2, 0, 19]

def isValidSubsequence(array, sequence):
    arrIdx = 0
    seqIdx = 0

    while arrIdx < len(array) and seqIdx < len(sequence):
        if array[arrIdx] == sequence[seqIdx]:
            seqIdx += 1
        arrIdx += 1

    return seqIdx == len(sequence)

if __name__ == "__main__":
    print(isValidSubsequence(array, sequence))

