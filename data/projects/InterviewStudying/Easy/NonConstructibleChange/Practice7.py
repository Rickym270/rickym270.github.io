#!/usr/bin/python3

coins = [5, 6, 1, 1, 2, 3, 43]
#        1, 1, 2, 3, 5, 6, 43 

def nonConstructibleChange(coins):
    coins.sort()
    current_max_unavailable_change = 0
    
    for coin in coins:
        if coin > current_max_unavailable_change + 1:
            return current_max_unavailable_change + 1
        current_max_unavailable_change += coin
    return current_max_unavailable_change + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))
