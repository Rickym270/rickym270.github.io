#!/usr/bin/python3

coins = [5, 6, 1, 1, 2, 3, 4, 9]
#        1, 1, 2, 3, 4, 5, 6, 9 


def nonConstructibleChange(coins):
    coins.sort()
    current_max_change = 0

    for coin in coins:
        if coin > current_max_change + 1:
            return current_max_change + 1
        current_max_change += coin
    return current_max_change + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))

