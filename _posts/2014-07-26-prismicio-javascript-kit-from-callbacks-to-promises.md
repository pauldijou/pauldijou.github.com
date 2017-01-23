---
title: "Prismic.io JavaScript kit: from callbacks to promises"
tags: [prismic]
---

### Holy cow, callbacks!

For the last (and only) website I did using prismic.io, I didn't want any back-end, all client-side, pure JavaScript man. This way, I could host it nearly anywhere for pretty much free (GitHub pages FTW). To ease stuff, I decided to use the [JavaScript kit](https://github.com/prismicio/javascript-kit) from the prismic.io team.

One choice they made and that I don't really like is using callbacks in it. For example, you have to write stuff like:

{% highlight javascript %}
// Get the current API
Prismic.Api('/my/awesome/url', function (err, api) {
  if (err) {
    // handle error
    return;
  }

  // Use the API there, retrieving documents
  api.form('articles').ref(api.master()).submit(function (err, articles) {
    if (err) {
      // Also error again
      return;
    }

    // But I also need authors...
    api.form('authors').ref(api.master()).submit(function (err, authors) {
      if (err) {
        // One more time, handle error
        return;
      }

      // Now I got all my data
      // I can finally display it on my page
    }
  });
}, 'my_token_far_below_at_the_end');
{% endhighlight %}

Can you see it? This ugly thing JavaScript experts name "callback hell"? And that's a super simple example. In 2014, the way to do that is using Promises. That's what's hype (and readable, and nice, and cool, and swag). But I quite understand why they made this choice. Promises are not native everywhere yet, so going with it mean either writing your own implementation or imposing an existing one. Fair enough to have callbacks in the kit then, but we are hackers here, we can override it to use Promises!

{% alert danger %}
  I will use the last spec Promise syntax, native way baby!, but it is really important to keep in mind that it has [a really poor support](http://caniuse.com/#search=promises) right now. You should probably be using a Javascript library as Promise implementation. I will link a snippet of code using the [Q library](http://documentup.com/kriskowal/q/) at the end of the article. But I wanted this article to be future proof.
{% endalert %}

### OMG, promises \o/

There are two main callbacks in the kit: when retrieving the API and when making a `submit`. What I want to write is something like:

{% highlight javascript %}
Api('/my/awesome/url', 'my_token_right_here_at_the_start')
  .then(function (api) {
    return Promise.all([
      api.form('articles').ref(api.master()).submit(),
      api.form('authors').ref(api.master()).submit()
    ]);
  })
  .then(function (data) {
    var articles = data[0];
    var authors = data[1];
    // Display the results
  })
  .catch(function (error) {
    // Handle error
  });
{% endhighlight %}

Sooooo much more readable and swag... Overriding the Api callback is really simple:

{% highlight javascript %}
// Remove the callback from the function signature
function Api(url, accessToken, maybeRequestHandler, maybeApiCache) {
  return new Promise(function (resolve, reject) {
    // Put a callback that will only resolve/reject the deferred depending
    // on the presence of an error or not
    Prismic.Api(url, function (err, resolvedApi) {
      if (err) {
        reject(err);
      } else {
        // Save point 1 (see below)
        resolve(resolvedApi);
      }
    }, accessToken, maybeRequestHandler, maybeApiCache);
  });
}
{% endhighlight %}

Overriding the `submit` call is a bit more tricky because it is a prototype function of the `SearchForm` object, which is totally hidden inside Prismic clojure. This is a bit (super) sad but we can deal with it by creating a fake form and not submitting it. The easiest way I found so far is doing it right after getting the Api. Let's add the following code at `Save point 1` (see previous code).

{% highlight javascript %}
// You might need a polyfill for 'getPrototypeOf'
// if you support old browser
var SearchFormProto = Object.getPrototypeOf(resolvedApi.forms('everything'));
// We are saving the original function so we can call it inside our override
var originalSubmit = SearchFormProto.submit;

// Let's override!
SearchFormProto.submit = function () {
  return new Promise(function (resolve, reject) {
    // As before, the callback will only resolve / reject the deferred
    // depending on the returned value
    originalSubmit.call(this, function (err, docs) {
      if (err) {
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
};
{% endhighlight %}

And after that, you just need to use the new `Api` function in place of `Prismic.Api`. You can see [the full code here](https://github.com/pauldijou/farewell/blob/9a744565d7/scripts%2Fapi.js#L8-L32) using `Q` library. This refers to a particular commit to ensure the line highlight is correct but you can freely switch to the master branch to see the most recent code (which shouldn't be much different... but who knows...).

Thanks for reading. Next time we will talk about responsive images inside StructuredText.
