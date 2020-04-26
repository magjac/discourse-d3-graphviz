## discourse-d3-graphviz

A Discourse theme component for rendering animated
[Graphviz](https://www.graphviz.org/) graphs using
[DOT](https://www.graphviz.org/doc/info/lang.html) source code. Based
on [d3-graphviz](https://github.com/magjac/d3-graphviz).

### Usage
#### Basic

See the [Graphviz](https://www.graphviz.org/documentation/) site for documentation and examples.

To use with a discourse post, wrap the graph defintion in `dot` tags
like this:

```
[dot] digraph {a -> b} [/dot]
```

Multi-line is also supported:

```
[dot]
digraph {
  a -> b
}
[/dot]
```

#### Animated transition

An animated transition between multiple graphs is shown when more
than one graph is added to the same paragraph of a post like so:

```
[dot] digraph {bgcolor=lightblue a -> b} [/dot]
[dot] digraph {bgcolor=lightblue a -> b; a -> c} [/dot]
[dot] digraph {bgcolor=lightblue a -> b; a -> c; b -> c} [/dot]
```

or

```
[dot]
digraph {
a -> b
}
[/dot]
[dot]
digraph {
a -> b
a -> c
}
[/dot]
[dot]
digraph {
a -> b
a -> c
b -> c
}
[/dot]
```

Paragraph are separated by blank lines, so this will generate three separate graphs:

```
[dot] digraph {bgcolor=lightblue a -> b} [/dot]

[dot] digraph {bgcolor=lightblue a -> b; a -> c} [/dot]

[dot] digraph {bgcolor=lightblue a -> b; a -> c; b -> c} [/dot]
```

### Note

Currently blank lines within the DOT source code is not supported due to [this bug](https://github.com/magjac/discourse-d3-graphviz/issues/15).

### Installation

See [How do I install a Theme or Theme Component?](https://meta.discourse.org/t/how-do-i-install-a-theme-or-theme-component/63682)
