.PHONY: init watch open

init:
	gem install jekyll bundle

watch:
	bundle exec jekyll serve --watch

open:
	open http://localhost:4000
