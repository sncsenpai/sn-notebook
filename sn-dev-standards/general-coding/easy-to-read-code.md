# Make Your Code Easy To Read

Remember, others may work on your deliverable in the future. Another way to look at it, is to code for future you. Will you remember the rationale or purpose of the scripts in the future? Possibly not. Therefore, please ensure your code is easy to read and understand. 

### Commenting Code

What may seem obvious today may not be clear in the future, especially on a complicated section of code. Comments should be well-written and clear, just like the code they are annotating. There are three styles of comments: single, block, and doc (I made this one up).

Single line comments start with `//` and can be placed anywhere on the line. Everything after the `//` and up to the new line is considered a comment. For example:

```javascript
// Calculate the area of a rectangle
let width = 5;
let height = 10;
let area = width * height; // This line computes the area   
```

These comments are useful for brief explanations, and adding notes like `// TODO:` or `// FIXME:` to track tasks or bugs.

Block comments start with`\*` and end with `*/` - everything between them is considered a comment. This is useful for longer explanations, documenting functions, or disabling multiple lines of code. For example:

```javascript
/*
 This function calculates the sum of two numbers.
 It takes two parameters: a and b.
 It returns the sum of a and b.
*/
function add(a, b) {
    return a + b;
}
```

Doc comments are an extension of block comments using JSDoc syntax, by using extra `*`'s. Example:

```javascript
/**
 * Represents a book.
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
function Book(title, author) {
}
```

Useful block tags to use, for example, are `@default`, `@description`, `@function`, `@param`,  `@returns`, `version` etc. See [@use JSDoc](https://jsdoc.app/) for further documentation.

However, it is important to consider limiting comments to focus on providing value without excess. It is recommended you document code that requires clarification, such as:

- complex logic
- workarounds for bugs
- ambiguous specifications
- non-obvious design

Also, remember that many Application Files, such as Business Rules, Client Scripts, Script Includes, etc. do have the `description` field. Leverage that for larger comments.

### Write Simple Statements

Just as with comments, remember that less experienced developers may work with your code in the future. Make it as easy to maintain as possible. In general, it is the compiler's (or interpreter's) job to make code fast, so minimise the use of fancy tricks. 

For example, experienced programmers (or show offs) may not have an issue with the JavaScript ternary operator:

`var result = (a == b) ? "foo" : "bar";`

You may understand it, but less experienced developers may find it challenging to understand. Instead, the statement could be written more clearly as:

```javascript
var result;
if (a == b) {
  result = "foo";
}
else {
  result = "bar";
}
```

### Use Whitespace Wisely

JavaScript is quite forgiving. You can use a lot of space between statements and the script will still work. So, while it is recommended to use empty lines and spaces to make code readable, please don't overdo it.

The key point is that code should be structured to be easy to read and understand. Prioritise readability over ease of writing.

What do I mean here:

- Clearly separate function parameters
- Use additional lines to visually group code blocks together
- Use tabs (or fixed character spacing) to indent code blocks
  - Including nested code blocks

Here's an example of a badly using whitespace:

```javascript
function myFunction(varA,varB) {
var isAllowed = varA != varB;
if (isAllowed) { doSomething(); } else { doSomethingElse(); }
}
```

Let's now apply some whitespace logic:

```javascript
function myFunction(varA,varB) {
    var isAllowed = varA != varB;
    if (isAllowed) {
        doSomething(); 
    } 
    else { 
        doSomethingElse(); 
    }
}
```

Barring the conversation of bracket placement[^1], the ServiceNow code editor does have the ability to format the code for you, but I personally do not like how the `else` gets buried in the brackets:

```javascript
if (isAllowed) {
    doSomething(); 
} else { 
    doSomethingElse(); 
}
```

The issue with this is that it takes away to quickly and easily read (or scan) code at a glance. Code blocks need to be visually organised.

[^1]: That's a debate I do not want to get into 😄.
