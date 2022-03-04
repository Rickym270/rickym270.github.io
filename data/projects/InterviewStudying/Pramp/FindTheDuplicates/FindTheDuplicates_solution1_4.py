#!/usr/bin/python3
# CASE N ~= M
arr1 = [10, 20, 30, 60, 70, 100]
arr2 = [10, 20, 30, 40, 60, 80]

def findDuplicates(arr1, arr2):
    duplicates = []
    idxOne = 0
    idxTwo = 0

    # TODO: ITerate through array while idxOne < len array and idxTwo < len array
    while idxOne < len(arr1) and idxTwo < len(arr2):
        # TODO: Compare the values
        if arr1[idxOne] < arr2[idxTwo]:
            idxOne += 1
        elif arr1[idxOne] > arr2[idxTwo]:
            idxTwo += 1
        else:
            duplicates.append(arr1[idxOne])
            idxOne += 1
            idxTwo += 1
    return duplicates

if __name__ == "__main__":
    print(findDuplicates(arr1, arr2))
