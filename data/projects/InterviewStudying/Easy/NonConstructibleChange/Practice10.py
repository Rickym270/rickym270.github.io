#!/usr/bin/python3

coins = [5, 7, 1, 1, 2, 3, 22]
#        1, 1, 2, 3, 5, 7, 22
def nonConstructibleChange(coins):
    coins.sort()
    currentMaxCreatedChange = 0
    for coin in coins:
        if coin > currentMaxCreatedChange + 1:
            return currentMaxCreatedChange + 1
        currentMaxCreatedChange += coin
    return currentMacCreatedChange + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))

