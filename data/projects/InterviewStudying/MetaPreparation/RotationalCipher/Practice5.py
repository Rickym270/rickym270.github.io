#!/usr/bin/python3
string = "All-convoYs-9-be:Alert1."
# ANS: Epp-gsrzsCw-3-fi:Epivx5.
rotational_factor = 4

def encrypt(input, rotation_factor):
    encrypted_msg = ""
    # TODO: Iterate through string
    for i in range(len(string)):
        char = input[i]
        # TODO: Capital Letters
        if char.isupper():
            # TODO: Find current characters unicode
            char_unicode = ord(char) - ord("A")
            # TODO: Shift
            shifted_idx = (char_unicode + rotation_factor) % 26
            # TODO: Convert unicode to char
            new_char = chr(shifted_idx + ord("A"))
            # TODO: Add converted_char to encrypted msg
            encrypted_msg += new_char
        # TODO: Lowercase Letters
        elif char.islower():
            # TODO: Find current characters unicode
            char_unicode = ord(char) - ord("a")
            # TODO: Shift
            shifted_idx = (char_unicode + rotation_factor) % 26
            # TODO: Convert unicode to char
            new_char = chr(shifted_idx + ord("a"))
            # TODO: Add converted_char to encrypted msg
            encrypted_msg += new_char
        # TODO: Numbers
        elif char.isdigit():
            shifted_idx = (int(char) + rotation_factor) % 10
            encrypted_msg += str(shifted_idx)
        # TODO: Punctuation
        else:
            encrypted_msg += char

    return encrypted_msg


if __name__ == "__main__":
    print(encrypt(string, rotational_factor))