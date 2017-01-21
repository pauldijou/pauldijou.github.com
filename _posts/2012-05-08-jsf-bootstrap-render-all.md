---
title: "JSF, Bootstrap and calling render=@all"
tags: [jsf, bootstrap]
---
### The problem

So, the other day, I was playing with [Twitter Bootstrap](http://twitter.github.com/bootstrap/index.html) on a JSF application. Everything was fine until I decide to use a `render="@all"` somewhere in the page in order to refresh all my components after quite an heavy operation. Working fine.

But Bootstrap was no longer fully healthy. The CSS and design were ok, but the JavaScript was all broken : nearly all effects didn't appear anymore. It was a bit strange so I hit F5 and everything was fine, all JavaScript events were back. But the moment my `render="@all"` was called, they disappear again.

### Why?

After some investigations, the reason was that Bootstrap calls a JavaScript function that will attach most of its events to the `<body>` when the HTML DOM is ready. Its doing so in order to catch all user interactions when they bubble up to the `<body>` tag which wrap the whole page. With that, you can use Ajax as much as you want and update your DOM since there is no event attach to a particular HTML tag, they are all in the `<body>` tag.

That's really good but that's also the reason of the problem. I said Ajax is always fine, and it's true as long as you don't touch the @<body>@ tag. The moment you update this tag, it will probably be reset to it's initial state, without any JavaScript event, and since the Bootstrap JavaScript function is only called once when the DOM is ready the first time, JavaScript events will not come back. Guess what, `render="@all"` will render your `<h:body>` and so will broke all Bootstrap JavaScript events.

### A workaround

The true solution would be to call the Bootstrap JavaScript function after each `render="@all"` in order to attach all JavaScript events again. But since I have no idea how to do that right now, I have chosen to use an easier workaround.

Just wrapping your whole page in a JSF panel and render it instead of `render="@all"` should be enough in most use case. It is not exactly the same behaviour, but in most case, when calling `render="@all"`, what you really want is just refreshing your whole page using Ajax. For example:

{% highlight markup %}
<!DOCTYPE html>
<html lang="en-US"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:h="http://java.sun.com/jsf/html"
      xmlns:f="http://java.sun.com/jsf/core"
      xmlns:ui="http://java.sun.com/jsf/facelets">
<h:head>
    <title>Site title</title>
</h:head>
<h:body>
    <h:panelGroup id="all">
        ... your code...
    </h:panelGroup>
</h:body>
</html>
{% endhighlight %}

And replace all your `render="@all"` with `render="all"`.
