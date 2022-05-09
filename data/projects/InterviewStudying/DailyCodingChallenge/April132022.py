#!/usr/bin/python3
'''
    Given a list of numbers and a number k,
    return whether any two numbers from the list add up to k.

    For example, given [10, 15, 3, 7] and k of 17, return true
    since 10 + 7 is 17.

    Bonus: Can you do this in one pass?
'''
arr = [-5, -3, -1, 1, 2]
k = 0

def twoNumberSum(arr, k):
    # TODO: Create two pointers
    left = 0
    right = len(arr) - 1

    # TODO: Iterate while in bounds
    while left < right:
        current_sum = arr[left] + arr[right]
        if current_sum == k:
            return True
        elif current_sum < k:
            left += 1
        else:
            right -= 1
    return False

if __name__ == "__main__":
    print(twoNumberSum(arr, k))