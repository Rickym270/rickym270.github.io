#!/usr/bin/python3
prices = [7,1,5,3,6,4]

def maxProfit(prices):
    min_price = float("inf")
    max_profit = 0

    for price in prices:
        if price < min_price:
            min_price = price
        elif price - min_price > max_profit:
            max_profit = price - min_price
    return maxProfit

if __name__ == "__main__":
    print(maxProfit(prices))