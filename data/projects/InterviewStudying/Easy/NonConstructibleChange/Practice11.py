#!/usr/bin/python3
coins = [1,3,5] #2

def nonConstructibleChange(coins):
    maxCreatedChange = 0
    for coin in coins:
        if coin > maxCreatedChange + 1:
            return maxCreatedChange + 1
        maxCreatedChange += coin
    return maxCreatedChange + 1


if __name__ == "__main__":
    print(nonConstructibleChange(coins))
