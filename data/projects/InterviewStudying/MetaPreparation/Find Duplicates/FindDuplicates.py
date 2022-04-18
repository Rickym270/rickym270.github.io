#!/usr/bin/python3
problems = [
    [[1, 2, 3, 1, 3, 5], [1, 2, 3, 1, 3, 5]],
    [[1, 1, 1, 1], [1, 7, 8, 9]]
]
def find_duplicates(arr1, arr2):
    duplicates = []

    for number in arr1:
        if binarySearch(arr2, number) != -1:
            duplicates.append(number)

    return duplicates

def binarySearch(arr, num):
    begin = 0
    end = len(arr) - 1

    while begin <= end:
        mid = begin + (end - begin) // 2
        if arr[mid] < num:
            begin = mid + 1
        elif num == arr[mid]:
            begin = mid + 1
            return mid
        else:
            end = mid - 1

    return -1

if __name__ == "__main__":
    for problem_num, problem in enumerate(problems):
        print("{}: {}".format(problem_num, problem))
        print(find_duplicates(problem[0], problem[1]))
        print("\n\n")

