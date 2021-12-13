#!/usr/bin/python3

array = [1, 3, 5, 7, 9]
sequence = [1, 5, 9]

def validateSequence(array, sequence):
    arrIdx = 0
    seqIdx = 0

    while arrIdx < len(array) and seqIdx < len(sequence):
        if sequence[seqIdx] == array[arrIdx]:
            seqIdx += 1
        arrIdx += 1
    return seqIdx == len(sequence)

if __name__ == "__main__":
    print(validateSequence(array, sequence))

