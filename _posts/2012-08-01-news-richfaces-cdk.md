---
title: "News about RichFaces CDK"
tags: [richfaces, cdk]
---

### RichFaces CDK new features

As the RichFaces Bootstrap project grows, we need more tools to achieve new goals and keep the code clean and readable. More tools means a stronger CDK and here are the last features.

**Fragments** are small portions of code inside the template that are defined outside of the main implementation but can be called inside it or inside other fragments or even inside itself! Say hello to recursion in RichFaces CDK templates. In term of Java, fragments are methods. So when you write a fragment, it will generates a Java method in the final renderer. Knowing that makes fragments really easy to understand and to use. See the [JIRA issue 12226](https://issues.jboss.org/browse/RF-12226) for a fully explained example.

{% alert info %}
  **Pro tip** Notice that in the signature of the generated Java method, 3 arguments are always passed without having to specify them inside the template : ResponseWriter, FacesContext and UIComponent.
{% endalert %}

{% alert danger %}
  **Warning** Currently, if you want to use a fragment1 inside a fragment2, you need to write fragment1 first in your template so its signature has been parsed before calling it in fragment2. Problem is reported in [JIRA issue 12326](https://issues.jboss.org/browse/RF-12326).
{% endalert %}

`cc:renderFacet` is a new tag you can use inside a CDK template, equivalent of the same tag from JSF composite component. Its usage is quite straightforward: it will render the facet that you will specify in the `name` attribute. If you put some content inside the tag, it will be used as default value in case the facet is missing. See [JIRA issue 12260](https://issues.jboss.org/browse/RF-12260) for full description.

`varStatus` is a new attribute for the `c:forEach` CDK tag. It will perform the exact same thing as the one in the original `c:forEach` tag, giving you more tools inside a forEach loop. See [JIRA issue 12232](https://issues.jboss.org/browse/RF-12232).

**wildcard** can now be used inside `cdk:passThrough` and *cdk:passThroughWithExclusions* attributes in order to pass all attributes starting with the same prefix. Especially useful with JavaScript events `on*`. Wildcard can be use with attribute mapping like `onkey*:oninputkey*`. See [JIRA issue 12200](https://issues.jboss.org/browse/RF-12200).

*component* variable is now directly casted to the correct class based on `cdk:class` tag in the template. You will no longer need to write explicitly the cast inside 95% of your templates. Enjoy less verbose code and see [JIRA issue 12248](https://issues.jboss.org/browse/RF-12248) for more details.

In general, CDK has been improved to be more type-safe which allows to catch more issues at compilte-time.

### What's next?

There are still a few points undone in the [CDK wish-list](https://community.jboss.org/wiki/CDKWish-List) and I hope some of them will be realized. One of the most important is probably generating methods from interfaces! See [JIRA issue 12339](https://issues.jboss.org/browse/RF-12339) to fully understand the concept.

In another topic, another post will follow next week to talk about what's new in [RichFaces Bootstrap project](http://bootstrap-richfaces.rhcloud.com).
