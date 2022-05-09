array = [12, 3, 1, 2, -6, 5, -8, 6]
targetSum = 0

def threeNumberSum(array, target_sum):
    array.sort()
    triplets = []
    for i in range(len(array)):
        lp = i + 1
        rp = len(array) - 1
        while lp < rp:
            current_sum = array[i] + array[lp] + array[rp]
            if current_sum == target_sum:
                return [array[i], array[lp], array[rp]]
            elif current_sum > targetSum:
                rp -= 1
            else:
                lp += 1
    return []


if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))
