#!/usr/bin/python3
'''
    Author: Ricky Martinez
    Problem: Validate Subsequence
                Given two non-empty arrays, write a function that determines if the second
                array is a subsequence of the first one
    Description:
        Subsequence: 
            An array that contains the same integers (in the same order) as a 
            larger array
            Example: 
                larger_array = [1, 2, 3, 4, 5]
                subsequence = [1, 4, 5]
                - This is a valid subsequence because the numbers appear in the larger array
                   and in the same order
                larger_array = [1, 2, 3, 4, 5]
                subsequence = [1, 4, 3, 5]
                - This is NOT a valid subsequence because although the numbers are also
                    present in the larger array, they are not in the correct order

'''
def isValidSubsequence(array, subsequence):
    arr_idx = 0
    sub_idx = 0

    while arr_idx < len(array) and sub_idx < len(subsequence);
        if array[arr_idx] == subsequence[sub_idx]:
            sub_idx += 1
        arr_idx += 1

    return sub_idx == len(subsequence)

'''
    Explanation:
        Line 22: Function definition
        Line 23 - 24: Define pointers for the current array index and subsequence index
        Line 26: Continue while the array index and subsequence index, dont exceed the size
                    of the structure they reference
        Line 27 - 28: If the current item in the array matches with the current item in the
                        subsequence, go to the next item of the subsequence
        Line 29: Move onto the next item in the array
        Line 31: Return True is the subsequence index == the length of the subsequence.
                    Why?
                        This makes sense because if the subsequence index is the lenght of 
                        the length of the subsequence, that means that the subsequence item
                        was found in the array so we move onto the next item of the 
                        subsequence. If there are no more items, that means that the
                        subsequence array was entirely traversed.
'''

