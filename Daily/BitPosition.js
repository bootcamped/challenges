
// Suppose we are given an variable length array of bits representing a security
//  token.  Each bit position maps to a permission some user has.
//
// For example,
//
//  [87, 12, 64, 212, ...] represents a stream of bits that, in memory, look like
//   [01010111, 0001100, 1000000, 11010100, ...].  Starting from the left-most bit,
//   moving towards infinity on the right, we count from bit position zero to n.
//
//  A permission mapping might look like:
//
//  11010111 00001100 10000000 11010100 ...
//  ||     |       |                +- Position 30: is prime member
//  ||     |       +------------------ Position 13: can view order history
//  ||     +-------------------------- Position 7 : can view payment details
//  |+-------------------------------- Position 1 : can delete orders
//  +--------------------------------- Position 0 : can change permissions on this token
//
// Etc.
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
  }


  loadPermissions() { // loaded presumably from a database in reality, and cached
    return {
      canUpdateToken: 0,
      canDeleteOrders: 1,
      canViewPaymentDetails: 7,
      canViewOrderHistory: 13,
      isPrimeMember: 30
    };
  }

  hasPermission(token, permission) {
    return false;
  }

  setPermission(token, permission, trueOrFalse) {
    if (!token || token.length === 0) {
      throw "Invalid token.";
    }
  }
}


let token = [87, 12, 64, 212];
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
