#!/usr/bin/python3
'''
    Write a function that takes a non-empty array of integers that are assorted in ascending order and
    returns a new array of the same length with the original integers, squared also sorted in ascending order.
'''
def SortedSquaredArray(array):
    #Initialize empty array
    sorted_square_array = [0 for _ in array]
    lp = 0
    rp = len(array) - 1

    for idx in reversed(range(len(array))):
        if abs(array[lp]) > abs(array[rp]):
            sorted_square_array[idx] = array[lp] ** 2
            lp += 1
        else:
            sorted_square_array[idx] = array[rp] ** 2
            rp -= 1

    return sorted_square_array

if __name__ == "__main__":
    print(SortedSquaredArray([-5,-1,0,10,40]))

'''
    Explanation:
        Line 6: Function definition
        Line 8: Initialize an array with '0's so that we can allocate the necessary space
        Line 9: Initialize a pointer to the left most(beginning) of the array
        Line 10: Initialize a pointer to the right most (end) of the array
        Line 12: Since the numbers in the new array are to be listed in ascending order (least to greatest), 
                 traverse through the array in descending order. 
        Line 13: A negative number square will yield a positive number. A positive number squared will yield a 
                 positive number, therefore we should be able to take the absolute value of the number and 
                 be able to compare which number will be saved at the "greatest" (last) position of the array.
        Line 14: If the absolute value of the number referenced by the left pointer is greater than the number
                 referenced by the right pointer, square the left number and save it into the new array.
                    NOTE: Even though the left pointer references small numbers, -3^2 will be greater than 1^2
        Line 15: Since we already squared the number referenced by the left pointer, move onto the next number.
                    i.e. Increment left pointer by one
        Line 16-17: Do the same steps as line 13-15 but for the right pointer (greatest)
        Line 18: Since we're done with the number referenced by the right pointer, decrement the right pointer by
                 1
'''
