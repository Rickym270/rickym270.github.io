#!/usr/bin/python3
prices = [7,1,5,3,6,4]

def maxProfit(prices):
    # TODO: Jeep track of min_price and max_profit
    min_price = float("inf")
    max_profit = 0
    for price in prices:
        # TODO: If current price is less than min_price
        if price < min_price:
            min_price = price
        # TODO: Compare current profit to max profit
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return max_profit

if __name__ == "__main__":
    print(maxProfit(prices))