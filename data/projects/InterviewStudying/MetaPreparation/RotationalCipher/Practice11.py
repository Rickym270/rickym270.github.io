#!/usr/bin/python3
string = "All-convoYs-9-be:Alert1."
# ANS: Epp-gsrzsCw-3-fi:Epivx5.
rotational_factor = 4`


def rotationalCipher(input, rotation_factor):
  # Write your code here
  encrypted_msg = ""
  # TODO: Iterate through string
  for i in range(len(input)):
    char = input[i]
    # TODO: Upper Case letters
    if char.isupper():
      unicode_char = ord(char) - ord("A")
      shifted_idx = ( unicode_char + rotation_factor) % 26
      new_char = chr(shifted_idx + ord("A"))
      encrypted_msg += new_char
    # TODO: Lower Case letters
    elif char.islower():
      unicode_char = ord(char) - ord("a")
      shifted_idx = (unicode_char + rotation_factor) % 26
      new_char = chr(shifted_idx + ord("a"))
      encrypted_msg += new_char
    # TODO: Numbers
    elif char.isdigit():
      shifted_idx = (int(char) + rotation_factor) % 10
      encrypted_msg += str(shifted_idx)
    # TODO: Other
    else:
      encrypted_msg += str(char)
  return encrypted_msg

if __name__ == "__main__":
    print(encrypt(string, rotational_factor))
