'''
    Validate an IP address (IPv4). An address is valid if and only if it is in the form "X.X.X.X", where each X is a
    number from 0 to 255.

    For example,
    "12.34.5.6", "0.23.25.0", and "255.255.255.255" are valid IP addresses,
    while "12.34.56.oops", "1.2.3.4.5", and "123.235.153.425" are invalid IP addresses.
'''
ip1 = "123.24.59.99" # True
ip2 = "192.168.123.456" # False
ip3 = "192.a.123.056" # False
# 3 dots -
# number between each dot
# Only a number
# No leading zeros

def isValidQuartet(chunk):
    if len(chunk) == 0:
        return False

    if not chunk.isdigit():
        return False

    if len(chunk) > 0 and chunk[0] == 0:
        return False

    return int(chunk) >= 0 and int(chunk) <= 255

def validate(ip):
    chunks = ip.split(".")

    if len(chunks) != 4:
        return False

    for chunk in chunks:
        if not isValidQuartet(chunk):
            return False
    return True

if "__main__" == __name__:
    print(validate(ip1))
    print(validate(ip2))
    print(validate(ip3))
