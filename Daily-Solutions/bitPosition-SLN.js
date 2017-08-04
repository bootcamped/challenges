
// Suppose we are given an variable length array of bits representing a security
//  token.  Each bit position maps to a permission some user has.
//
// For example,
//
//  [215, 12, 128, 212, ...] represents a stream of bits that, in memory, look like
//   [01010111, 00001100, 1000000, 11010100, ...].  Starting from the left-most bit,
//   moving towards infinity on the right, we count from bit position zero to n.
//
//  A permission mapping might look like:
//
//  Byte 0     Byte 1     Byte 2     Byte 3    ... <- Byte position
//  01234567   01234567   01234567   01234567  ... <- Bit ordering in each byte
//  0      7   8      15 16      23 24      31 ... <- Bit position in token
//  11010111   00001100   10000000   11010100  ... <- Binary representation
//  ||     |         |                    |
//  ||     |         |                    |
//  ||     |         |                    +-- Position 29: is prime member
//  ||     |         +----------------------- Position 14: can view order history
//  ||     +--------------------------------- Position 7 : can view payment details
//  |+--------------------------------------- Position 1 : can delete orders
//  +---------------------------------------- Position 0 : can change token permissions
//
// Etc.
//
// NOTE: You might have noticed that the bit positions are in reverse order for each byte.
//  That is because, during this abstraction, we set the bits in order from left-to-right.
//  We did not redefine the rules of binary, we're just abstracting the ordering in a
//  different way than usual.
//
//
//
// Write a function that given a token and a permission number, returns a boolean
//  true/false indicating whether the permission is enabled.
//
// BONUS: write a function to change the permissions only if permission zero is set.
//
// MORE BONUS (SYSTEMS DESIGN): What security implications are there by allowing any
//  user to own a copy of the raw token?  How might you design a system that allows an
//  untrusted user to use the token without the ability to compromise it?
//
class TokenManager {
  constructor() {
    this.permissions = this.loadPermissions();

    this.bitMaskReadOrSet = [ // or [128, 64, 32, 16, 8, 4, 2, 1 ];
      0b10000000,    // ES5 must use 128
      0b01000000,    // ES5 must use 64
      0b00100000,    // ES5 must use 32
      0b00010000,    // ES5 must use 16
      0b00001000,    // ES5 must use 8
      0b00000100,    // ES5 must use 4
      0b00000010,    // ES5 must use 2
      0b00000001     // ES5 must use 1
    ];

    this.bitMaskClear = [ // or [127, 191, 223, 239, 247, 251, 253, 254 ];
      0b01111111,    // ES5 must use 127
      0b10111111,    // ES5 must use 191
      0b11011111,    // ES5 must use 223
      0b11101111,    // ES5 must use 239
      0b11110111,    // ES5 must use 247
      0b11111011,    // ES5 must use 251
      0b11111101,    // ES5 must use 253
      0b11111110     // ES5 must use 254
    ];
  }


  loadPermissions() { // loaded presumably from a database in reality, and cached
    return {
      canUpdateToken: 0,
      canDeleteOrders: 1,
      canViewPaymentDetails: 7,
      canViewOrderHistory: 14,
      isPrimeMember: 29
    };
  }

  hasPermission(token, permission) {
    const whichByte = Math.floor(permission / 8);     // Figure out the byte number
    const whichBit = (permission - (8 * whichByte));  // Figure out the bit position
    const byte = token[whichByte];                    // Fetch our byte

    return ((byte & this.bitMaskReadOrSet[whichBit]) ? true : false);
  }

  setPermission(token, permission, trueOrFalse) {
    if (!token || token.length === 0) {
      throw "Invalid token.";
    }

    if (!this.hasPermission(token, this.permissions.canUpdateToken)) {
      throw "Insufficient permissions.";
    }

    const whichByte = Math.floor(permission / 8);
    const whichBit = (permission - (8 * whichByte));

    if (trueOrFalse) { // Set the bit to 1
      token[whichByte] |= this.bitMaskReadOrSet[whichBit];
    }
    else { // Clear the bit
      token[whichByte] &= this.bitMaskClear[whichBit];
    }
  }
}






(function() {
  let token = [215, 12, 128, 212];
  let tokenManager = new TokenManager();
  let permissions = tokenManager.permissions;

  console.log(tokenManager.hasPermission(token, permissions.canUpdateToken));         // true
  console.log(tokenManager.hasPermission(token, permissions.canDeleteOrders));        // true
  console.log(tokenManager.hasPermission(token, permissions.canViewPaymentDetails));  // true
  console.log(tokenManager.hasPermission(token, permissions.canViewOrderHistory));    // false
  console.log(tokenManager.hasPermission(token, permissions.isPrimeMember));          // true

  tokenManager.setPermission(token, permissions.isPrimeMember, false);

  console.log(tokenManager.hasPermission(token, permissions.isPrimeMember));          // false

  tokenManager.setPermission(token, permissions.canUpdateToken, false);

  console.log(tokenManager.hasPermission(token, permissions.canUpdateToken));          // false

  try {
    tokenManager.setPermission(token, permissions.canUpdateToken, true);              // Boom
    console.log("What?  That shouldn't have worked");
  }
  catch (e) {
    console.log("Uh oh, now you can't set it back...");
  }
  finally {
    console.log(token);  // Expect [87, 12, 128, 208]
  }

})();