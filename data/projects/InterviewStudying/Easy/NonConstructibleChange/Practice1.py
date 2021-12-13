#!/usr/bin/python3

array = [1, 2, 5]

def nonConstructibleChange(coins):
    # NOTE: Sort the coins
    coins.sort()
    # NOTE: No coins yet so currentChangeCreated is 0
    currentChangeConstructed = 0
    
    #NOTE: Iterate through each coin in array of coins
    for coin in coins:
        # NOTE: If the current coin is greater than currentChangeCreater + 1
        #       then currentChangeCreated + 1 cannot be constructed
        if coin > currentChangeConstructed + 1:
            # NOTE: Since currentChangeConstructed + 1 cannot be constructed
            #       this change amount cannot be created so return it
            return currentChangeConstructed + 1

        #NOTE: Since the if condition was not triggered, add the current coin
        #       to the currentChange that can be constructed
        currentChangeConstructed += coin

    #NOTE: Every number can be constructed, therefore we cannot construct
    #      currentChangeConstructed(total at this point) + 1
    return currentChangeConstructed + 1

if __name__ == "__main__":
    print(nonConstructibleChange(array))
