import React from "react";
import marked from "marked";
import "./create-news.sass";

marked.setOptions({
  breaks: true,
});

const renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
  return `<a target="_blank" href="${href}">${text}</a>`;
};

renderer.image = function (href, title, text) {
  if (title) {
    var size = title.split("x");
    if (size[1]) {
      size = "width=" + size[0] + " height=" + size[1];
    } else {
      size = "width=" + size[0];
    }
  } else {
    size = "";
  }
  return '<img src="' + href + '" alt="' + text + '" ' + size + ">";
};

export default function Marked({ markedText, onMarkedChange }) {
  const placeholder = !markedText
    ? `# Welcome to my React Markdown Previewer!

  ## This is a sub-heading...
  ### And here's some other cool stuff:
    
  Heres some code, \`<div></div>\`, between 2 backticks.
  
  \`\`\`
  // this is multi-line code:
  
  function anotherExample(firstLine, lastLine) {
    if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
      return multiLineCode;
    }
  }
  \`\`\`
    
  You can also make text **bold**... whoa!
  Or _italic_.
  Or... wait for it... **_both!_**
  And feel free to go crazy ~~crossing stuff out~~.
  
  There's also [links](https://www.freecodecamp.com), and
  > Block Quotes!
  
  And if you want to get really crazy, even tables:
  
  Wild Header | Crazy Header | Another Header?
  ------------ | ------------- | ------------- 
  Your content can | be here, and it | can be here....
  And here. | Okay. | I think we get it.
  
  - And of course there are lists.
    - Some are bulleted.
       - With different indentation levels.
          - That look like this.
  
  
  1. And there are numbererd lists too.
  1. Use just 1s if you want! 
  1. But the list goes on...
  - Even if you use dashes or asterisks.
  * And last but not least, let's not forget embedded images:
  
  ![React Logo w/ Text](http://tezportal.ddns.net/public/news/02.07.2020_17_41_39_file_example_JPG_100kB.jpg "420x420")
  `
    : markedText;

  const rows = placeholder.split("\n").length + 1;

  return (
    <div className="container">
      <div style={{ marginTop: "1rem" }} className="col-md-12">
        <label>Новость</label>
        <textarea
          type="text"
          className="form-control"
          rows={rows}
          value={placeholder}
          onChange={onMarkedChange}
        ></textarea>
      </div>
      <div style={{ marginTop: "1rem" }} className="col-md-12">
        <label>Превью</label>
        <div
          className="preview"
          dangerouslySetInnerHTML={{
            __html: marked(placeholder, { renderer: renderer }),
          }}
        ></div>
      </div>
    </div>
  );
}
