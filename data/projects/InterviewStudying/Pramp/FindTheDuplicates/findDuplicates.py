#!/usr/bin/python
arr1 = [1, 2, 3, 5, 6, 7]
arr2 = [3, 6, 7, 8, 20]

def findDuplicates(array1, array2):
    res = []
    seen = {}
    big_arr = array1 if array1 > array2 else array2
    small_arr = array2 if array2 > array1 else array1

    # TODO: Populate seen map from the biggest element in array
    for val in small_arr:
        if val not in big_arr:
            res




if __name__ == "__main__":
    print(findDuplicates(arr1, arr2))