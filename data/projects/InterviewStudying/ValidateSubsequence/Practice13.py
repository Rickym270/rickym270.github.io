#!/usr/bin/python3

array = [-4, -2, 0, 1, 2, 3]
sequence = [-4, 0, 2, 3]


def isValidSequence(array, sequence):
    arrIdx = 0
    seqIdx = 0
    while arrIdx < len(array) and seqIdx < len(sequence):
        if array[arrIdx] == sequence[seqIdx]:
            seqIdx += 1
        arrIdx += 1
    return seqIdx == len(sequence)

if __name__ == "__main__":
    print(isValidSequence(array, sequence))

