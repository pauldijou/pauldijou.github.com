---
title: "News about RichFaces Bootstrap"
authors: [pauldijou]
layout: post
summary: 0
tags: [richfaces, bootstrap, jquery]
---

### What's new in RichFaces Bootstrap?

{:.alert.alert-danger}
  **Red Alert!** The RichFaces Bootstrap project is still under heavy development, tag and attribute names can change at any time and if you find something missing or buggy, there is high chance it's not a bug but just hasn't been done yet (... or it's a real bug). So only use it for fun and prototype purposes.

**Semantic components** are a brand new concept. I need to present it first so I can use it when talking next about the new components. Most of the time, for one JSF tag, you have one and only one HTML renderer, it's a oneToOne relation (according to JSF naming convention). It seems logical: for one component, you should always have (nearly) the same generated HTML code. But with HTML5, the web is becoming more semantic and that's good. Why not have the same with RichFaces? But before we dive into it, what is "semantic"? For a real definition see [Wikipedia](http://en.wikipedia.org/wiki/Semantic_Web) but here, we will say it's when a component serves a global purpose like being a header or a footer but shouldn't always render in the same way, instead the rendered result should depend on the context (like a table header isn't the same as a column header).

With RichFaces, a semantic component is a component **with no renderer**! Yeah yeah, if you use a semantic component on its own, it will throw an exception because it doesn't know how to render itself. The concept is that a semantic component will ask its parent in the JSF tree: "Hey dad, do you know how I can render myself?", if it knows, the parent will provide the correct renderer to the semantic component which will render it, otherwise, the semantic component will ask one level higher the same question, and so on until the root element. If no one answers yes to the question, it will throw an exception. That means we also have components that accept semantic components in order to provide them the correct renderer.

Let's take a concrete example. The **modal** component in RichFaces Bootstrap can support 3 semantic components: a header, a body and a footer. You can see that by looking at which interfaces the `AbstractModal` implements (see [GitHub](https://github.com/richfaces/sandbox/blob/develop/bootstrap/ui/src/main/java/org/richfaces/bootstrap/component/AbstractModal.java#L49)). All interfaces with the syntax `Render{1}Capable` are components that support the semantic component `{1}`, so here, it's **headerFacet**, **bodyFacet** and **footerFacet**. And if you look at the rest of the code of the `AbstractModal`, you will see methods with the syntax `public String get{1}RendererType()` which are the methods giving the right renderer to use by semantic components. Inside a **modal**, the **headerFacet** component will render as a `div class="modal-header"` according to [the renderer provided](https://github.com/richfaces/sandbox/blob/develop/bootstrap/ui/src/main/templates/org/richfaces/bootstrap/modalHeaderFacet.template.xml) by the **modal**. But inside another component, it could have been totally different HTML code.

{:.alert.alert-info}
  **Pro tip** If you take a more accurate look to all current semantic components, you will see that they all follow the same syntax: first their purpose (like **header** or **footer**) and then a generic **Facet** suffix. That give us the full list of semantic components: headerFacet, bodyFacet, footerFacet, menuFacet and positionFacet. Why using a suffix? Because we want to keep the no-suffix name for the real HTML tag. The RichFaces **header** tag will always generate the HTML **header** tag like a classic JSF tag (the oneToOne relation) but the **headerFacet** tag is a semantic component so it can generate anything depending of the context. Also, it makes it easier to see if a RichFaces component is a semantic one or not by just looking at its name.

{:.alert.alert-danger}
  **Warning** Even if the suffix is **Facet** keep in mind that semantic components **are not facets**, they don't have the same limitations: they have attributes, you can use the same semantic component several time inside the same parent, a semantic component doesn't have to be a direct child of a component supporting it and a semantic component can have several children.

Now, let's dive into the new components. [input](http://bootstrap-richfaces.rhcloud.com/component/input/) tag is a basic input with all Bootstrap features like prepend and append and several new attributes in order to support new HTML features. By the way, this **input** centralizes and supports all HTML5 input types, you will no longer need one JSF component for each type, just use the `type` attribute (default is "text" of course).

[modal](http://bootstrap-richfaces.rhcloud.com/component/modal/) is like `rich:modalPanel` or `rich:popupPanel`, it will display a popup layout on top of your page, potentially covering your page with a dark layer to block any action outside of the modal. The default usage of the modal has a header, specified by using `header` attribute or `header` facet, a footer specified with `footer` facet and a `body` which will be the code inside the modal component. Concretely, what's happening is that each part, header - body - footer, will be wrapped inside a `div class="modal-xxx"` where "xxx" is the name of the section in order to align with the Bootstrap syntax. Using footer as a facet might be limiting because you cannot have **a form inside the modal** wrapping both body and footer because footer, as a facet, will always be outside. The default usage should be **the modal inside the form** since you will probably not need several forms inside a modal most of the time.

What if that isn't enough? What if you do want the form inside and not outside? Even if this behavior should be enough in most of use-cases, you can still fully customize your modal the way you want! The moment you use one of the following semantic components, headerFacet - bodyFacet - footerFacet, it considers you are doing a custom modal and it will not generate the `div class="modal-xxx"` anymore. I'm talking about the modal itself. Because the semantic components will generate the corresponding `div`. However using real components and not facets will allow you to put both bodyFacet and footerFacet inside a form for example.

[tooltip](http://bootstrap-richfaces.rhcloud.com/component/tooltip/) and [popover](http://bootstrap-richfaces.rhcloud.com/component/popover/) are two new ways to display bonus info when the mouse moves over particular content. The first one is for small texts and labels only, the second one can support custom content and a title. Right now, content can only be text but we are planning to improve this.

{:.alert.alert-info}
  **Pro tip** Even if **popover** content only supports text, you can still put some light HTML in it. You just need to escape chevrons with `&lt;` and `&gt;`.

Finally, "orderingList":http://bootstrap-richfaces.rhcloud.com/component/orderingList/ is the new RichFaces ordering list to allow you to re-arrange the order of some items. It already supports single drag-and-drop, multiple selection and "table" layout. Next features will be multiple drag-and-drop, maybe keyboard selection using SHIFT (CTRL is already supported). Thanks to Brian work, it is the first component mixing the power of the jQuery UI widget factory with Bootstrap design. If we can do it once, we can do it for lots of other widgets!

New EL functions are also there. [jQuery](https://github.com/richfaces/components/blob/develop/misc/ui/src/main/java/org/richfaces/function/RichFunction.java#L156) and [jQuerySelector](https://github.com/richfaces/components/blob/develop/misc/ui/src/main/java/org/richfaces/function/RichFunction.java#L126) are part of RichFaces Core but have been created to help RichFaces Bootstrap. They will allow you to retrieve a jQuery object or the jQuery selector from a server-side JSF id.

Next are more [specific Bootstrap EL functions](http://bootstrap-richfaces.rhcloud.com/component/el/). If you have take a look at Bootstrap JavaScript API, you might have noticed that lots of JavaScript components have a set of functions with the following syntax: `$(sel).compName('singleParameter');`, like for example: `$('#myModal').modal('show');` for a **modal**. The first approach to use it in JSF component was to use the previous **jQuery** function like: `onclick="\#{rich:jQuery( 'myModal' )}.modal('show')"`. It works fine but obviously, that wasn't enough for Lukas since he built a different approach from scratch.

The new concept is that the `compName` part of the call is nearly useless if you can retrieve it from the component returned from the jQuery call. In the previous example, if you know that `\#{rich:jQuery('myModal')}` is actually a **modal** component, then you also know that you will have to call the **modal** function, only remains with importance the **singleParameter**. So here is the new syntax: `\#{b:singleParameter(sel)}`. The previous example becomes: `onclick="\#{b:show('myModal')}"`. Much more concise and readable, isn't it? Right now, RichFaces Bootstrap supports **show**, **hide** and **toggle** functions but others will follow soon.

{:.alert.alert-info}
  **Pro tip** Want to know how the EL function retrieves the name of the component? Easy. When the selector will be used to find the JSF component, it will find a **UIComponent** (like a **UIModal**) which, according to RichFaces CDK design, will extend an **AbstractComponent** (like [AbstractModal](https://github.com/richfaces/sandbox/blob/develop/bootstrap/ui/src/main/java/org/richfaces/bootstrap/component/AbstractModal.java)). And if the **AbstractComponent** supports Bootstrap EL functions, it will be annotated with `@BootstrapJSPlugin` (like at [line 43 of AbstractModal](https://github.com/richfaces/sandbox/blob/develop/bootstrap/ui/src/main/java/org/richfaces/bootstrap/component/AbstractModal.java#L43)) and it's the `name` attribute of that annotation that will give us the `componentName`. As I told you, really easy!

**LESS support** is no longer a dream (for those who doesn't know LESS, it's a more powerful way to write CSS, see the [project website](http://lesscss.org/) for more infos). Thanks to Lukas' awesome work, a first prototype of that feature is already working. You can [read his post](http://rik-ansikter.blogspot.fr/2012/08/jsf-meets-skinning-awesomeness-of-less.html) to know more about that. There is still work to do but it's an incredible starting point.

### What's coming?

Want more? Great, because we have tons of other plans to improve RichFaces!

**New build design** is currently under [discussion on RichFaces wiki](https://community.jboss.org/wiki/RichFaces43BuildRedesign) so be sure to take a look and give feedback if you care about the future of RichFaces.

**Theming all current components** from RichFaces Core with Bootstrap design is planned so you can use both projects at the same time.

The orderingList is just a beginning. **More jQuery UI widget factory based components** are incoming. Feel free to comment [here](https://community.jboss.org/thread/200343) to propose the ones you would like to see supported in RichFaces Bootstrap.
