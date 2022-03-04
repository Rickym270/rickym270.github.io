#!/usr/bin/python3
'''
    You are given an unordered array consisting of consecutive integers  [1, 2, 3, ..., n] without any duplicates.
    You are allowed to swap any two elements. Find the minimum number of swaps required to sort the array in ascending
    order.
'''
problems = [
    # TODO: Add correct/expected answer
    [[2, 3, 4, 1, 5],
    [1, 3, 5, 2, 4, 6, 7]]
]

def minimum_swap2(arr):
    # TODO: Create list to save position(index) of values (at list pos 2, 0 is saved. At list pos 3, 1 is saved.
    #       At list pos 4, 2 is saved.
    temp = [0] * (len(arr) + 1)
    for pos, val in enumerate(arr):
        # TODO: Save position of value at temp[value]
        temp[val] = pos
        pos += 1
    # temp = [0, 3, 0, 1, 2, 4]
    #           temp[2] = 0      2 found at pos 0. Save 0 to temp[2]
    #           temp[3] = 1      3 found at pos 1. Save 1 to temp[3]
    #           temp[4] = 2      4 found at pos 2. Save 2 to temp[4]
    #           temp[1] = 3      1 found at pos 3. Save 3 to temp[1]
    #           temp[5] = 4      5 found at pos 4. Save 4 to temp[5]
    swaps = 0
    print("TEMP: {}".format(temp))
    for i in range(len(arr)):           #                                                       i: 0
        # Current value is not present
        if arr[i] != i + 1:
            swaps += 1                  # Increase # of swaps
            t = arr[i]                  # Save current val to 't'                               t: 2
            arr[i] = i + 1              # Save expected number into main array.
                                        #   REMEMBER, previous value has already been saved in t
            arr[temp[i + 1]] = t        # Since we completely ignore temp[0], add 1 to i so that we could get a 1 based
                                        #   index
            print()
            temp[t] = temp[i + 1]
    return swaps
    # for i in range(len(arr)):
    #     expected = i + 1
    #     idxTwo = i + 1
    #     if arr[i] != expected:
    #         while expected != arr[idxTwo] and idxTwo < len(arr)-1:
    #             print("Expected {} but got {}".format(expected, arr[i]))
    #             print("Adding 1 to idxTwo({})\n\n".format(expected, idxTwo))
    #             idxTwo += 1
    #
    #         swaps += 1
    #         arr[i], arr[idxTwo] = arr[idxTwo], arr[i]
    # print("Total Swaps: {}".format(swaps))
    # return swaps

if __name__ == "__main__":
    for set_num, problem_set in enumerate(problems):
        for num, problem in enumerate(problem_set):
            print("Testcase {}-{}: {}".format(set_num, num, problem))
            answer = minimum_swap2(problem)
            print("Returned:")
            print(answer)
            print("\n---\n")
