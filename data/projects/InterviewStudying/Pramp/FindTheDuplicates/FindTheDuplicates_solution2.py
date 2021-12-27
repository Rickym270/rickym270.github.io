#!/usr/bin/python3
arr1 = [10,20,30,40,50,60,70]
arr2 = [10,20,30,40,50,60,70]

def findDuplicates(arr1, arr2):
    duplicates = []

    for num in arr1:
        if binarySearch(arr2, num) != 1:
            duplicates.append(num)

    return duplicates

def binarySearch(arr, num):
    start = 0
    end = len(arr) - 1
    while start <= end:
        mid = start + (end-start)//2
        if arr[mid] < num:
            start = mid + 1
        elif arr[mid] > num:
            end = mid - 1
        else:
            return mid
    return -1

if __name__ == "__main__":
    print(findDuplicates(arr1, arr2))
