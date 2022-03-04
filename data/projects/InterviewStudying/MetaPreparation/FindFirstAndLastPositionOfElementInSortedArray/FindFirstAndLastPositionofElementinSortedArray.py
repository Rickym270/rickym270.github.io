#!/usr/bin/python3
# USE BinarySearch
problem_sets = [
    [[5, 7, 7, 8, 8, 10, 5], 8], #[3,4]
    [[5, 7, 7, 8, 8, 10, 5], 5] #[0, 6]
]

def get_first_and_last(nums, target):

    # TODO: Create return
    indeces = [-1, -1]
    indeces[0] = find_first(nums, target)
    indeces[1] = find_last(nums, target)

    print(indeces[1])
    return indeces

def find_first(nums, target):
    # TODO: Create a dummy var
    index = -1

    # TODO: Calculate lp and rp
    lp = 0
    rp = len(nums) - 1

    while lp <= rp:
        # TODO: Get mid
        mid = lp + (rp - lp) // 2

        if nums[mid] == target:
            # TODO: Update index
            index = mid
            rp = mid - 1
        elif nums[mid] < target:
            lp = mid + 1
        else:
            rp = mid - 1

    return index

def find_last(nums, target):
    # TODO: Create a dummy var
    index = -1

    # TODO: Calculate lp and rp
    lp = 0
    rp = len(nums) - 1

    while lp <= rp:
        # TODO: Get mid
        mid = lp + (rp - lp) // 2

        if nums[mid] == target:
            # TODO: Update index
            index = mid
            lp = mid + 1
        elif nums[mid] < target:
            rp = mid - 1
        else:
            lp = mid + 1

    return index

if __name__ == "__main__":
    for problem in problem_sets:
        print(problem)
        print(get_first_and_last(problem[0], problem[1]))

