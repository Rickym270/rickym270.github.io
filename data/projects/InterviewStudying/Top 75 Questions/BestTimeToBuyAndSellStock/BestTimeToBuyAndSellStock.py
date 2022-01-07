#!/usr/bin/python3
prices = [7,1,5,3,6,4]

def maxProfit(prices):
    minPrice = float("inf")
    maxProfit = 0

    for price in prices:
        if price < minPrice:
            minPrice = price
        elif price - minPrice > maxProfit:
            maxProfit = price - minPrice
    return maxProfit

if __name__ == "__main__":
    print(maxProfit(prices))