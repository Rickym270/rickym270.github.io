#!/usr/bin/python3
# TIME: O(N^2) where n is length of input array
#           Althought sortin takes up nlogn time, it is smaller than N^2
#           so we ignore it
# SPACE: We do spend some space becayse we have to store the triplets
#           O(N) space

array = [12, 3, 1, 2, -6, 5, -8, 6]
targetSum = 0
def threeNumberSum(array, targetSum):
    array.sort()
    triplets = []

    #NOTE: Why -2?
    #       Because we want there to be space for three itemms always
    for i in range(len(array) - 2):
        lp = i + 1
        rp = len(array) - 1
        while lp < rp:
            currentSum = array[i] + array[lp] + array[rp]
            if currentSum == targetSum:
                triplets.append([array[i], array[lp], array[rp]])
                lp += 1
                rp -= 1
            elif currentSum > targetSum:
                rp -= 1
            elif currentSum < targetSum:
                lp += 1
        return triplets

if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))

