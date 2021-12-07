#!/usr/bin/python3
array = [5, 1, 22, 25, 6, -1, 8, 10]
sequence = [1, 6, -1, 10]
#sequence = [1, 6, -1, 5]

def validateSubsequence(array, sequence):
    seqIdx = 0
    arrIdx = 0

    while arrIdx < len(array) and seqIdx < len(sequence):
        if array[arrIdx] == sequence[seqIdx]:
            seqIdx += 1
        arrIdx +=1

    return seqIdx == len(sequence)

if __name__ == "__main__":
    print(validateSubsequence(array, sequence))
