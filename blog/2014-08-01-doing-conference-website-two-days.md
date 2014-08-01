---
title: "Doing a conference website in two days"
authors: [pauldijou]
layout: post
summary: 0
tags: [web]
---

Last week, on Wednesday, I had a meeting with some colleagues at [Movio](//movio.co) about the [Scala Downunder](http://scaladownunder.org) conference. It's a Scala conference in Auckland, New Zealand, with speakers from Typesafe and local ones, and some replay from Scala Days. I discovered that we were doing the website for the conference here at Movio, and also that it was due for the following Friday in order to send it to Typesafe for feedback.... Ah, and also I would be crafting it.

(Pssst... okay, there has been some commits on the repo after the deadline, but that's only because the schedule totally changed, not my fault!)

### Let's get started!

So, deadline is 2 days from now, the website is only one long page with all classic stuff: presentation, speakers, schedule, location and sponsors. Really good point: both the design and the content are nearly fully done. Otherwise, it would have been impossible.

My first step was to pick my tooling. I truly hate copy/pasting anything so it was out of question to copy/paste HTML when it comes to iterable data. I needed a static HTML website generator. Since the plan was to publish it on GitHub Pages, I choose [Jekyll](http://jekyllrb.com). This way, I would have the build for free, only needing to push on the `gh-pages` branch my source code (at the end, that didn't work at all, but Jekyll is still a good choice). Bootstraping with Jekyll is super fast as long as you already have Ruby installed on your machine.

Next I picked [Gulp](http://gulpjs.com/) as my build tool. I love both [Grunt](http://gruntjs.com/) and Gulp, but I'm trying to be more familiar with Gulp lately (at some point, I will switch to [Broccoli](https://github.com/broccolijs/broccoli) anyway). Here is one **important point**: you should have snippets for each Gulp (or Grunt) task ready somewhere so you can do your setup in minutes. For example, here, I wanted to use [LESS](http://lesscss.org/) as CSS preprocessor, [Browserify](http://browserify.org/) for JavaScript packaging and [BrowserSync](http://www.browsersync.io/) for live-reloading. I already got all those snippets, so I just needed to copy/paste them once in order to have my server running live and compiling all my assets.

### Be semantic with your content

Remember, what's the most important is your content, not the design nor the funky JavaScript effects. And don't try to rush to apply funny colors or amazing transitions before having a real content behind them or you might not see the real behaviour when implementing them. Since I already have it, I wrote only HTML during the first hour. It allows me to be 100% semantic with my content. I don't care about CSS selectors or whatever, if this is a paragraph, I create a `<p>` tag, if this is a section, let's use a `<section>` tag. And at the end, you can already see the 0.0.1 version of you website, fully "usable" (just a bit ugly, and tons of typos).

![downunder001](/blog/assets/2014-07-30/downunder001.png)

After that, I worked to all dynamic parts of my HTML. I really wanted to have full content before starting doing any LESS. I used the `_data` folder of Jekyll that allow me to structured data in YAML files. I put all speakers and schedule in it. After that, it's all about the [Liquid templating](http://docs.shopify.com/themes/liquid-documentation/basics) system to render it. You have `for` loops and `if` blocks, you have filers to render Markdown or whatever, for such a simple website, it was more than enough.

At this point, we are something like nearly half a day in the project and we have all the content and a nice setup allowing us to be super productive. It could have been faster, but there was quite some content to write and it took me a bit more time than planned to implement all my templating. That's cool!

### Do it with style

As you can image, the next step is doing all the website design. If possible, I prefer to write all CSS classes first, staying close to the HTML semantic and then implement them rather than inventing crazy CSS selectors and then bind them to your HTML. It's important to know what's your browser target. Because, trust me, you want to use `flexbox` but that means IE10+ (using a LESS mixins for old syntax). Lucky me, I could do that. If not, consider using a grid system.

When doing the design, never **ever** think "Oh, it looks already pretty good... I shouldn't be far away from the end". There is this [Pareto principle](http://en.wikipedia.org/wiki/Pareto_principle) that apply a lot to CSS in my opinion. It means that in just two hours, I had a decent design, but in the and, it costs me a full day to have the final thing. Why? Because after having done the main style, you will start testing on other browsers, on other devices, find small bugs, and spend way too much time to correct them. Also, at some point, if you can, you should review the website with the designer, and this is vital but sometime really hard. He will probably want to reach pixel perfection and nobody can blame him for that, take time and probably some refactoring, and also some hacks. At the end, you will have spent 20% of your time having a nice (but not perfect) design on Chrome, and 80% having a pixel perfect design on most modern browsers, being responsive, and having a decent fallback on old ones.

It was a pretty simple design so it was quite straightforward. Just remember you can do magic with pseudo-elements. I use them a lot for all those forms (circles, traits, ...). Flexbox is doing an awesome job to overcome old CSS limitations (Who said vertical align?) and being responsive. This way, I didn't have do use any open-source CSS project except for my reset, using the awesome [normalize.css](http://necolas.github.io/normalize.css/).

I also decided to use pure SVG rather than a font for my icons. This decision was based on reading great articles from Chris Coyier, like [this one](http://css-tricks.com/svg-sprites-use-better-icon-fonts/), [that one](http://css-tricks.com/svg-symbol-good-choice-icons/) and finally [this battle one](http://css-tricks.com/icon-fonts-vs-svg/). All worked fine.

### Finish the script

During the last half day, I focused on writing the small JavaScript needed for the website. There really wasn't much of it: double sticky navigation bar, nice scrolling between sections and modal panel for each talk description. Let's be honest, since I am targeting IE10+, I totally didn't need jQuery. But if you check the source code, you will find it. Why? I was starting to run out of time and I really wanted to use some nice plugins to leverage all the grunt work. Also, using one of the last version of jQuery, it will be fast enough and will not add too much of a payload. So... it's fine.

I finally had the chance to use [Velocity](http://julian.com/research/velocity/), a jQuery plugin for animations. It works just great, super fast even on mobile. You should try it. It powers both the scrolling and the modal animation. For the stick navs, I choose the [Sticky plugin](http://stickyjs.com/) which is simple and great. Nothing more to add. I packaged all that stuff with Browserify, but more because I love this tool rather than because it was needed.

### Going further

So, why didn't it work to only push to `gh-pages`? It did at first, but then I started to use more complex features with Jekyll 2.x and, guess what? GitHub Pages still use a 1.x Jekyll version, so it didn't match. Also, I wanted to do post generation stuff, like [usemin](https://www.npmjs.org/package/gulp-usemin) to minify all my assets and append then with a hash version, also updating the index HTML file. I just had to wrote a simple [deploy script](https://github.com/movio/scala-downunder/blob/master/_gulp/deploy.js) in order to overcome the problem.

I don't really want to go through all the details, but you can see the [final result](http://scaladownunder.org/), read the [full source code](https://github.com/movio/scala-downunder), and here are a few highlights:

* [integrate a nice Google maps](https://github.com/movio/scala-downunder/blob/master/resources/scripts/map.js) based on [Snazzy Maps](http://snazzymaps.com/) design.
* Diplay and hide [the modal](https://github.com/movio/scala-downunder/blob/master/resources/scripts/track.js) for talk descriptions
* [Package SVG icons](https://github.com/movio/scala-downunder/blob/master/_gulp/sprites.js), enjoy the [result](https://github.com/movio/scala-downunder/blob/master/_includes/icons.svg), use them [in HTML](https://github.com/movio/scala-downunder/blob/ee90ff5dbf/_includes/sponsors.html#L2-L4) and [style them](https://github.com/movio/scala-downunder/blob/ee90ff5dbf/resources/styles/global.less#L31-L36).
* Do [crazy templating madness](https://github.com/movio/scala-downunder/blob/master/_includes/schedule.html)

Hope you liked it! Thanks for reading.
