#!/usr/bin/python3
string = "All-convoYs-9-be:Alert1."
# ANS: Epp-gsrzsCw-3-fi:Epivx5.
rotational_factor = 4

def encrypt(input, rotation_factor):
    encrypted_msg = ""
    for i in range(len(input)):
        char = input[i]

        if char.isupper():
            uni_char = ord(char) - ord("A")
            rotated_uni_char = (uni_char + rotation_factor) % 26
            new_char = chr(rotated_uni_char + ord("A"))
            encrypted_msg += new_char
        elif char.islower():
            uni_char = ord(char) - ord("a")
            rotated_uni_char = (uni_char + rotation_factor) % 26
            new_char = chr(rotated_uni_char + ord("a"))
            encrypted_msg += new_char
        elif char.isdigit():
            rotated_uni_char = ( int(char) + rotation_factor) % 10
            new_int = str(rotated_uni_char)
            encrypted_msg += new_int
        else:
            encrypted_msg += char
    return encrypted_msg

    return encrypted_msg

if __name__ == "__main__":
    print(encrypt(string, rotational_factor))
