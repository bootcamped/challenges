
// Create the function, isLeapYear(year) { ... } the returns the boolean: true/false indicating whether
//  the given year is a leap year.
//
// A year is a valid leap year when:
//
//   * Divisible by 4 or 400, but not 100 otherwise.
//
//
// Examples:
//
//   2009: false
//   2012: true
//   1900: false
//   2000: true
//
//
// Use the fewest amount of `if` statements as possible.  No more than 1.  Can you do it with out any
//  at all?
//
//
// ES6 BONUS:
//
//   Convert the function to a generator that accepts multiple years and yields the boolean one at a
//    time.
//
//


// Answer #1:
//
(function() {
  function isLeapYear(year) {
    return !(year % 4 || (year % 100 === 0 && year % 400));
  }

  console.log( isLeapYear(2009) );  // false
  console.log( isLeapYear(2012) );  // true
  console.log( isLeapYear(1900) );  // false
  console.log( isLeapYear(2000) );  // true
})();


// Answer #2 (ES6 BONUS - convert to generator function
//
(function() {
  function* isLeapYear(...years) {
    for (let year of years) {
      yield !(year % 4 || (year % 100 === 0 && year % 400));
    }
  }

  for (let year of isLeapYear(1600, 1900, 2000, 2010, 2016, 2100)) {
    console.log(year);  // true, false, true, false, true, false
  }
})();