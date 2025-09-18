# Variable Naming

Every programming language has its own set of rules and conventions for the kinds of names that you should use.

The  rules and conventions for naming your variables in JavaScript:

- Variable names are case-sensitive
- Valid characters
- Character casing
- Avoid reserved keywords
- Use descriptive names

## Case-sensitivity

A variable's name can be any  valid identifier: an unlimited-length sequence of Unicode letters and  digits, beginning with a letter, the dollar sign "`$`", or the underscore character "`_`". However, in JavaScript variable names are case-sensitive, meaning `myVar`, `MyVar`, and `myvar` are distinct variables.

## Valid Characters

The convention, is to always begin your variable names with a letter, not "`$`" or "`_`". Additionally, the dollar sign character, by convention, is never used  at all. A similar convention exists for the underscore character;  while it's technically legal to begin your variable's name with "`_`", this practice is discouraged. White space is not permitted.

While the language allows the use of Unicode characters, including letters from non-Latin scripts like Cyrillic or Chinese, and even special symbols like π (pi) or λ (lambda), these are valid only if they are part of the allowed Unicode categories and are not reserved words. For example, `var π = Math.PI;` and `var λ = function() {};` are syntactically valid. However, supplementary Unicode characters are generally not allowed because JavaScript interprets them as surrogate pairs, which do not match required Unicode categories.

## Character Casing

If the name you choose consists of only one word, spell that word in all lowercase letters. 

If it consists of more than one word, there are a number of options for casing or separating subsequent words:

- `camelCase`
   Camel case starts with a lowercase letter and each subsequent word begins with an uppercase letter. It is commonly used for variable and function names in languages like JavaScript, Java, C, C#, etc. For example, `myVariableName` or `getUserData`.
- `PascalCase`
   Similar to camel case but starts with an uppercase letter. This convention is typically used for class names, interfaces and types in C#, Java, and TypeScript. For example `MyVariableName` or `GetUserData`.
- `snake_case`
   Snake case u ses lowercase letters separated by underscores (`_`) to join words. This convention is commonly used in Python for variable and function names, as well as SQL for columns, and in configuration files. For example `my_variable_name` or `get_user_data`.
- `kebab-case`
   Kebab case uses lowercase letters separated by hyphens (`-`) to connect words. It is primary used in URLs, file names, and CSS class names. Examples are `my-variable-name` or `get-user-data`. In JavaScript, the hyphen is forbidden.

If your variable stores a constant value, the convention changes slightly, where `SCREAMING_SNAKE_CASE` (all uppercase with underscores) is used,. By  convention, the underscore character is never used elsewhere. For example: `var NUM_GEARS = 6`.

## Avoid Keywords

Keep in mind that the name you choose must not be a keyword or reserved word. Examples of reserve keywords in JavaScript are: `var`, `function`, `if`, `else`, `for`, `while`, `return`, `break`, `continue`, `try`, `catch`, `throw`. See the [ES5 Spec](https://tc39.es/ecma262/#sec-keywords-and-reserved-words) for more information.

Additionally, identifiers cannot be the global object properties `NaN`, `Infinity`, or `undefined` in a way that would cause confusion, and in strict mode, `eval` and `arguments` are also disallowed.

## Use Descriptive Names

When choosing a name for your variables, use full words  instead of abbreviations, unless they are very common[^1]. Doing so will make your code easier to read and understand. In many cases it will also make your code  **self-documenting**; variables named `cadence`, `speed`, and `gear`, for example, are much more intuitive than abbreviated versions, such as `s`, `c`, and `g`.

> Names should be concise but descriptive, where the focus should be on clarity over brevity.

The convention usually changes when naming variables to use as an index in a `for` loop, where `i` is commonly used:

```javascript
for (var i = 0; i < myArray.length; i++) {
  // process the array
}
```

For Boolean variables, use prefixes such as `is` or `has` to clearly indicate their true/false nature, such as `isUserLoggedIn` or `hasPermission`.

### Functions

Function names should generally start with a *verb* to indicate the action they perform, and can be combined with a noun to describe the purpose, such as `getUserData` or `setUserName`. This makes the function's intent immediately clear.

### Variable Types

Understanding that JavaScript is a dynamically typed language, it is still possible that while good naming conventions are followed, the variable name can still be misused unintentionally. For example, trying to use a string variable as an integer. There are a number of approaches that can be taken.

#### Use the variable name

You can consider adding a character (or two) at the beginning of a variable to indicate it's type, such as:

- `o` for Object
- `s` for Character or String
- `a` for Array
- `n` for Number
- `gr` for GlideRecord
- and so on

However, this approach has it's limitations whereby the indicator is not concise enough. For example `n` does not distinguish between Integers and Floats, or does `ga` mean `GlideAjax` or `GlideAggregate`?

> **Note**: if this approach is used it is recommended against adding the type as part of the name, such as `userArray`, `userGlideRecord`, `indexNumber`, etc.

#### Type check

Another approach is a type check using `typeof`, for example:

```javascript
typeof "42"
// returns "number"
```

However, `typeof` has limitations with Arrays, objects created with constructors like `new Number()`, and `null`. It will just return `object`. A more precise method of type checking is by using the `Object.prototype.toString.call()` method[^2].

For example:

```javascript
var grIncident = new GlideRecord('incident');
if (grIncident.get('7872d7b13bcc3e90df96ab9a04e45a0e')) {
    gs.print(Object.prototype.toString.call(grIncident));
}
// returns "*** Script: [object GlideRecord]"
```

[^1]: This exemption does not allow you to use `gr` as a variable name as it too generic and it is not clear what record is being processed.
[^2]: See [mdn: Object.prototype.toString()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString) for more info.



