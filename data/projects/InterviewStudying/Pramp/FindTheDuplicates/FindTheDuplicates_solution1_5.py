#!/usr/bin/python3
# CASE N ~= M
'''
    Given a list of ages from two different groups, find the age that
    is common between group 1 and group 2. SORTED
'''
arr1 = [10, 20, 30, 60, 70, 100]
arr2 = [10, 20, 30, 40, 60, 80]

# 10, 20, 30, 50
def findDuplicates(arr1, arr2):
    # TODO: Return duplicates, so init list
    duplicates = []
    # TODO: Since theyre both almost the same size, do this the pointer way
    idxOne = 0
    idxTwo = 0

    # TODO: Traverse through list while idxs are less than
    while idxOne < len(arr1) and idxTwo < len(arr2):
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
