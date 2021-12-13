#!/usr/bin/python3

coins = [5, 6, 1, 1, 2, 3, 43]

def nonConstructibleChange(coins):
    coins.sort()
    currentChangeCreated = 0
    for coin in coins:
        if coin > currentChangeCreated + 1:
            return currentChangeCreated + 1
        currentChangeCreated += coin
    return currentChangeCreated + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))
