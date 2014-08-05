---
title: "BrowserSync proxy in top of a Play Framework server"
authors: [pauldijou]
layout: post
summary: 0
tags: [play, browserSync, gulp, tooling]
---

### TL;DR 'coz I'm a h4k3r

Full source code of the demo is [on GitHub](https://github.com/blogsamples/play-browserSync) with a nice and simple README on how to bootstrap the project.

### What are you talking about dude?

[Play Framework](http://www.playframework.com) is an HTTP server written in Scala. It is super cool and you should probably give it a try. Let's stay you are using it, you really enjoy how productive it is, only having to refresh your browser to see all your code modifications, but you want to go further, you want live-reloading! There are several tools doing that.

Introducing [BrowserSync](http://www.browsersync.io). It provides 2 killers features. One is live-reloading: it can monitor resources, and when it detects some modifications, it will reload the browser page to load them. Even better, if possible, it will hot deploy them, meaning they will be loaded without reloading the page. That's the case for CSS files which are loaded and the page repainted to display the new design without any refresh. The second one is to keep synchronized several browsers across devices. And we are not talking about resources only but about all user actions. If you scroll on one browser, it will scroll on all connected browsers, same for clicking on a button, and so on...

Let me say it again with a concrete example. You are on your computer, one screen with your source code, another one with Chrome opened and a last one with Firefox. You also have an iPad tablet and an Android smartphone connected to your computer. All of those have your application main page opened. Each time your edit your code, they will all reload and display the new result (hot deploy in case of CSS). When you are ready to test interactions, you just go to, let's say, your Chrome browser and start scrolling and clicking. All your screens will start moving and doing the actions everywhere. Talk about increasing productivity!!

What about assets that require compilation? Such as SCSS, LESS, Stylus, CoffeeScript, etc... No biggy bro, we have you covered. In this demo, we will use [Gulp](http://gulpjs.com/) to monitor those resources, compile them, and pass them to BrowserSync for live-reloading (obsviously not losing the hot deploy if possible). You can freely use whatever build tool you want, be it Grunt, Broccoli, ...

### Magic proxy

BrowserSync could be use as the web server, that's the easiest way to use it, and I'm actually doing it when my Play server is only here to provide a REST API. Consider doing that when you don't need Scala templates or when you cannot use them (for example if you want to embed all your standalone HTML files inside a Cordova / PhoneGap application).

But here, we want to use Play as the web server, meaning it will be responsible to serve all our assets: HTML, CSS and JavaScript. For that, we will need to use the `proxy` feature of BrowserSync. Long story short, it will start another web server, on its own port, and will display the exact content from the Play server but adding a bit of JavaScript magic in it so it can enable all its features. It is just like opening your Play application, just on a different port. By default, you would use the port `9000` for Play, in this demo, we will set the proxy on port `9001` (it would have been around `3000` by default, but I didn't want anyone to freak out so I put it as close as possible to Play default one).

We also want to live-reload some of our resources. I kept it simple for this demo, but you are free to add as many as your want. We will use the `files` property of BrowserSync configuration and set and array of files to monitor (it supports wildcards). Here, we are monitoring all CSS files from `public/stylesheets`, JavaScript files from `public/javascripts` and HTML files from  `app/views`. There are two important point to notice here. First, we are referencing files based on their path on the source code, not on their actual url. For example, `public/stylesheets/main.css` will be served by Play as `assets/stylesheets/main.css`, but BrowserSync only needs to know the real path, after that, you can map it to whatever url you want. Second, we are monitoring Scala templates, and it's fine because when BrowserSync will detect a modification, it will reload the page, and Play will re-compile the template before serving it, so it will display the new version. It works just fine with both `run` and `~run` , the latest being faster.

Here is a super small configuration for BrowserSync to enable such a proxy. You can read the [online documentation](http://www.browsersync.io/docs/options/) to extend it.

~~~ javascript
var browserSync = require('browser-sync');

browserSync({
  // By default, Play is listening on port 9000
  proxy: 'localhost:9000',
  // We will set BrowserSync on the port 9001
  port: 9001,
  // Reload all assets
  // Important: you need to specify the path on your source code
  // not the path on the url
  files: ['public/stylesheets/*.css', 'public/javascripts/*.js', 'app/views/*.html'],
  open: false
});
~~~

### What about compiled assets?

Right... right... there are assets that you cannot serve directly, you need to preprocess them. The easiest way to do that is using a build tool, just pick one among the best ones (Gulp, Grunt, Broccoli, Brunch, ...) and enjoy. There is a really simple separation of concern here: the build tool only manage assets that are not served directly (LESS, CoffeeScript, ...) and compile them into assets that are actually handled by BrowserSync (CSS, JavaScript, images, ...) which then live-reload them.

It's so easy that it's nearly frustrating. In the demo, the `main.css` file is generated from `main.less`. I have two Gulp task to handle that: one for compilation and one to monitor any modification.

~~~ javascript
var gulp        = require('gulp');
var less        = require('gulp-less');

// Registering a 'less' task that just compile our LESS files to CSS
gulp.task('less', function() {
  return gulp.src('./resources/less/main.less')
    .pipe(less())
    .pipe(gulp.dest('./public/stylesheets'));
});

// Let's watch our LESS files and compile them at each modification
gulp.task('watch', function () {
  gulp.watch(['./resources/less/*.less'], ['less']);
});
~~~

### Wait, where are sbt-web and webjars?

Yeaaaaah... so lately, Play has introduced all those stuff on managing assets using SBT, some plugins and webjars. It works just fine but for me, it's just as strange as if I would install Play from NPM. It's cool if people want to try to merge two super different worlds (front-end and back-end), be it Node.js or scala.js, but I'm totally not ready for that. As a full stack developer, I want to enjoy each world with it own ecosystem, not trying to bend one into the other.

That's why in all my projects, front-end assets are handled by front-end tooling (mostly Gulp and NPM lately) and my back-end resources by back-end tools (SBT, Ivy, Maven, ...). Not only do I get the best of each, but I do not have some limitations. For example, the other day, I came across a bug on a JavaScript library I was using. No biggy: fork the repo, correct the bug, do a pull request. And while waiting for the author to merge it (which can take some time), I am free to directly use my fork inside my `package.json` so it's not blocking at all. It tooks me less than an hour. I would be curious on how to do that using webjars? Anyway, sorry for not planning any proof of concept using webjars if that's what you are using.

And that's it! As I said at the beginning of the article, the demo is [on GitHub](https://github.com/blogsamples/play-browserSync), feel free to clone and play with it. Enjoy and thanks for reading.
