#!/usr/bin/python3
revenues = [100, 200, 300, 400, 500]
milestones = [300, 800, 1000, 1400]

def revenue_milestones(revenues, milestones):
    # TODO: Use a prefix sum
    prefix_sum = [0]

    # TODO: Add all the revenues to the prefix sums
    for revenue in revenues:
        prefix_sum.append(prefix_sum[-1] + revenue)

    # TODO: Binary search function to find target in prefix sums
    def search(target):
        left = 0
        right = len(prefix_sum)
        # TODO: While left < right
        while left < right:
            # TODO: Calculate a mid point
            mid = (left + right) // 2

            # TODO: Edit the bounds
            if prefix_sum[mid] < target:
                left = mid + 1
            else:
                right = mid

        # TODO: Return left if left is not in the scope
        return left if left < len(prefix_sum) else -1

    res = []
    # TODO: Iterate through milestones and search for them
    for milestone in milestones:
        res.append(search(milestone))

    return res

if __name__ == "__main__":
    print(revenue_milestones(revenues, milestones))