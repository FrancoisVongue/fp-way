# FP-WAY
Simple functional programming library that works as you would expect.
Main purpose of the library is to 
> **reduce the amount of code that you need to write in your projects.**

# Type based structure
Library consists of namespaces that correspond to the following javascript types:

```
  (namespace - js type)
1. bool      - 'boolean'
2. num       - 'number'
3. str       - 'string'
4. obj       - 'object'
5. arr       - 'array'
```
And [core methods](#isoftype)


Each namespace contains curried methods that work on the corresponding type.

# Core methods
Note that some methods in this section have **aliases**. 
<br>For example **Const** and **Return** are the same method.

## Curry
Returns a curried version of a function. 
<br>
Returned function returns itself if there were no arguments passed.
<br>It may take not only one but **multiple arguments at a time**.
```ts
const add = (a, b) => a + b;

const curriedAdd = Curry(add);
const add2 = curriedAdd(2);     // returns (x) => 2 + x
const four = curriedAdd(2, 2);  // pass 2 args at a time
```

## Identity
Function that returns first argument passed to it
```ts
const Identity = x => x
```

## Const (aka Return), TRUE and FALSE
Const(Return) is a function that takes **two arguments** and returns the first one.
<br>**TRUE** and **FALSE** are aliases for Const(true) and Const(false) respectively.

Useful to use as a higher order function to return the same value no matter the input.
```ts
const Const = (a, b) => a
```
> **Note** that unlike examples in this tutorial, 
> actual functions in the library are **curried**. 
> <br>This is done to simplify code examples.

## Variable
Variable is a function that takes **two arguments** and returns the **second** one.

## DoNothing
Function that optionally takes a single argument and does nothing.
(in js terms that means it `returns undefined`).

## Not
Takes a predicate (a function that returns **boolean**) and returns a predicate <br>
that **returns true/false in opposite to the initial function cases**.

> **Note** that this function is one of a few that are **not curried**.

## Is
Function that takes two arguments and checks if they are equal using **strict equality**.

## IsNot
```ts
const IsNot = Not(Is)
```

## Exists
Function that takes a single argument and checks if it's equal to **null** or **undefined**
<br> using strict equality. Any other value is considered as existing.

## NotExists
```ts
const NotExists = Not(Exists);
```

## Swap
Function that takes a **binary function** and returns a binary function that
<br>does the same thing but **takes second argument first**.
```ts
const append = (appendingString, str) => str + appendingString;
const result1 = append('Hello ', 'world'); // "worldHello "

const prepend = Swap(append);
const result2 = prepend('Hello ', 'world'); // "Hello world"
```

## Call
Function that takes a function and an argument and returns 
<br>**the result of calling that function with the argument**
```ts
const Call = (f, x) => f(x)
```

## ApplyOn
```ts
const ApplyOn = Swap(Call)
```

## IfElse
Function that takes four arguments:
1. unary predicate
2. unary function
3. unary function
4. value

First, value is being passed to the predicate, if it returns 
1. **true** then the function will return the result of calling the first function with the value
2. **false** then the function will return the result of calling the **second function** with the value

## When
Function that takes three arguments:
1. unary predicate
2. unary function
3. value

First, value is being passed to the predicate, if it returns
1. **true** then the function will return the result of calling the function with the value
2. **false** then the function will return the value itself

## Unless
Function that takes three arguments:
1. unary predicate
2. unary function
3. value

First, value is being passed to the predicate, if it returns
1. **true** then the function will return the value itself
2. **false** then the function will return the result of calling the function with the value

## InCase
Function that takes two arguments:
1. An array of binary tuples where every tuple contains:
   1. Unary predicate
   2. Unary function
2. value

Value is passed to every unary predicate in order.
<br>Function returns the result of passing value to the Unary function 
<br>of the first tuple where predicate returns true.

This function works similar to switch..case construction.
```ts
const value = 22;

const forty_four = InCase([
    [Is(2) , (v) => v - 2],
    [Is(22), (v) => v * 2],  // first tuple where predicate returns true for the value
                             // then value is multiplied by 2 and returned
    // using TRUE as the predicate for the last tuple is simmilar to using "default" in a switch case
    [TRUE  , Return(8)],     
], value)
```

## IndependentInCase
Function that takes two arguments:
1. An array of binary tuples where every tuple contains:
    1. Unary predicate
    2. Unary function
2. value

Works simillar to InCase but returns 
<br>**an array of results** of passing value to unary functions where predicate returned `true`

## CanBeDescribedAs
Function takes two arguments:
1. An array of unary predicates
2. value

Checks if every predicate returns true when called with the value.

## Pipe
Function takes two arguments:
1. An array of unary functions 
2. value

Passes value to the first function and then the result to the next one, 
<br>invoking every function in order and returning the result of the last one

```ts
const Add = a => b => a + b;
const MultiplyBy = a => b => a * b;

const twelve = Pipe([
    Add(2),
    MultiplyBy(3),
], 2)
```

## Compose
Function takes two arguments:
1. An array of unary functions
2. value

Works similar to `Pipe` but **calls functions in the reverse order**.

## IsOfType
Functions takes two arguments:
1. string representing a type, which can be
   `| "undefined"
    | "null"
    | "object"
    | "boolean" `<br>`
    | "number"
    | "bigint"
    | "string"
    | "symbol"
    | "function"
    | "array" |`
3. a value

Validates that value is of specified type. Works simillar to `typeof` 
but works correctly for **null** and **array** values.

## TypeOf
Unary function that takes value and returns its type, 
<br>which can be one of the aforementioned strings.
