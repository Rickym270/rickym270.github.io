array = [12, 3, 1, 2, -6, 5, -8, 6]
targetSum = 0

# def sort_array(arr):
#     minimum = float("inf")
#     res = []
#     for i in range(len(arr)):
#         if arr[i] < minimum:
#             minimum = arr[i]
#     res.append(minimum)
#     return arr

def threeNumberSum(array, targetSum):
    # TODO: Return triplets
    triplets = []
    # TODO: Sort array
    array.sort()

    for i in range(len(array)):
        lp = i + 1
        rp = len(array) - 1
        while lp < rp:
            current_sum = array[i] + array[lp] + array[rp]
            if current_sum == targetSum:
                triplets.append([array[i], array[lp], array[rp]])
                lp += 1
                rp -= 1
            elif current_sum < targetSum:
                lp += 1
            else:
                rp -= 1
    return triplets


if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))
