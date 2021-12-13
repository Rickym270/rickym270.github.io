#!/uar/bin/python3
# TODO: Return the minimum sum of money (change) that you cannot
#       create.
coins = [5, 6, 1, 1, 2, 3, 4, 9]

def nonConstructibleChange(coins):
    coins.sort()
    change_max = 0
    for coin in coins:
        if coin > change_max + 1:
            return change_max + 1

        change_max += coin
    return change_max + 1

if __name__ == "__main__":
    print(nonConstructibleChange(coins))

