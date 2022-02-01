#!/usr/bin/python3
string = "All-convoYs-9-be:Alert1."
# ANS: Epp-gsrzsCw-3-fi:Epivx5.
rotational_factor = 4

def encrypt(input, rotation_factor):
    encrypted_msg = ""

    for i in range(len(input)):
        char = input[i]
        if char.isupper():
            unicode_char = ord(char) - ord("A")
            shifted_char = (unicode_char + rotation_factor) % 26
            new_char = chr(shifted_char + ord("A"))
            encrypted_msg += new_char
        elif char.islower():
            unicode_char = ord(char) - ord("a")
            shifted_char = (unicode_char + rotation_factor) % 26
            new_char = chr(shifted_char + ord("a"))
            encrypted_msg += new_char
        elif char.isdigit():
            shifted_char = (int(char) + rotation_factor) % 10
            new_char = str(shifted_char)
            encrypted_msg += new_char
        else:
            encrypted_msg += char


    return encrypted_msg

if __name__ == "__main__":
    print(encrypt(string, rotational_factor))
