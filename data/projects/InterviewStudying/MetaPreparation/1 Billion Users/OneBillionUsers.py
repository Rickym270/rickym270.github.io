#!/usr/bin/python3

# TODO: Get current sum
def sum_day(growth_rates, day):
    running_sum = 0
    for rate in growth_rates:
        running_sum += (rate ** day)
    return running_sum

# TODO: Perform binary search
def search(arr, low, high):
    # TODO: Get the mid point
    mid = low + (high - low) // 2
    # TODO: Iterate while low < high:
    while low < high:
        if sum_day(arr, mid) < 1000000000:
            low = mid + 1
        else:
            high = mid
    return high

def get_billion_users_day(growth_rates):
    # TODO: Init counter to keep track of days
    days = 1
    # TODO: Get number of users for a given date
    users = sum_day(growth_rates, days)
    # TODO: If users exceeds a bill on first date, return 1
    if users >= 1000000000:
        return 1

    # TODO: Find the upper boundary
    while users < 1000000000:
        # TODO: Increment the day by multiple of 2
        days *= 2
        # TODO: Get the sum of the day num
        users = sum_day(growth_rates, days)

    # TODO: Find the exact boundary
    return search(growth_rates, days // 2, days)
