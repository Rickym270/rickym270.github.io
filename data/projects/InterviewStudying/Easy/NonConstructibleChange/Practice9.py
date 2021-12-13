#!/usr/bin/python3

coins = [5, 7, 1, 1, 2, 3, 22]

def nonConstructibleChange(coins):
    coins.sort()
    currentMaxChange = 0
    for coin in coins:
        if coin > abs(currentMaxChange) + 1:
            return currentMaxChange + 1
        currentMaxChange += coin
    return currentMaxChange + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))
