'''
    Given a list of n integers arr[0..(n-1)], determine the number of different pairs of elements within it which sum to
     k.
    If an integer appears in the list multiple times, each copy is considered to be different; that is, two pairs are
    considered different if one pair includes at least one array index which the other doesn't, even if they include the
    same values.

    NOTE: New Positions matter.
            (1,2) != (2,1)

    Return number of pairs that sum to k
'''
# Returns 2
array1 = [1, 2, 3, 4, 3]
targetSum1 = 6

# Returns 4
array2 = [1, 5, 3, 3, 3]
# 1+5 seen: TWO new numbers (1, 5)
# 1+3 seen: ONE new number (3), ONE old number
# 1+3 seen: ZERO new number, TWO old numbers
# 1+3 seen: ZERO new number, TWO old numbers
# 5+3 seen: ONE new number, ONE old number
# 5+3 seen: ZERO new number, TWO old numbers
# 5+3 seen: ZERO new number, TWO old numbers
# 3+3 seen: ZERO new number, TWO old numbers
# 3+3 seen: ZERO new number, TWO old numbers
# 3+3 seen: ZERO new number, TWO old numbers
# New Numbers: (1+5) and 5+3
targetSum2 = 6

# Return 6
array3 = [2, 2, 2, 2]
# 2+2 (1st, 2nd) seen: TWO new 2's, subtract one because we only want to count the 2 one time.
# 2+2 (1st, 3rd) seen: ONE new 2, ONE old 2. We only care about the new one so subtract one
# 2+2 (1st, 4th) seen: ONE new 2, ONE old 2. We only care about the new one so subtract one

# 2+2 (2nd, 3rd) seen: ONE new 3, ONE old 2 (we saw this in the previous iteration (^). We only care about the new one
#               q       so subtract one.
# 2+2 (2nd, 4th) seen: ONE new 2, ONE old 2. We only care about the new one so subtract one

# 2+2 (3rd, 4th) seen: ZERO new 2, TWO old 2's. We don't count it.
targetSum3 = 4

def numberOfWays(arr, k):
    # TODO: Init vars
    seen = {}
    count = 0
    # TODO: Populate frequency map
    for i in range(len(arr)):
        if arr[i] not in seen:
            seen[arr[i]] = 0
        seen[arr[i]] += 1

    # TODO: Iterate through array
    for i in range(len(arr)):
        # TODO: Calculate the number that is needed
        needed_number = k - arr[i]
        # TODO: If not in seen, continue
        if needed_number not in seen:
            continue
        # TODO: Add number of occurance to count
        count += seen[needed_number]

        # TODO: If the needed_number == current_number then there is no point of counting it twice
        if needed_number == arr[i]:
            count -= 1

    # TODO: Return count // 2
    return count // 2

if __name__ == "__main__":
    # print(numberOfWays(array1, targetSum1))
    print(numberOfWays(array2, targetSum2))
    #print(numberOfWays(array3, targetSum3))
