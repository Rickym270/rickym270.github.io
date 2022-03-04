#!/usr/bin/python3
ip1 = "123.24.59.99" # True
ip2 = "192.168.123.456" # False
ip3 = "192.a.123.056" # False
# 3 dots -
# Each quartet needs to be a number
# Can't be empty
# No leading zero
# Each quartet must be between 0 - 255
def isValidQuartet(chunk):
    if len(chunk) == 0:
        return False
    if not chunk.isdigit():
        return False
    if len(chunk) >= 2 and chunk[0] == 0:
        return False

    return int(chunk) >= 0 and int(chunk) <= 255

def validate(ip):
    #TODO: Split into chunks
    chunks = ip.split(".")
    # TODO: Ensure there are 4 quartets
    if len(chunks) != 4:
        return False

    # TODO: Iterate through quartets
    for chunk in chunks:
        if not isValidQuartet(chunk):
            return False
    return True

if __name__ == "__main__":
    print(validate(ip1))
    print(validate(ip2))
    print(validate(ip3))