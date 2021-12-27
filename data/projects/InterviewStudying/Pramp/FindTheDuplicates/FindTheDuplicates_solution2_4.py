#!/usr/bin/python3

arr1 = [10, 20, 30, 60, 70, 100]
arr2 = [10, 20, 30, 40, 60, 80]

def findDuplicates(arr1, arr2):
    duplicates = []
    for number in arr1:
        if binarySearch(arr2, number) != -1:
            duplicates.append(number)
    return duplicates

def binarySearch(arr, number):
    begin = 0
    end = len(arr) - 1

    while begin <= end:
        mid = begin + (end-begin)//2

        if arr[mid] == number:
            return number
        elif arr[mid] < number:
            begin = mid + 1
        else:
            end = mid - 1
    return -1

if __name__ == "__main__":
    print(findDuplicates(arr1, arr2))
