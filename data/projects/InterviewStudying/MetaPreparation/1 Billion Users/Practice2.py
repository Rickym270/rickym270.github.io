#!/usr/bin/python3

# TODO: Define function to calculate how many users
def sum_day(growth_rates, day):
    # TODO: Define running sum
    running_sum = 0
    for rate in growth_rates:
        running_sum += (rate ** day)
    return running_sum

# TODO: Define function to use binary search for date users reach 1B
def search(arr, low, high):
    # TODO: Calculate the mid point
    mid = low + (high - low) // 2
    # TODO: Perform search which low < high
    while low < high:
        # TODO: See if current sum is less than 1B
        if sum_day(arr, mid) < 1000000000:
            low = mid + 1
        else:
            high = mid
    return high

# TODO: Driver function
def get_billion_users_day(growth_rates):
    # TODO: Keep track of days
    days = 1
    # TODO: Get current users for today
    users = sum_day(growth_rates, days)
    # TODO: Check case where initially we already have 1B users
    if users >= 1000000000:
        return 1
    # TODO: While users < 1B to find upper limit
    while users < 1000000000:
        # TODO: Increment days by a multiple of 2
        days *= 2
        # TODO: Get current users given the new days
        users = sum_day(growth_rates, days)
    return search(growth_rates, days // 2, days)