#!/usr/bin/python3
# NOTE: CASE M > N
'''
def find_duplicates(arr1, arr2):
  idxOne = 0
  idxTwo = 0
  duplicates = []
  
  while idxOne < len(arr1) and idxTwo < (len(arr2)):
    if arr1[idxOne] == arr2[idxTwo]:
      duplicates.append(arr1[idxOne])
      idxOne += 1
      idxTwo += 1
    elif arr1[idxOne] < arr2[idxTwo]:
      idxOne += 1
    else:
      idxTwo += 1

  return duplicates
'''
arr1 = [10, 20, 30, 60, 70, 100]
arr2 = [10, 40, 60, 80]

def find_duplicates(arr1, arr2):
    duplicates = []

    # TODO: Traverse array and see if smaller found in bigger array
    for number in arr2:
        if BST(arr1, number) != -1:
            duplicates.append(number)
    return duplicates

def BST(arr, number):
    start = 0
    end = len(arr) - 1

    while start <= end:
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
