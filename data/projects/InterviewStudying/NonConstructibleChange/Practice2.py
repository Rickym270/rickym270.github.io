#!/usr/bin/python3

coins = [1,8,3,2]
def nonConstructibleChange(coins):
    #NOTE: Sort the coins
    coins.sort()
    #NOTE: Variable to store the current change that can be created
    currentChangeCreated = 0

    for coin in coins:
        if coin > currentChangeCreated + 1:
            return currentChangeCreated + 1
        currentChangeCreated += coin
    return currentChangeCreated + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))
