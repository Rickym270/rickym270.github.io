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
    for i in range(len(array) - 2):
        # TODO: Create lp and rp
        lp = i + 1
        rp = len(array) - 1

        # TODO: While lp < rp
        while lp < rp:
            current_sum = array[lp] + array[i] + array[rp]
            if current_sum == targetSum:
                triplets.append([array[lp], array[i], array[rp]])
                lp += 1
                rp -= 1
            elif current_sum < targetSum:
                lp += 1
            else:
                rp -= 1
    return triplets

    return triplets

if __name__ == "__main__":
    print(threeNumberSum(array, targetSum))
