---
title: "Prismic.io: responsive images inside a StructuredText"
authors: [pauldijou]
layout: post
summary: 0
tags: [prismic]
---

Once again, I will not explain what [prismic.io](http://prismic.io) is (but it's a tool to manage your website content), I will only focus on one limitation and how to solve it. If you don't know about prismic.io, you should quickly check its website before reading any further.

### What's the problem?

In prismic.io, you are creating Documents which are composed of Fragments. A fragment is data organized in a more or less semantic way. For example, a fragment can be a Number, or a Date, ... Among them, there is the type Image which is really nice because you can not only fully resize / crop your raw picture, but also add smaller images based on the original one for responsive purpose. You can upload your awesome photo of this beautiful sunset, fully sized at 4000 x 3000 pixels, resize it for desktop at 1920 x 1080, and finally add a mobile version at 320 * 480. Note that the last one doesn't respect the ratio at all, but that's the goal: you are creating a subset of your image with the best match possible regarding the targeted screen.

Another really powerful fragment in prismic is the StructuredText. It allows you to have a nice WISIWIG editor inside which you will put new fragments (paragraphs, links, titles, images, ...). It would be perfect if the image fragment inside a StructuredText was a real Image fragment, but it is not. You cannot specify any thumbnail. Meaning your content cannot be responsive at all. Your choice is: consume all the bandwith for mobiles with awesome full HD images or make the eyes of your desktop users bleed with super compressed images.

### You don't want to do that!

And me neither! I want to have responsive images inside my StructuredText for God sake. I love tools which make my life easier, but they never should stand on my way to craft the best website possible. I will not lie to you, I couldn't find any solution that integrates nicely with the WISIWIG editor since there is no way to extend it. The following solution will be a bit of hacking and your writers might complain about it at first.

So, what's the idea? The only way to have responsive images is to use a real Image fragment, no choice here. So let's create one, and let's put it inside a Group fragment. This way, you can add and remove as many images as you want and they will all be responsive. Wait, you can't do that inside the StructuredText, right? Indeed, that's why we will do outside of it and then find a way to bring back the images inside of it. Here is the mask for such a group:

~~~ javascript
"Images" : {
  "images" : {
    "type" : "Group",
    "fieldset" : "Images",
    "config" : {
      "fields" : {
        "name" : {
          "type" : "Text",
          "config" : {
            "label" : "Name"
          }
        },
        "caption" : {
          "type" : "Text",
          "config" : {
            "label" : "Caption"
          }
        },
        "image" : {
          "type" : "Image",
          "config" : {
            "thumbnails" : [ {
              "name" : "mobile"
            }, {
              "name" : "tablet"
            } ]
          }
        }
      }
    }
  }
}
~~~

{:.alert.alert-info}
  **Pro Tip** - When creating thumbnails for an Image fragment, the [offical documentation](https://developers.prismic.io/documentation/UjBeuLGIJ3EKtgBV/repository-administrators-manual#document-masks) states that both width and height are mandatory. This is **wrong**, you can specify only one of the two or even none of them. Your UI might be a bit ugly (the resized thumbnails will only display after saving your draft) and sometimes you will have to click twice on a button (this one, I really don't understand) but otherwise, it works just fine. I hope prismic guys will make those attributes optional because... well... how can you anticipate how the writer wants to resize its image?

As you can see, I added two more fields. One is `name` and we will use it to reference our images inside the StructuredText. The other one is `caption`, that's because I want to put one on my images but prismic didn't allow me to do that at all by default. Thanks God, using this solution, I can finally do it, killing two birds with one stone. Now we can add as many responsive images as we want, yeah! Let's grab some orange juice to celebrate!

### Let's hack some HTML

As I already said it, the next step will be to bring those images inside the StructuredText. We cannot do that directly inside the WISIWIG editor but we can do it when rendering the final HTML. We will need two more things here:

* having a placeholder inside the StructuredText to indicate we should insert an image
* extend the default HTML renderer to support such placeholder

As for the placeholder, I decided to use a simple format like `{image-[name of the image]}`. Meaning that if the content of a paragraph inside my StructuredText is `{image-sunset}`, it will actually render the image named `sunset` from the group of images when generating the final HTML. Pretty easy right? Your writers might find it ugly, having to write those strange tags, and not seeing their images directly inside the StructuredText, but just tell them that's for the gretter good. You could, of course, use another syntax, eventually support attributes, whatever.

The final task, and probably the hardest one, is to extend the HTML rendering system. Each primisc fragment has its own way to render as HTML. Unfortunately, there is no way to extend it, you can only, eventually, override it. And the one for StructuredText is by far the most complex one. The easiest way to do that is to copy/paste the default one from the kit you are using (if you are not using any kit, you are free to do whatever you want, so it's fine) and edit it. You will then edit the part responsible for rendering a paragraph, test if its content match our placeholder syntax, if so, render an image, if not, just render the text as it is. Since I'm using the JavaScript kit, here is the [full copy/paste](https://github.com/pauldijou/farewell/blob/9a744565d7e66f06aa9a3edf7e360db0f00c70aa/scripts/prismic.js#L65-L159) but that's the [important part](https://github.com/pauldijou/farewell/blob/9a744565d7e66f06aa9a3edf7e360db0f00c70aa/scripts/prismic.js#L105-L117) where we are rendering the image. My `model` is actually a JavaScript class extracted from the original prismic Document, but you could use the raw Document of course.

### Conclusion and limitations

That's pretty much it. Here is a quick summary of what to do:

* inside the mask, add a Group of Images with, at least, a Text fragment for the name.
* choose a naming convention to write placeholders inside a StructuredText, ex: `{image-[name]}`
* override the StructuredText HTML rendering function with a custom one inserting images from the Document when finding a placeholder
* you can add more attributes and render them (like a caption)

What are the bad points / limitations of the solution?

* writers need to write placeholders rather than having a nice UI to insert images
* images do not display natively in the WISIWIG editor anymore
* you cannot re-order a Group fragment right now, meaning images will be sorted based on their created date and not on their place inside the StructuredText
