#!/usr/bin/python3

'''
    Problem: Find the two numbers that add up to the targetSum.
        [2,1,4,7,8], 11
'''

def twoNumberSum(arr, targetSum):
    lp = 0
    rp = len(arr) - 1
    count = 0
    arr.sort() # [1,2,4,7,8]


    # while lp < rp:
    #     currentSum = arr[lp] + arr[rp]
    #     print("Current Sum of: {}".format(currentSum))
    #     if currentSum < targetSum:
    #         lp += 1
    #     elif currentSum > targetSum:
    #         rp -= 1
    #     else:
    #         count += 1
    #         lp += 1
    #         rp -= 1
    # return count

if __name__ == "__main__":
    # print(twoNumberSum([2, 1, 4, 7, 8], 11))
    print(twoNumberSum([2, 1, 4, 7, 8], 11))
