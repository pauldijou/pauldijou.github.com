---
title: "Prismic.io: when happiness met disappointment"
authors: [pauldijou]
layout: post
summary: 0
tags: [prismic]
---

### TL;DR

If you don't know about [prismic.io](https://prismic.io/), it's a nice tool providing both a super clean web interface to write content and an API to retrieve it. No front-end provided, eventually some kits to help you and some examples, but no more. Which is cool because, if you are a web developer, you can focus on crafting an awesome optimized website and then easily put some content in it... well, that's the theory...

But for me, after using it for a new website, as good as the idea can be, I find way too much limitations to consider it production ready. The team behind prismic.io is working on most of them so I really hope the implementation will become as awesome as its concept at some point in the future.

The rest of the article will focus on bashing all those limitations, so there will be way more bad than good, but don't get me wrong, prismic.io has tons of good stuff, and it's still in beta, I just want to talk about what I don't like in this article. And since I'm not all about trolling, I will try to consider how to solve them at the end. I will not explain what prismic.io is exactly, so I might be for the best that you quickly check their website before continuing reading. Enjoy.

### Do you remember how happy we were at the beginning?

I will never forget... it all started on this windy saturday... I was looking for a solution to create a new blog about traveling. I didn't want to use an all-in-one tool because I love crafting my UI from scratch, with exactly what I want on it (this point is super important for the rest of the story). I said bybye to Wordpress and all its friends. Some colleagues of mine told me about you... that you might be the future of content management, that I would be free for the UI, sounds like a perfect match, and so our adventure began.

I still can't believe how fast it all went... in a couple of hours, we were able to write new articles and display them in a custom website hosted in GitHub pages. Using one of your kits, it was so easy to query your API, retrieve the content as JSON and inject it inside Handlebars templates in order to render the final HTML. Oh man... it was so good.

### And then fictions appeared

A few days later, I wanted to go further, moving forward to more crazy stuff. I know that sometimes I try to do more or less complex features just for the fun of the challenge it provides me, but still, how could you do that to me... Remember this conversation?

* Hey Prismic.io, I would like to query documents that does not match this predicate
* Ahahah, you so funny, no way...
* Thanks! Wait... what? Why not?
* I don't have a `NO` operator or whatever close to it.
* Whyyyyyy? You have crazy operators like `similar` to retrieve similar documents based on God know which algorithm and you cannot do a simple negation?
* Nope. Deal with it.
* Okay... I think I can manage something if the query match this `OR` that. That's fine, right?
* No.
* Cool! Wait... what?
* I only have `AND` operators between predicates.
* You gotta be kidding me...

I was a bit sad, but I could manage it, retrieving too much documents and filtering client-side. Still, that was the starting point were all went wrong.

### My biggest mistake: using StructuredText

All contents in prismic.io must be typed. This is an image, this is a number, etc... A StructuredText is probably the most powerful type since it allows writers to enter complex content through a WISIWIG editor, using paragraphes, images, lists, embedded stuff, ... They can style it using bold, italic, and so on. It looks nice, right? So I decided to use it for the main content of my articles. Fair enough. As always, it was so great to have writers doing their own design using the editor, and so easy to render it automatically as HTML (except for some bugs here and there, but that's what pull request are for, isn't it?). At some point, I just wanted to have a lightbox on my images: clicking on them should expand it on full sized version with a caption. I don't know for you, but for me, this is a really basic requirement and you should be able to do it in less than 2 hours.

First problem: I wanted to tag images that should have lightbox with `[data-lightbox]` HTML attribute, all images didn't need one. Since I was using the JavaScript kit to render my HTML, I couldn't do that in any way. There is no way to add custon rendering or plugins in the HTML renderer from the kit. Dammit. So I rewrite the full renderer so I could customize it... Wait, how can I indicate which image has a lightbox and which hasn't inside a StructuredText? Oh, right, I just can't. Inside a StructuredText, you can only drop raw images and resize them, that's it. Does that mean I cannot put nor caption or title? Yep, no way to do it. So I started to hack: if after an image, the following paragraph would begin with `[caption]`, the image would be a lightbox, the content of the paragraph would be its legend, and the paragraph itself would be removed from the final rendering.

Guess what? Writers didn't really like having to manually write `[caption]`, they wanted a nice UI to do that... but that was just impossible... They throw some tomatoes at me and we tried to move on but we couldn't... Solving one problem to discover a new one: when you define a type `image` in a Document, you can tell that it will have different sizes: one for desktop, one for tablet and one for smartphone for example. And that's awesome because you can fully optimize for mobile, which is super important nowadays. Do you think you can do that with image inside StructuredText? Indeed, the answer is no! Once again, a great idea no fully supported. Is there a workaround? Sadly, no easy one. You can upload the same image several times, one for each size, then find a way to retrieve its generated ID by prismic.io and use the same hack as `[caption]` to specify it and hack a bit more the HTML renderer. I couldn't find the courage to do it... pretty sure tomatoes would have been replaced by rocks from writers. I can only hope my mobile users have 4G now.

Want more? No biggy, I have tons of stories like that. A writer wanted to have blockquotes: a whole paragraph should be displayed in a custom design and have an author. I had to kill him really fast and bury his body deep. Another one wanted semantic distinction between paragraphs, something like: this one should be red and this one blue just because. Thrown him into a bucket full of piranhas. At some point, a writer became a madman and deleted half of documents... no way to find him since the delete operation does not appear in the timeline. But who cares? I mean, the document is gonne anyway. I18N, do you speak it? I hope not because there is [no support for it... yet](https://qa.prismic.io/29/will-multi-lingual-sites-be-supported-in-the-future). Want to put some tables? Could you please [stop joking](https://qa.prismic.io/25/how-do-we-best-support-tables), it hurts me to laugh so much. Want do  [manage hundred of images](https://qa.prismic.io/55/improve-the-media-library) in the media library? Might be less painful to jump from the top of the [Eiffel tower](http://en.wikipedia.org/wiki/Eiffel_Tower). And so on, and so on...

### I never though you would mask it from me...

One core concept in prismic.io is Document Mask. Each document must have one and it represents its pattern, how it will be persisted in prismic.io database and how it will be served by the API. So you start creating masks, easy. It directly provides a slick UI for writers to enter content. Nice! And at some point, you realize you could have done better, the mask can be improve. Just don't do that, keep going with your broken mask, trust me!

Let's say you don't trust me (that's fair enough, you don't even really know me). If you rename any property of the mask, you are screwed. The new property will be empty since it doesn't consider it a renaming but the suppression of the previous property and the creation of a new empty one. But you are super courageous, so you migrate all your documents to the new property, yeah! Now you have duplicate a property in your API. Hell yes! Just check the raw JSON, you will see the new property (thanks God) but also the old one. Properties just keep adding, prismic.io never forget... **never!** Your payload will just increase. And be sure that your front-end developers always only rely on the mask definition, never on the data from the API, because... it doesn't mean anything anymore.

### My heart was so fragmented...

So, let's summarize what's the biggest problem with prismic.io: you can only do what the tool allow you to do. And right now, it allows you only super basic features. Which are needed obviously, but when you go to the real world, you know, outside of the matrix, those are just not enough. Imagine being Mario, you need to save the princess but you can only move forward, no jump, no strange mushroom, no yoshi... Good luck! Direct consequence, the killer feature that would make prismic.io really powerful, in my humble opinion, is what I will call "custom fragments". The idea is to allow developers to create their own type of fragments and plug them both in the UI of the writing room and in the HTML renderer. That might sounds a bit challenging but it isn't that hard in fact.

So first, how to create a custom fragment? Let's use the mask system. When defining a document, you are creating a mask saying "this document will have an image and some text as title". Why not doing the same for custom fragments? Remember the lightbox problem? I would create a custom fragment `lightbox` which is composed of an image and some text as its caption. Even better, since I am now using a real `image` type, I can specify several sizes for the image. Big win here.

Next, inside the writing room, how to render a custom fragments? Well, you already know how to render all its pieces, just group them together with an indentation or a left border or whatever. The `lightbox` fragment would be an image selector and a text input. Of course, you should be able to put a custom fragment both inside a document (like any other fragment) and inside a StructuredText if possible (just like you are allowing `em` or `h2` inside a StructuredText)

~~~ javascript
// Let's define our custom fragment for lightbox,
// just the same syntax as a Document Mask
{
  "title" : {
    "type" : "Text",
    "fieldset" : "Title",
    "config" : {
      "placeholder" : "A short caption for the image"
    }
  },
  "image": {
    "fieldset" : "Image",
    "type" : "Image",
    "config" : {
      "thumbnails" : [ {
        "name" : "Icon",
        "width" : 100,
        "height" : 100
      }, {
        "name" : "Column",
        "width" : 320,
        "height" : 320
      }, {
        "name" : "Wide",
        "width" : 600,
        "height" : 300
      } ]
    }
  }
}
~~~

Finally, each kit should have a `renderFragment(type, json => html)` method that allow you, for a specific fragment type (here `lightbox`), to pass a function that know how to render the final HTML from its raw JSON. Hey, we can do even better, let's add a second argument to the rendering function, this one will be the original rendering function for "native" fragments in prismic.io. This way, you can override just one or two "native" fragments. For example, if you want to render `image` with a `<picture>` HTML tag because that's super hype. Just do something like:

~~~ javascript
// Define how to render you custom fragment
// from JSON to HTML (which is a String)
kit.renderFragment('lightbox', function (json) {
  var html = '<img src="';
  html += json.image.url;
  html += '" data-lightbox title="';
  html += json.title;
  html += '">';
  return html;
});

// Override an already existing fragment
kit.renderFragment('image', function (json, original) {
  var html = '';
  html += '<picture>';
  // Keep it easy, only one source...
  // Anyway, we only have one url from the JSON :-(
  html += '<source src="' + json.image.url + '">'
  // Fallback using the default renderer
  html += original(json);
  html += '</picture>';
  // And the alt text
  html += '<p>' + json.image.alt + '</p>'
  return html;
});
~~~

And that's it! You just solved so many limitations...

### I didn't understand your semantic anymore...

Ok, next step. Inside a StructuredText, I need to have semantic distinction between fields of the same type. This paragraph is *important*, this one is *a blockquote* and all the rest are *normals*. Let's go the easy way: I just need a hash of key -> value, as strings, to reach a limitless world. This way, I could tag one paragraphe `important: true`, and another with with both `blockquote: true` and `author: Someone`. At last but not least, expose it in the API:

~~~ javascript
// Since all fields have a common structure to expose their type
// it's easy to have a new key like 'attributes' at this level
// to expose the semantic hash
// (btw, it would be cool to map to primitives rather than only string for values)
{
  "type": "paragraph",
  "text": "bla bla bla...",
  "spans": [],
  "attributes": {
    "blockquote": true,
    "author": "Someone"
  }
}
~~~

I have no idea how to integrate that in the UI of the writing room, but I know its designer, he will figure out something awesome, no doubt.

By adding that, you leverage tons of possibilities for developers to customize the rendering of a StructuredText without any heavy hack. Writers would still need to manually write each key name, but its way better than paragraphs starting with `[caption]` or `[author]`. Following a snippet on how to render a blockquote, using the previous `renderFragment` method of course:

~~~ javascript
kit.renderFragment('paragraph', function (json, original) {
  if (json.attributes.blockquote) {
    var html = '<blockquote>';
    // Previously private (at least in the JavaScript kit),
    // I hope this method will be available in all kits
    // it applies all span styles to the raw text
    html += kit.insertSpans(json.text, json.spans);
    html += '<footer>';
    html += json.attributes.author;
    html += '</footer>';
    html += '</blockquote>';
    return html;
  } else {
    return original(json);
  }
});
~~~

### Let's break up

I could say more, but since it's a miracle that you are still reading and it would not be as relevant as what I already said, I will stop here.

My conclusion so far: prismic.io is not ready for the real world and for real websites but there are a lot of work going on by its team so, as they say on half of their responses: stay tuned! It might become super awesome at some point (I hope it will).

Thanks for reading! See you soon for more hacky coding posts.
