# Not used anymore but let's keep as a memento
module CodeBlock
  def renderCodeBlocks(content)
    content = escapeAllBlocks(content)
    content.gsub!(/<p>```([a-zA-Z]+)\n/, '<pre><code class="language-\1">')
    content.gsub!(/```([a-zA-Z]+)\n/, '<pre><code class="language-\1">')
    content.gsub!(/```<\/p>/, '</code></pre>')
    content.gsub!(/```/, '</code></pre>')
    content
  end

  private

  def escapeAllBlocks(content)
    blocks = content.split('```')

    blocks.each_with_index do |block, index|
      if index % 2 == 1
        block.gsub!(/<\/p>(\n\n)<p>/, '\1')
        block.gsub!(/</, '&lt;')
      end
    end

    blocks.join('```')
  end
end
