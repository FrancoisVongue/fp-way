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
And **core methods**

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

## Is, Exists, IsNot, NotExists
I
