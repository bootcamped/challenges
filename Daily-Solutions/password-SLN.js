

// No one likes it when others figure out their password.  Business's especially.  But we're
//  not just any business, we're ACME Unicorn -- and we have a top secret black ops project
//  that no one can ever know about.  We need to make sure that our coders have really strong
//  passwords so our rival, BRUTE Co. can't script a viable password cracker and compromise
//  our systems.
//
// We're tasked to create a function that determines whether as password is strong enough.
//
// OWASP (www.owasp.org) is a trusted repository of security and vulnerabilities information
//  that helps educate us how to build secure systems.
//
// Visit:
//
//   https://www.owasp.org/index.php/Authentication_Cheat_Sheet
//
// , to learn about the rules for a strong password.  Using those rules, Write the function
//  isPasswordStrong(...) that returns the boolean true/false indicating whether the given
//  password is strong enough for us.
//
//
// Examples:
//
//   Strong:
//
//     0B2au$1lsv$!
//     Str0ngP@$sW0rduh!
//     MinStr0ng!
//
//   Weak:
//
//     Password
//     T00W3@K
//     P@s$w0rd
//


function isStrongPassword() {
  const validators = [
    (char) => { return "abcdefghijklmnopqrstuvwxyz".includes(char); },
    (char) => { return "ABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(char); },
    (char) => { return "0123456789".includes(char); },
    (char) => { return " !\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~".includes(char); }
  ];


  return (password) => {

    // 1. Must be at least 10 chars
    // 2. Must be at most 128 chars
    // 3. Not more than 2 identical characters in a row
    // 4. Must be a valid character
    //   5. Must have at least 1 upper
    //   6. Must have at least 1 lower
    //   7. Must have at least 1 digit
    //   8. Must have at least 1 special char
    //
    if (password.length < 10 || password.length > 128) {
      return false;
    }

    let prevChar1 = password[0];
    let prevChar2 = password[1];
    let bucket = []; // index of validator maps to index in bucket
    let count = 0;

    for (let i=0; i<password.length; i++) {
      let char = password[i];

      if (i>1 && ((char === prevChar1 ) && (char === prevChar2))) { // only check consecutive after 2nd iteration
        return false;
      }

      let found = false;
      for (let which=0; which<validators.length; which++) { // easier than if/else/else/else/...
        if (validators[which](char)) {
          count += (bucket[which] ? 0 : 1);
          bucket[which] = true;
          found = true;

          break;
        }
      }

      if (!found) {    // invalid character
        return false;
      }

      prevChar1 = prevChar2;
      prevChar2 = char;
    }

    return (count >= 3);
  }
}





(function() {
  let checker = isStrongPassword();

  console.log(checker("0B2au$1lsv$!"));          // true
  console.log(checker("Str0ngP@$sW0rduh!"));     // true
  console.log(checker("MinStr0ng!"));            // true
  console.log(checker("MinStr0ng!!"));           // true

  console.log(checker("MMMinStr0ng"));           // false
  console.log(checker("asdlkf2@#T#$alkac..."));  // false
  console.log(checker("Password"));              // false
  console.log(checker("T00W3@K"));               // false
  console.log(checker("P@s$w0rd"));              // false
})();