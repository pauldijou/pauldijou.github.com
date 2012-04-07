
Awestruct::Extensions::Pipeline.new do
  extension Awestruct::Extensions::Posts.new( '/blog')
  extension Awestruct::Extensions::Posts.new( '/projects', :projects ) 
  extension Awestruct::Extensions::Paginator.new( :posts, '/blog/index', :per_page=>5 )
  extension Awestruct::Extensions::Tagger.new( :posts, '/blog/index', '/blog/tags', :per_page=>10)
  extension Awestruct::Extensions::Tagger.new( :projects, '/projects/index', '/projects/tags', :per_page=>100000)
  extension Awestruct::Extensions::TagCloud.new( :posts, '/blog/tags/index.html', :layout=>'main' )
  extension Awestruct::Extensions::TagCloud.new( :projects, '/projects/tags/index.html', :layout=>'main' )
  extension Awestruct::Extensions::Atomizer.new( :posts, '/blog.atom', :num_entries=>20 )
  extension Awestruct::Extensions::Disqus.new
  extension Awestruct::Extensions::Indexifier.new
  helper Awestruct::Extensions::Partial
end
