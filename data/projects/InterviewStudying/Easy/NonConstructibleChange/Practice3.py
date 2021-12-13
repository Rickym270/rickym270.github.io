#!/usr/bin/python3

coins = [5, 7, 1, 1, 2, 3, 22]

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
