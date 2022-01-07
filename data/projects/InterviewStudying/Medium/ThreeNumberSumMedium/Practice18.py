array = [12, 3, 1, 2, -6, 5, -8, 6]
targetSum = 0

def threeNumberSum(array, target_sum):
    array.sort()
    triplets = []
    for i in range(len(array)):
        lp = i+1
        rp = len(array) - 1
        while lp < rp:
            currentSum = array[i] + array[lp] + array[rp]
            if currentSum == target_sum:
                triplets.append([array[i], array[lp], array[rp]])
                lp += 1
                rp -= 1
            elif currentSum > target_sum:
                rp -= 1
            else:
                lp += 1
    return triplets

if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))
