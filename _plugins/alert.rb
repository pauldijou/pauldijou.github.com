module Jekyll
  class AlertBlock < Liquid::Block

    alias_method :render_block, :render

    def initialize(tag_name, text, tokens)
      super
      args = text.split(" ")
      @isDanger = args.include?("danger")
      @isWarning = args.include?("warning")
      @isInfo = args.include?("info")
    end

    def render(context)
      converter = context.registers[:site].find_converter_instance(::Jekyll::Converters::Markdown)
      content = converter.convert(render_block(context))
      content = content.slice(4, content.length - 9)

      "<p class=\"alert#{@isInfo ? ' alert-info' : ''}#{@isWarning ? ' alert-warning' : ''}#{@isDanger ? ' alert-danger' : ''}\">#{ content }</p>"
    end
  end
end

Liquid::Template.register_tag('alert', Jekyll::AlertBlock)
