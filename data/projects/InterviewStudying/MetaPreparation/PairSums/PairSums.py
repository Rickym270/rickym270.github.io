'''
    Given a list of n integers arr[0..(n-1)], determine the number of different pairs of elements within it which sum to
     k.
    If an integer appears in the list multiple times, each copy is considered to be different; that is, two pairs are
    considered different if one pair includes at least one array index which the other doesn't, even if they include the
    same values.
'''
array1 = [1, 2, 3, 4, 3]
targetSum1 = 6

array2 = [1, 5, 3, 3, 3]
targetSum2 = 6
# 1st 2nd
# 3rd 4th
# 3rd 5th


# 2+2 (1st, 2nd)
# 2+2 (1st, 3rd)
# 2+2 (1st, 4th)

# 2+2 (2nd, 3rd)
# 2+2 (2nd, 4th)

# 2+2 (3rd, 4th)
array3 = [2, 2, 2, 2]
targetSum3 = 4

def numberOfWays(arr, k):
    seen = {}
    count = 0

    # TODO: Create a frequency map
    for i in range(len(arr)):
        if arr[i] not in seen:
            seen[arr[i]] = 0
        seen[arr[i]] += 1
    print(seen)

    # TODO: Iterate through array
    for i in range(len(arr)):
        # TODO: Find number that is needed to reach k
        needed_number = k - arr[i]

        # TODO: Not found, continue
        if needed_number not in seen:
            print("Not found")
            continue

        # TODO: Add number of times seen to the count
        count += seen[needed_number]
        if needed_number == arr[i]:
            count -= 1

    return count // 2

if __name__ == "__main__":
    # print(numberOfWays(array1, targetSum1))
    # print(numberOfWays(array2, targetSum2))
    print(numberOfWays(array3, targetSum3))