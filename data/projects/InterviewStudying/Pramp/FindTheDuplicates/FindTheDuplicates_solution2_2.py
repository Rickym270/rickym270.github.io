#!/usr/bin/python3

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
    mid = begin + (end-begin) // 2
    if arr[mid] < num:
      begin = mid + 1
    elif num == arr[mid]:
      return mid
    else:
      end = mid - 1
      
  return -1

