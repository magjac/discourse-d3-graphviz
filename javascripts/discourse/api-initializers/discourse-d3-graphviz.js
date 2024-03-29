import { apiInitializer } from "discourse/lib/api";

  const topBarHeight = 60; // FIXME: Determine this dynamically
  const collapseEditorGraphsNotVisible = false;
  class GraphObject {
    constructor(dotSrcs, optionsObjects, isEditorPreview, replyControl, cookedDiv) {
      this.prevGraph = null;
      this.nextGraph = null;
      this.dotSrcs = dotSrcs;
      this.optionsObjects = optionsObjects;
      this.paragraph = null;
      this.textBefore = '';
      this.textAfter = '';
      this.isEditorPreview = isEditorPreview;
      this.replyControl = replyControl;
      this.previewWrapper = null;
      this.cookedDiv = cookedDiv;
      this._graphContainer = null;
      this.graphvizContainer = null;
      this.graphviz = null;
      this.index = 0;
      this.isRendered = false;
      this.run = false;
      this.minWidth = 0;
      this.minHeight = 0;
      this.running = false;
      this.visible;
      this.loop = false;
      this.controls;
      this.controlButtons = {};
    }
    release () {
      document.removeEventListener('visibilitychange', this.boundVisibilityChangeHandler);
      window.removeEventListener('scroll', this.boundVisibilityChangeHandler);
      window.removeEventListener('resize', this.boundVisibilityChangeHandler);
      this.replyControl.removeEventListener('transitionend', this.boundVisibilityChangeHandler);
      if (this.previewWrapper != null) {
        this.intersectionObserver.disconnect();
      }
      this.graphviz.destroy();
    }
    set graphContainer(graphContainer) {
      this._graphContainer = graphContainer;
      this.graphContainerElement = graphContainer.node();
    }
    get graphContainer() {
      return this._graphContainer;
    }
    get dotSrc() {
      return this.dotSrcs[this.index];
    }
    get options() {
      return this.optionsObjects[this.index];
    }

    init() {
      this.replaceHTML();
      this.initGraphviz();
      this.initVisibilityChangeHandler();
      if (this.dotSrcs.length > 1) {
        this.run = !this.isEditorPreview && this.options.play;
        this.loop = this.options.repeat || false;
        this.addControls();
      }
      this.visible = !this.isEditorPreview && this.isVisible();

      this.render();
    }

    replaceHTML() {
      d3.select(this.cookedDiv)
        .style('overflow', 'visible');

      if (this.isEditorPreview) {
        d3.select('.title-and-category')
          .style('width', 'calc(50% - 33px');
        this.previewWrapper = this.cookedDiv.parentElement;
        const editorContainer = this.previewWrapper.parentElement;
        d3.select(this.previewWrapper)
          .style('padding-left', '52px');
      }
      if (this.textBefore != '') {
        d3.select(this.paragraph).insert('span', () => this.nextElement)
          .text(this.textBefore);
      }
      const graphContainer = d3.select(this.paragraph)
            .insert('span', () => this.nextElement)
              .classed('graph-container', true)
              .style('display', 'inline-block');

      if (this.optionsObjects[0].verbose) {
        graphContainer
          .append('pre')
          .append('code')
          .text(this.dotSrcs.join('\n'));
      }

      const isFirstGraphInNonEditorPost = !this.isEditorPreview &&
            this.paragraph.previousElementSibling == null;
      this.controlsContainer = graphContainer.append('nav')
        .attr('id', 'graph-controls')
        .attr('class', 'post-controls')
        .style('position', 'relative')
        .style('left', '-55px')
        .style('top', isFirstGraphInNonEditorPost ? '10px': '0px')
        .style('bottom', 'inherit')
        .style('display', 'inline');
      if (this.isEditorPreview) {
        this.controlsContainer
          .style('left', '-51px');
      }

      this.graphvizContainer = graphContainer.append('span')
        .attr('id', 'graphviz-container')
        .classed('graphviz-container', true)
        .style('display', 'inline-block');

      if (this.textAfter != '') {
        d3.select(this.paragraph).insert('span', () => this.nextElement)
          .text(this.textAfter);
      }
      const dotBBCodeElements = this.dotBBCodeElements;
      const dotBBCodeParents = d3.selectAll(this.dotBBCodeElements).select(function () {
        return this.parentElement;
      });
      d3.selectAll(this.dotBBCodeElements).remove();
      const paragraphToKeep = this.paragraph;
      dotBBCodeParents.each(function () {
        if (this !== paragraphToKeep) {
          if (this.childNodes.length == 0 || (this.childNodes.length == 1 && this.childNodes[0].nodeName == 'BR')) {
            // removing some parent elements causes this error:
            //   Uncaught DOMException: Node.removeChild: The node to be removed is not a child of this node
            // We therefore just hide them instead
            d3.select(this).style('display', 'none');
          }
        }
      });
      this.graphContainer = graphContainer;
    }

    initGraphviz() {
      this.graphviz = this.graphvizContainer.graphviz({
        useWorker: this.options.useWorker,
        useSharedWorker: this.options.useSharedWorker,
      })
        .options(this.options)
        .attributer(attributer)
        .onerror(this.handleError.bind(this))
        .on('end', this.done.bind(this));

      const graphObject = this;
      function attributer(datum, index, nodes) {
        if (datum.tag == "svg") {
          const border = graphObject.options.border;
          const style = graphObject.options.style;
          var svg = d3.select(this);
          if (svg.attr('xmlns') != null) {
            let widthAttr = datum.attributes.width;
            let width = typeof widthAttr == 'string' && widthAttr.includes('pt') ?
                widthAttr.replace('pt', '') * 4 / 3 :
                +widthAttr;
            let heightAttr = datum.attributes.height;
            let height = typeof heightAttr == 'string' && heightAttr.includes('pt') ?
                heightAttr.replace('pt', '') * 4 / 3 :
                +heightAttr;
            const originalWidth = width;
            const originalHeight = height;
            if (width > graphObject.minWidth) {
              graphObject.minWidth = width;
              widthAttr = svg.attr('width');
              width = typeof widthAttr == 'string' && widthAttr.includes('pt') ?
                widthAttr.replace('pt', '') * 4 / 3 :
                +widthAttr;
            }
            else {
              width = graphObject.minWidth;
            }
            if (height > graphObject.minHeight) {
              graphObject.minHeight = height;
              heightAttr = svg.attr('height');
              height = typeof heightAttr == 'string' && heightAttr.includes('pt') ?
                heightAttr.replace('pt', '') * 4 / 3 :
                +heightAttr;
            }
            else {
              height = graphObject.minHeight;
            }

            const newViewBoxValues = datum.attributes.viewBox.split(' ');
            newViewBoxValues[2] *= graphObject.minWidth / originalWidth;
            newViewBoxValues[3] *= graphObject.minHeight / originalHeight;

            const newViewBox = newViewBoxValues.join(' ');

            svg
              .attr("style", style)
              .style("border", border)
              .attr("width", width)
              .attr("height", height);

            datum.attributes.width = graphObject.minWidth;
            datum.attributes.height = graphObject.minHeight;
            datum.attributes.viewBox = newViewBox;
          }
          datum.attributes.style = [
            border ? 'border: ' + border : '',
            style ? style : '',
          ].join('; ');
        }
      }
    }

    addControls() {
      this.controls = this.controlsContainer
        .append('div')
        .style('height', '0px')
      ;

      const buttonNames = [
        'play',
        'pause',
        'stop',
        'sync-alt',
      ];
      buttonNames.forEach((buttonName) => {
        const action = buttonName.split('-')[0];
        const button = this.controls.append('button')
              .attr('id', action + '-button')
              .attr('class', 'widget-button btn-flat no-text btn-icon')
              .style('display', 'block')
              .on('click', this.handleControl.bind(this, action));
        button.append('svg')
          .attr('class',  'fa d-icon d-icon-' + buttonName + ' svg-icon svg-node')
          .attr('aria-hidden', 'true')
          .append('use')
          .attr('xlink:href', '#' + buttonName);
        this.controlButtons[action] = button;
      });
      this.updateControls();
    }

    render() {
      if (this.isEditorPreview && !this.visible) {
        return;
      }
      this.setRunning(true);
      const options = this.options;
      const dotSrc = this.dotSrc;
      if (this.index < this.dotSrcs.length) {
        this.graphviz
          .options(options)
          .renderDot(dotSrc);
      }
      this.isRendered = true;
    }

    done() {
      const svg = this.graphvizContainer.selectAll('svg');
      const widthAttr = svg.attr('width');
      const heightAttr = svg.attr('height');
      let width = widthAttr.includes('pt') ? widthAttr.replace('pt', '') * 4 / 3 : +widthAttr;
      let height = heightAttr.includes('pt') ? heightAttr.replace('pt', '') * 4 / 3 : +heightAttr;
      if (width > this.minWidth) {
        this.minWidth = width;
      }
      if (height > this.minHeight) {
        this.minHeight = height;
      }
      this.index = (this.index + 1) % this.dotSrcs.length;
      this.visible = this.isVisible();
      this.setRunning(false);
      if (this.dotSrcs.length > 1) {
        const options = this.options;
        const delay = options.delay == undefined ? 500 : options.delay;
        const duration = options.duration == undefined ? 1500 : options.duration;
        let ease;
        if (options.ease == 'linear') {
          ease = d3.easeLinear
        }
        else {
          ease = d3.easeCubic
        }
        this.graphviz
          .transition(() => d3.transition()
                      .ease(ease)
                      .delay(delay)
                      .duration(duration));
      }
      if (this.run) {
        if (this.index > 0 || this.loop) {
          const editorPreviewIsOpen = this.replyControl.classList.contains('open');
          const isNormalPostAndEditorIsClosed = !this.isEditorPreview && !editorPreviewIsOpen;
          if (this.visible && (isNormalPostAndEditorIsClosed || this.isEditorPreview)) {
            this.setRunning(true);
            this.render();
          } else {
            this.watchEditorOpenAndClose();
          }
        }
        else {
          this.pause();
        }
      }
    }

    watchEditorOpenAndClose() {
      const observer = new MutationObserver((mutations) => {
        this.visible = this.isVisible();
        if (this.visible) {
          this.render();
        }
      });
      observer.observe(this.replyControl, {childList: true});
    }

    handleError(errorMessage) {
      let line = errorMessage.replace(/.*error in line ([0-9]*) .*\n/, '$1');
      let designation = '';
      if (this.dotSrcs.length > 1) {
        designation = ' in ';
        if (this.index == 0) {
          designation = designation + '1st ';
        }
        else if (this.index == 1) {
          designation = designation + '2nd ';
        }
        else if (this.index == 2) {
          designation = designation + '3rd ';
        }
        else {
          designation = designation + (this.index + 1) + 'th ';
        }
        designation = designation + 'graph';
      }
      this.graphContainer
        .append('div')
          .attr('id', 'graphviz-error')
          .text(errorMessage + designation)
          .style('color', 'red');
    }

    play() {
      this.run = true;
      this.playOrPause();
    }

    pause() {
      this.run = false;
      this.playOrPause();
    }

    handleControl(buttonName) {
      if (buttonName == 'play') {
        this.play();
      }
      else if (buttonName == 'pause') {
        this.pause();
      }
      else if (buttonName == 'sync') {
        this.repeat();
      }
      else if (buttonName == 'stop') {
        this.stop();
      }
    }

    setRunning(running) {
      this.running = running;
      this.updateControls();
    }

    updateControls() {
      if (!this.controlButtons.play) {
        return;
      }
      const playing = this.run;// || this.running;
      this.controlButtons.play.style('display', playing ? 'none' : 'block');
      this.controlButtons.pause.style('display', !playing ? 'none' : 'block');
      this.controlButtons.sync.style('display', this.loop ? 'none' : 'block');
      this.controlButtons.stop.style('display', !this.loop ? 'none' : 'block');
    }

    playOrPause() {
      this.updateControls();
      if (this.run && !this.running) {
        this.render();
      }
    }

    repeat() {
      this.loop = true;
      this.repeatOrStop();
    }

    stop() {
      this.loop = false;
      this.repeatOrStop();
    }

    repeatOrStop() {
      this.updateControls();
      if (this.loop && !this.run) {
        this.play();
      }
    }

    isVisible() {
      const bounding = this.graphContainerElement.getBoundingClientRect();
      if (document.hidden) {
        return false;
      }
      else if (bounding.top >= topBarHeight && bounding.bottom <= window.innerHeight) {
        // The whole graphContainer is visible
        return true;
      }
      else if (bounding.top <= topBarHeight && bounding.bottom >= window.innerHeight) {
        // The graphContainer covers the whole visible area
        return true;
      }
      else if (bounding.top >= topBarHeight && bounding.top <= window.innerHeight) {
        // The top of the graphContainer is visible
        if (this.prevGraphObject == null) {
          // It's the first graphContainer
          return true;
        }
        const prevGraphContainerElement = this.prevGraphObject.graphContainerElement;
        const prevBounding = prevGraphContainerElement.getBoundingClientRect();
        if (prevBounding.bottom > 0) {
          // The bottom of the previous graphContainer is also visible
          return false;
        }
        return true;
      }
      else if (bounding.bottom >= topBarHeight && bounding.bottom <= window.innerHeight) {
        // The bottom of the graphContainer is visible
        if (this.nextGraphObject == null) {
          // It's the last graphContainer
          return true;
        }
        const nextGraphContainerElement = this.nextGraphObject.graphContainerElement;
        const nextBounding = nextGraphContainerElement.getBoundingClientRect();
        if (nextBounding.top <= window.innerHeight) {
          // The top of the next graphContainer is also visible
          return false;
        }
        return true;
      }
      else {
        return false;
      }
    }

    initVisibilityChangeHandler() {
      this.boundVisibilityChangeHandler = this.visibilityChangeHandler.bind(this);
      document.addEventListener('visibilitychange', this.boundVisibilityChangeHandler);
      window.addEventListener('scroll', this.boundVisibilityChangeHandler);
      window.addEventListener('resize', this.boundVisibilityChangeHandler);
      this.replyControl.addEventListener('transitionend', this.boundVisibilityChangeHandler);
      if (this.previewWrapper != null) {
        const graphObject = this;
        let options = {
          root: this.previewWrapper,
          rootMargin: '0px',
          threshold: 0
        }
        this.intersectionObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            graphObject.visible = entry.isIntersecting;
            if (graphObject.visible) {
              graphObject.visibilityChangeHandler();
            }
          });
        }, options);
        this.intersectionObserver.observe(this.graphContainer.node());
      }
    }

    visibilityChangeHandler() {
      if (this.isEditorPreview) {
        if (this.visible) {
          this.graphContainer.classed('visually-hidden', false);
          if (!this.isRendered) {
            this.render();
          }
        }
        else {
          if (this.isRendered && collapseEditorGraphsNotVisible) {
            this.graphContainer.classed('visually-hidden', true);
          }
        }
      }
      const wasVisible = this.visible;
      this.visible = this.isVisible();
      if (!wasVisible && this.visible) {
        this.playOrPause();
      }
    }

  }

  class GraphObjectBuffer {

    constructor(graphObjectsToInsert, isEditorPreview, replyControl, cookedDiv) {
      this.graphObjectsToInsert = graphObjectsToInsert;
      this.isEditorPreview = isEditorPreview;
      this.replyControl = replyControl;
      this.cookedDiv = cookedDiv;
      this.clear()
    }

    clear() {
      this.textBefore = '';
      this.dotBBCodes = [];
      this.textAfter = '';
      this.paragraph = null;
      this.dotBBCodeElements = [];
      this.nextElement = null;
    }

    add(textBefore, dotBBCodes, textAfter, paragraph, dotBBCodeElements, nextElement) {
      if (!textBefore.match(/^\s*$/)) {
        this.flush();
        this.textBefore = textBefore;
      }
      this.dotBBCodes.push(...dotBBCodes);
      this.textAfter = textAfter;
      this.paragraph = this.paragraph || paragraph;
      this.dotBBCodeElements.push(...dotBBCodeElements);
      this.nextElement = this.nextElement || nextElement;
      if (!textAfter.match(/^\s*$/)) {
        this.flush();
      }
    }

    flush() {
      if (this.dotBBCodes.length > 0) {
        this.graphObjectsToInsert.push(this.createGraphObject());
        this.clear()
      }
    }

    createGraphObject() {
      const dotSrcs = this.dotBBCodes.map(
        dotBBcode => dotBBcode
          .slice(0, dotBBcode.indexOf('[/dot]'))
          .replace(/[^\]]*]/, '')
          .replace(/[“”]/g, '"')
          .replace(/→/g, '->')
      );
      const optionsObjects = this.getOptionsObjects();
      const graphObject = new GraphObject(
        dotSrcs, optionsObjects, this.isEditorPreview, this.replyControl, this.cookedDiv,
      );
      graphObject.textBefore = this.textBefore;
      graphObject.textAfter = this.textAfter;
      graphObject.paragraph = this.paragraph;
      graphObject.dotBBCodeElements = this.dotBBCodeElements;
      graphObject.nextElement = this.nextElement;
      return (graphObject);
    }

    getOptionsObjects() {
      const optionsObjects = [];
      for (const dotBBCode of this.dotBBCodes) {
        const optionsObject = Object.assign(
          {},
          optionsObjects.length == 0 ?
            {
              useWorker: true,
              useSharedWorker: true,
              play: true,
            } :
          optionsObjects[optionsObjects.length - 1]
        );
        const attributes=dotBBCode.split('[dot')[1].split(']')[0].match(/ *[^ \]]*=(“[^”]*”|[^ \]]*|\([^\)]*\))/g) || [];
        for (const attribute of attributes) {
          let [name, value] = attribute.trim().replace(/[“”]/g, '').split('=')
          if (value == 'true') {
            value = true;
          }
          else if (value == 'false') {
            value = false;
          }
          else if (!isNaN(value)) {
            value = Number(value);
          }
          else if (value[0] == '(') {
            if (value[1] == '(') {
              value = value.slice(2, -2).split('),(').map(a => a.split(',').map(v => Number(v)));
            }
            else {
              value = value.slice(1, -1).split(',').map(v => Number(v))
            }
          }
          optionsObject[name] = value;
        }
        if (optionsObject.hasOwnProperty('tweenPrecision') && optionsObject.tweenPrecision < 1) {
          optionsObject.tweenPrecision = 1;
        }
        optionsObjects.push(optionsObject);
      }
      return optionsObjects;
    }
  }

  class GraphObjectList {
    constructor() {
      this.head = null;
      this.tail = null;
    }
    append(graphObject) {
      const prev = this.tail;
      if (prev == null) {
        this.head = graphObject;
      }
      else {
        prev.nextGraph = graphObject;
      }
      this.tail = graphObject;
      graphObject.prevGraph = prev;
    }
    getPrev(graphObject) {
      return graphObject.prevGraph;
    }
    getNext(graphObject) {
      return graphObject.nextGraph;
    }
    each(callback) {
      let graphObject = this.head;
      let i = 0;
      while (graphObject != null) {
        callback(graphObject, i);
        graphObject = graphObject.nextGraph;
        i += 1;
      }
    }
    delete(graphObject) {
      graphObject.release();
      const prevGraphObject = graphObject.prevGraph;
      const nextGraphObject = graphObject.nextGraph;
      if (prevGraphObject == null) {
        this.head = nextGraphObject;
      }
      else {
        prevGraphObject.nextGraph = nextGraphObject;
      }
      if (nextGraphObject == null) {
        this.tail = prevGraphObject;
      }
      else {
        nextGraphObject.prevGraph = prevGraphObject;
      }
    }
  }

export default apiInitializer("1.13.0", (api) => {

  const graphObjectList = new GraphObjectList();
  // For each post (replies and the editor)
  api.decorateCooked($elem => {
    const cookedDiv = $elem.get(0);
    const replyControl = d3.select('#reply-control').node();
    const isEditorPreview = d3.select(cookedDiv).classed('d-editor-preview');
    graphObjectList.each((graphObject, graphIndex) => {
      const existsInDOM = document.body.contains(graphObject.graphvizContainer.node());
      const cookedParent = graphObject.cookedDiv.parentElement;
      const topicBody = cookedParent &&
            cookedParent.parentElement &&
            cookedParent.parentElement.parentElement;
      const row = topicBody && topicBody.parentElement;
      const article = row && row.parentElement;
      const topicPost = article && article.parentElement;
      const postStream = topicPost && topicPost.parentElement;
      const postStreamParent = postStream && postStream.parentElement;
      const existsInVirtualDOM = postStreamParent == null;
      if (!(existsInDOM || existsInVirtualDOM)) {
        graphObjectList.delete(graphObject);
      }
    });
    const $paragraphs = $elem.children('p,pre,code');
    const graphObjectsToInsert = [];
    const graphObjectBuffer = new GraphObjectBuffer(
      graphObjectsToInsert, isEditorPreview, replyControl, cookedDiv
    );
    let withinBlock = false;
    let atBlockStart = false;
    let prevElementNodeName;
    let partialParagraphText = '';
    let partialDotBBCodes = [];
    let partialDotBBCode = '';
    let partialBlockElements = [];
    // For each paragraph in post
    $.each($paragraphs, (paragraphIndex, paragraph) => {

      retrieveGraphObject(paragraph, paragraph);

      function retrieveGraphObject(rootElement, element) {
        if (element.nodeName == 'P' && prevElementNodeName == 'P') {
          if (withinBlock) {
            if (atBlockStart) {
              partialDotBBCode += '\n'
              atBlockStart = false;
            }
            else {
              partialDotBBCode += '\n\n'
            }
          }
        }
        else if (element.nodeName == 'PRE' || element.nodeName == 'CODE') {
          atBlockStart = false;
          if (!withinBlock) {
            return;
          }
        }
        [...element.childNodes].forEach(childNode => {
          if (childNode.nodeName != '#text' && childNode.nodeName != 'BR') {
            retrieveGraphObject(rootElement, childNode);
          }
          const str = childNode.nodeValue;
          if (withinBlock) {
            partialBlockElements.push(childNode);
            if (childNode.nodeName == '#text') {
              if (atBlockStart) {
                partialDotBBCode += str.slice(1);
                atBlockStart = false;
              }
              else {
                partialDotBBCode += str;
              }
              if (str.match(/^\s*\[\/dot\] *$/)) {
                partialDotBBCodes.push(partialDotBBCode);
                partialDotBBCode = '';
                withinBlock = false;
              }
            }
          }
          else if (!withinBlock && childNode.nodeName == '#text') {
            let nextElement = childNode.nextSibling;
            let foundInline = false;
            const re = /(\[dot[^\]]*\].*?\[\/dot\])/g;
            let lastIndex = 0;
            let result;
            while ((result = re.exec(str)) !== null) {
              const textBefore = str.slice(lastIndex, result.index);
              const dotBBCodes = [result[0]];
              const textAfter = str.slice(re.lastIndex).split('[dot')[0];
              graphObjectBuffer.add(
                textBefore, dotBBCodes, textAfter, rootElement, [childNode], nextElement
              );
              lastIndex = re.lastIndex + textAfter.length;
              foundInline = true;
            }
            if (!foundInline && str.match(/^\s*\[dot[^\]]*\] *$/)) {
              withinBlock = true;
              atBlockStart = true;
              partialDotBBCode = str;
              partialBlockElements.push(childNode);
            }
          }
          if (!withinBlock && partialDotBBCodes.length > 0) {
            graphObjectBuffer.add(
              '', partialDotBBCodes, '', rootElement, partialBlockElements, childNode
            );
            partialDotBBCodes = [];
            partialDotBBCode = '';
            partialBlockElements = [];
          }
        });
        prevElementNodeName = element.nodeName;
      }
      if (!withinBlock) {
        graphObjectBuffer.flush();
      }

    });
    graphObjectBuffer.flush();
    graphObjectsToInsert.forEach(graphObject => insertGraphObject(graphObject));
  },
  {
    id: "dot",
  },
  );

  function insertGraphObject(graphObject) {
    graphObjectList.append(graphObject);
    graphObject.init();
  }
});
