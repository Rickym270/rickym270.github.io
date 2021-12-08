#!/usr/bin/python3

coins = [1,2,5]
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

'''
    Explanation:
        Line 4: Function definition
        Line 5: Sort the array because we need to go through each number,
                in order, until the number we are at, cannot be created.
        Line 6: Initialize and set to 0 currentChangeCreated
                    Why?
                        We want to keep track of the max current change that 
                        has been created
        Line 8: Iterate through the given coins
        Line 9: If the current coin is greater than the 
                current change created + 1, then that means that we can't 
                make the currentChange
                Why?
                    We already proved we can make the currentChangeCreated
                    with the coins that were given.
                    - Now we have to see if we can make 
                      currentChangeCreated + 1
        Line 10: If the coin is greater than currentChangeCreated + 1, then
                 that means currentChangeCreated + 1 is the least change 
                 amount that cannot be created.
                    NOTE: We already proved currentChangeCreated can be
                          created
        Line 12: Increment the currentChangeCreated by the current coin.
        Line 14: After the loop, since there were no change amount that
                 could not be created, the lowest amount that can't be created
                 is the total change + 1
                    What happened to currentChangeCreated?
                        Since this is at the end of the loop,
                        currentChangeCreated is now the max amount of change
                        that can be created
'''

