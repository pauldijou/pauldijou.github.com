
Awestruct::Extensions::Pipeline.new do
  extension Awestruct::Extensions::Posts.new( '/blog')
  extension Awestruct::Extensions::Posts.new( '/projects', :projects )
  extension Awestruct::Extensions::Posts.new( '/slides', :slides )
  extension Awestruct::Extensions::Paginator.new( :posts, '/blog/index', :per_page=>5 )
  extension Awestruct::Extensions::Paginator.new( :projects, '/projects/index', :per_page=>100000 )
  extension Awestruct::Extensions::Paginator.new( :slides, '/slides/index', :per_page=>100000 )
  extension Awestruct::Extensions::Tagger.new( :posts, '/blog/index', '/blog/tags', :per_page=>5)
  extension Awestruct::Extensions::Tagger.new( :projects, '/projects/index', '/projects/tags', :per_page=>100000)
  extension Awestruct::Extensions::Tagger.new( :slides, '/slides/index', '/slides/tags', :per_page=>100000)
  extension Awestruct::Extensions::TagCloud.new( :posts, '/blog/tags/index.html', :layout=>'main' )
  extension Awestruct::Extensions::TagCloud.new( :projects, '/projects/tags/index.html', :layout=>'main' )
  extension Awestruct::Extensions::TagCloud.new( :slides, '/slides/tags/index.html', :layout=>'main' )
  extension Awestruct::Extensions::Atomizer.new( :posts, '/feed.atom', :num_entries=>20, :feed_title=>'Paul Dijou Blog' )
  extension Awestruct::Extensions::Atomizer.new( :posts, '/rss.atom', :num_entries=>20, :feed_title=>'Paul Dijou Blog' )
  extension Awestruct::Extensions::Disqus.new()
  extension Awestruct::Extensions::Indexifier.new()
  helper Awestruct::Extensions::Partial
  helper Awestruct::Extensions::GoogleAnalytics
end
