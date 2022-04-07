#!/usr/bin/python3

# TODO: Get current sum of the day
def sum_day(rates, day):
    running_sum = 0
    for rate in rates:
        running_sum += (rate ** day)
    return running_sum

# TODO: Perform a binary search
def search(arr, low, high):
    # TODO: Calculate mid
    mid = low + (high - low) // 2
    # TODO: Iterate while low < high
    while low < high:
        # TODO: Check if current sum_day is less than 1B
        if sum_day(arr, mid) < 1000000000:
            low = mid + 1
        else:
            high = mid
    return high

# TODO: Main function to find day of 1B users
def get_billion_users_day(growth_rates):
    # TODO: Keep track of days
    days = 1
    # TODO: Get current sum_day
    users = sum_day(growth_rates, days)

    # TODO: Check if limit is reached on day 1
    if users >= 1000000000:
        return 1

    # TODO: Not 1B so while less than 1B
    while users < 1000000000:
        # TODO: Multiply days by 2
        days *= 2
        # TODO: Get users after day increment
        users = sum_day(growth_rates, days)
    # TODO: Get exact limit
    return search(growth_rates, days // 2, days)

