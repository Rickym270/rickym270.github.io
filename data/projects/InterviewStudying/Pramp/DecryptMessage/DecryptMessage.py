#!/usr/bin/python3
'''
    An infamous gang of cybercriminals named “The Gray Cyber Mob”, which is behind many hacking attacks and drug
    trafficking scandals, has recently been targeted by the FBI. After intercepting a few messages which looked to be
    nonsense at first, the agency realized that the group indeed encrypts their messages, and studied their method of
    encryption.

    The messages consist of lowercase Latin letters only, and every word is encrypted separately as follows:

    Convert every letter to its ASCII value.
    Add 1 to the first letter, and then for every letter from the second one to the last one, add the value of the
    previous letter.
    Subtract 26 from every letter until it is in the range of lowercase letters a-z in ASCII. Convert the values back
    to letters.
'''
message1 = "dnotq" # crime
message2 = "flgxswdliefy" # encyclopedia

def decrypted_char(char, rotational_factor):
    if char.isupper():
        uni_char = ord(char) - ord("A")
        shifted_char = (uni_char - rotational_factor) % 26
        new_char = chr(shifted_char + ord("A"))
        return new_char
    if char.islower():
        uni_char = ord(char) - ord("a")
        shifted_char = (uni_char - rotational_factor) % 26
        new_char = chr(shifted_char + ord("a"))
        return new_char

def decrypt(msg):
    decrypted_msg = ""
    prev = ""

    for i in range(len(msg)):
        new_char = ""
        char = msg[i]
        if i == 0:
            new_char = decrypted_char(char, 1)
        else:
            new_char = decrypted_char(char, ord(prev))

        prev = char
        decrypted_msg += new_char
    return decrypted_msg

if __name__ == "__main__":
    print(decrypt(message1))
    print(decrypt(message2))