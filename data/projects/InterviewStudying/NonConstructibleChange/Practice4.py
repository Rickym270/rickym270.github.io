#!/usr/bin/python3

coins = [1, 5, 1, 1, 1, 10, 15, 20, 100]

def nonConstructibleChange(coins):
    coins.sort()
    constructibleChange = 0

    for coin in coins:
        if coin > constructibleChange + 1:
            return constructibleChange + 1
        constructibleChange += coin
    return constructibleChange + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))
