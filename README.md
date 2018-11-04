### AES-128 implementatin with CTR mode of operation

This AES implementation is not intended real use, I did it to understand the algorithm better. You can use `openssl` to check the result.

**Note**: This implementation currently only works with ASCII character (a..zA..z0..9)

**TODO**:
- Other mode of operations

```
nodejs aes.js [password] [plaintext]
```

Example:
```
nodejs aes.js [alice432] [ThisIsASecret]
```

Output:
```
Cipher text = 9bb2 671 5d8f e07d 2ce5 8710 7
Decrypted Msg = ThisIsASecret
```
