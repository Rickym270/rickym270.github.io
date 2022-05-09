#!/usr/bin/python3
array = [12, 3, 1, 2, -6, 5, -8, 6]
targetSum = 0
'''
    Time: O(n^2) because we have a foor loop. Even though sort is used,
            it runs at O(nlogn) time which we can ignore because a for 
            loop runs at o(n^2) time.
    Space: O(n) because we create a list of n elements
'''
def threeNumberSum(array, targetSum):
    array.sort()
    triplets = []
    for i in range(len(array)):
        lp = i + 1
        rp = len(array) - 1
        while lp < rp:
            currentSum = array[i] + array[lp] + array[rp]
            if currentSum < targetSum:
                lp += 1
            elif currentSum > targetSum:
                rp -= 1
            else:
                triplets.append([array[i], array[lp], array[rp]])
                rp -= 1
                lp += 1
    return triplets
        

if __name__=="__main__":
    print(threeNumberSum(array, targetSum))
