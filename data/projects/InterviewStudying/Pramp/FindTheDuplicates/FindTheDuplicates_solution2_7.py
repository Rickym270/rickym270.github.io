#!/usr/bin/python3
# NOTE: CASE M > N

arr1 = [10, 20, 30, 60, 70, 100, 101, 102, 103, 104, 105]
arr2 = [10, 40, 60, 80]

# 10, 60
def find_duplicates(arr1, arr2):
    # TODO: We want to return a list of duplicates so iniit duplicates
    duplicates = []

    # TODO: Find smaller array numbers in bigger array
    #   TODO: BST
    for number in arr2:
        if BinarySearch(arr1, number) != -1:
            duplicates.append(number)
    return duplicates

def BinarySearch(arr, number):
    # TODO: Define a start and an end
    start = 0
    end = len(arr) - 1

    # TODO: Iterate while start is less than or equal to end
    while start <= end:
        # TODO: Calculate the mid point
        mid = start + (end - start) // 2

        if arr[mid] < number:
            start = mid + 1
        elif arr[mid] > number:
            end = mid - 1
        else:
            return mid
    return -1

if __name__ == "__main__":
    print(find_duplicates(arr1, arr2))
