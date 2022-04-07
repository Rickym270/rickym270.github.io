#!/usr/bin/python3
revenues = [100, 200, 300, 400, 500]
milestones = [300, 800, 1000, 1400]

def revenue_milestones(revenues, milestones):
    # TODO: Use prefix sum
    prefix_sum = [0]

    # TODO: Add all the revenues to the prefix sum
    for revenue in revenues:
        prefix_sum.append(prefix_sum[-1] + revenue)

    # TODO: Define a search function to binary search for a milestone
    def search(target):
        # TODO: Define left + right
        left = 0
        right = len(prefix_sum)
        # TODO: Iterate while left < right
        while left < right:
            # TODO: Get mid
            mid = (left + right) // 2

            # TODO: Find prefix sum
            if prefix_sum[mid] < target:
                left = mid + 1
            else:
                right = mid

        # TODO: Return left if within bounds
        return left if left < len(prefix_sum) else -1

    res = []
    # TODO: Search through milestones if found in prefix_sum
    for milestone in milestones:
        res.append(search(milestone))
    return res

if __name__ == "__main__":
    print(revenue_milestones(revenues, milestones))
