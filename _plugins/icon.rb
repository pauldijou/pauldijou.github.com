module Jekyll
  class IconTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      args = text.split(" ")
      @name = args[0]
      @isLarge = args.include?("large")
      @isFixed = args.include?("fixed")
      @isZoom2 = args.include?("2x")
      @isZoom3 = args.include?("3x")
      @isZoom4 = args.include?("4x")
      @isZoom5 = args.include?("5x")
    end

    def render(context)
      name = context[@name] ? context[@name] : @name

      "<span class=\"icon fa fa-#{name}#{@isLarge ? ' fa-lg' : ''}#{@isFixed ? ' fa-fw' : ''}#{@isZoom2 ? ' fa-2x' : ''}#{@isZoom3 ? ' fa-3x' : ''}#{@isZoom4 ? ' fa-4x' : ''}#{@isZoom5 ? ' fa-5x' : ''}\"></span>"
    end
  end
end

Liquid::Template.register_tag('icon', Jekyll::IconTag)
