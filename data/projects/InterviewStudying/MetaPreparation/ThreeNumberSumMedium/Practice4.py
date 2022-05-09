#!/usr/bin/python3

def threeNumberSum(array, targetSum):
    array.sort()
    triplets = []
    for i in range(len(array) - 2):
        lp = i + 1
        rp = len(array) - 1
        while lp < rp:
            currentSum = array[i] + array[lp] + array[rp]
            if currentSum == targetSum:
                triplets.append([array[i], array[lp], array[rp]])
                lp += 1
                rp -= 1
            elif currentSum < targetSum:
                lp += 1
            elif currentSum > targetSum:
                rp -= 1
    return triplets
            


if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))
