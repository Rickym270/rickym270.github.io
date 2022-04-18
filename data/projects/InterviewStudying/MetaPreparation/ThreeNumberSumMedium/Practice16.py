array = [12, 3, 1, 2, -6, 5, -8, 6]
targetSum = 0

def threeNumberSum(array, targetSum):
    triplets = []
    array.sort()
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
            else:
                rp -= 1
    return triplets

if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))