#!/usr/bin/python3

'''
    Author: Ricky Martinez
    Description: Walkthrough for the Two Number Sum problem.
                 Problem:
                    Given an array and targetSum, write a function that returns a pair in
                    in the array that is equal to the target sum
'''

integer_array = [3, 5, -4, 8, 11, 1, -1, 6]
targetSum = 10

left_pointer = 0
right_pointer = 0
array.sort()

def twoNumberSum(array, targetSum):
    while left_pointer < right_pointer:
        currentSum = array[left_pointer] + array[right_pointer]
        if currentSum == targetSum:
            return [array[left_pointer], array[right_pointer]]
        elif currentSum < targetSum:
            left_pointer += 1
        elif currentSum > targetSum:
            right_pointer -= 1
    return []

if __name__ == "__main__":
    twoNumberSum(integer_array, targetSum)

'''
Explanation:
    We will use pointers to find the two numbers that add up to the sum
    Line 14 - 15: Initialize pointers
    Line 16: Sort the array for lines 21 - 26 (min to max)
    Line 18: Function definition
    Line 19: While the left_pointer(lp) doesn't exceed the right_pointer(rp), continue loop
    Line 20: Create a variable to store the current sum of the values at left_pointer and 
                right_pointer
    Line 21: If the currentSum is equal to targetSum, you've found the two numbers. Return
    Line 23: If the currentSum is less than the targetSum, increase the lp. 
                Why?
                    Since the array is in order, increasing the lp will also increase the
                    currentSum, which is what we want
    Line 25: If the currentSum is greater than the targetSum, decrease the rp.
                Why?
                    Since the array is in order, decreasing the rp will also decrease the
                    currentSum.
    Line 27: If no match is found, return an empty array
'''

