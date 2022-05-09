#!/usr/bin/python3
# CASE N ~= MFindTheDuplicates_solution1.py
arr1 = [10, 20, 30, 60, 70, 100]
arr2 = [10, 20, 30, 40, 60, 80]

def findDuplicates(arr1, arr2):
    # NOTE: IF the sizes are similar, we can do it this way:
    #           Use pointers to traverse both arrays
    duplicates = []
    idxOne = 0
    idxTwo = 0

    while idxOne < len(arr1) and idxTwo < len(arr2):
        if arr1[idxOne] == arr2[idxTwo]:
            duplicates.append(arr1[idxOne])
            idxOne += 1
            idxTwo += 1
        elif arr1[idxOne] < arr2[idxTwo]:
            idxOne += 1
        else:
            idxTwo += 1

    return duplicates

if __name__ == "__main__":
    print(findDuplicates(arr1, arr2))
