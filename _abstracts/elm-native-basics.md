---
title: "Elm Native basics"
description: "Learn the basics of writing Elm Native code"
tags: [elm]
---
## Beware

Before diving on the topic, don't forget that `Native`, in Elm, means writing JavaScript code called directly from Elm code. This has nothing to do with iOS or Android or stuff like React Native.

{% alert warning %}
Be super careful. The promise that Elm has no runtime error is broken the moment you start writing native code. If your native JavaScript code throws an error, it will crash your program. It's up to you to ensure that it cannot happen, just like Elm does. `try/catch` is your best friend if you have any doubt.
{% endalert %}

## A simple and useless example

Let's start with simple things. Let's pretend for a brief moment that Elm does not have a function nor an operator to add integers. That kind of suck because you don't want to write ports to achieve that, it should be synchronous, right? Your only solution is to write a native JavaScript function just like this one:

{% highlight javascript %}
function add(a, b) {
  return a + b;
}
{% endhighlight %}

That was easy! Now, how do we plug it into our Elm code? First, we will need to wrap it inside a specific code to ensure that it will fit on the resulting JavaScript file after Elm compilation. I will talk about the syntax of this file on another blog post so, for now, just trust me on the syntax.

{% highlight javascript %}
var _username$project$Native_Utils = function () {
  function add(a, b) {
    return a + b;
  }

  return {
    add: F2(add)
  };
}()
{% endhighlight %}

What happened? Our code was so nice and now it's nearly nonsense... Actually, it's not that hard. Nearly all functions and constants in Elm will be assigned to a JavaScript variable in the compiled file. The name syntax is: `_[username]$[project name]$[module name]`. `username` and `project name` are both coming from the `repository` field inside your `elm-package.json`, most the time it will be your GitHub username and the name of your project. If you don't have this field, default values `username` and `project` will be used. So don't forget to edit them to match your project.

Then we create an IIFE (aka a function that automatically called itself). That's because we want to scope all our variables and functions. The returned value is an object exposing the API of our native module. Right now, we only have one function exposed but we could have way more.

Finally, because all functions in Elm are curried, we need to apply a small Elm helper to achieve that. You have several of them, from `F2` to `F9`, where the number match the number of arguments of your function. Since `add` has 2 arguments, we wrap it inside `F2`. There is no need to wrap functions with zero or one argument. We could also have directly wrote a curried function just like that:

{% highlight javascript %}
function add(a) {
  return function (b) {
    return a + b;
  };
}
{% endhighlight %}

But the `F2` helper is easier.

Now, let's save our code inside the `Native/Utils.js` file. That's because we named our module `Native_Utils` (see the first line of the previous JavaScript code), and underscore means subfolder. The `Native` part is mandatory but you can rename the `Utils` part as you want. Just be sure to also change the variable name at the beginning of the native code. We can now import it inside our Elm code and use it.

{% highlight elm %}
-- This is a normal Elm module
-- We are using the same Utils name but you don't have to
module Utils exposing (add)

-- Importing the native code
-- Beware, your code will compile even if you don't import it
-- but will crash at runtime
import Native.Utils

-- Creating an Elm function based on our native function
-- Just like before, you don't have to use the same name
-- but it's easier this way
add: Int -> Int -> Int
add =
  Native.Utils.add
{% endhighlight %}

This is a 200% danger zone. The Elm compiler is mostly like *"Oh, you are using native? Ok, I will fully trust you on what you are doing but don't complain if the world ends when your program crashes."* It means that the compiler will not perform any checks on types on any native function. For example, we could write:

{% highlight elm %}
module Utils exposing (add)
import Native.Utils

addInt: Int -> Int -> Int
addInt =
  Native.Utils.add

addFloat: Float -> Float -> Float
addFloat =
  Native.Utils.add
{% endhighlight %}

And it will work just fine. The compiler will not try to do any type inference on native code. It's totally up to you to make sure it will actually produce the expected result at runtime.

{% alert info %}
**Protip** This is why you should **always** add an Elm signature to your native functions by writing a corresponding Elm function which just call it directly. Just like we did, feel free to create several Elm functions with different signatures if your native function can handle them just fine. But **never** write code mixing standard Elm code with a native call in the middle of it, it will be a pain to understand its signature, it will be hard to debug and it will be easier to break at runtime.
{% endalert %}

That's it! You can now use your `Utils` module inside your Elm project.

{% highlight elm %}
module Main exposing (..)
import Utils

type alias Model = Int

init: Model
init = Utils.add 40 2
{% endhighlight %}

## Let's go crazy

Obviously, you can write code that bends the limitations of Elm. All Elm functions are pure and without any side-effect. Among other things, it means that given the same arguments, a function will always return the same result. That's why `Math.random` is a `Task`, because it isn't pure. Using `Native`, you can make it synchronous. We will see the example just below but never do that in your project, I just want to show you that it is possible.

{% highlight javascript %}
// File: Native/HackMath.js
var _username$project$Native_HackMath = function () {
  return {
    random: Math.random
  }
}()
{% endhighlight %}

{% highlight elm %}
-- File: HackMath.elm
module HackMath exposing (random)

random: () -> Float
random =
  Native.HackMath.random
{% endhighlight %}

{% highlight elm %}
-- File: Main.elm
module Main exposing (..)
import HackMath

type alias Model = Float

init: Model
init =
  HackMath.random() -- YOLO
{% endhighlight %}

## Tasks

Tasks are a huge part of any Elm program so it's very likely that at some point, you will need to create them inside Native code. This is super useful for wrapping async Node functions. We will use other Elm helpers to achieve that. The main one is `_elm_lang$core$Native_Scheduler` which is responsible for creating and finishing, either with a success or a failure, any tasks inside Native code.

First, we will call the `nativeBinding` method of the scheduler. This will actually create an Elm task. But we need to give it a function as its first and only argument. This function will take a callback that you should call when your task is finished. This is how you can handle asynchronous tasks. You must wrap the result inside either the `succeed` or `fail` methods of the scheduler.

Remember that Tasks are not only for asynchronous code. Any non-pure function, like `Math.random` or `Date.now`, should also be a Task.

{% highlight javascript %}
// File: Native/Utils.js
var _username$project$Native_Utils = function () {
  var scheduler = _elm_lang$core$Native_Scheduler

  function now() {
    return scheduler.nativeBinding(function (callback) {
      callback(scheduler.succeed(new Date()))
    })
  }

  function later(time, value) {
    return scheduler.nativeBinding(function (callback) {
      if (time < 0) {
        // We don't need to check that time is a number because
        // we will specify that it must be an Int in the Elm signature
        callback(scheduler.fail('First argument must be a positive integer'))
      } else {
        setTimeout(function () {
          callback(scheduler.succeed(value))
        }, time)
      }

    })
  }

  return {
    now: now,
    later: F2(later)
  }
}()
{% endhighlight %}

{% highlight elm %}
-- File: Utils.elm
module Utils exposing (now, later)
import Native.Utils
import Date exposing (Date)

-- We can use the `Never` type because we are never
-- calling `scheduler.fail` inside our Native code
now: Task Never Date
now =
  Native.Utils.now

later: Int -> a -> Task String a
later =
  Native.Utils.later
{% endhighlight %}

## The end

This is it for the basics. I will try to write another post about the syntax of the JavaScript compiled file next and about more advanced stuff.
