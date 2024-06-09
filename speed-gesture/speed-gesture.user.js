// ==UserScript==
// @name         speed-gesture
// @namespace    my.userscript.component
// @version      2024-06-05
// @description  a mouse gesture userscript
// @author       You
// @match        *://*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_openInTab
// ==/UserScript==

let behaviorConfiguration = {
  "1": null,
  "2": openInIncognitoWindow,
  "3": null,
  "4": null,
  "6": openInIncognitoWindowOrSearchSelectedText,
  "7": null,
  "8": null,
  "9": null,
}

let globalState = {
  targetElement: null,
  selectedText: null,
  closestAnchor: null
}

function openInBackground(element) {
  let href = globalState["closestAnchor"]?.href;
  if (href != null) {
    GM_openInTab(href);
    return true;
  }
  return false;
}

function openInIncognitoWindow(element) {
  let href = globalState["closestAnchor"]?.href;
  if (href != null) {
    GM_openInTab(href, { incognito: true });
    return true;
  }
  return false;
}

function searchSelectedText(element) {
  const selectedText = globalState["selectedText"];
  console.log("selectedText:", selectedText)
  if (selectedText != null && selectedText.length > 0) {
    const transformedText = selectedText.split(" ").join("+")
    let searchUrl = "https://duckduckgo.com/?q=" + transformedText;
    GM_openInTab(searchUrl);
    return true;
  }
  return false
}

function openInIncognitoWindowOrSearchSelectedText(element) {
  let success = openInIncognitoWindow(element);
  if (success) {
    return true;
  }
  else {
    return searchSelectedText(element);
  }
}



const { c, html, css, useState } = await import("https://unpkg.com/atomico");

function component() {
  const handlerMouseup = (e) => {
    console.log("mouseup!", e, e.target.id, e.target.getAttribute('id'));
    let targetId = e.target.id;
    let runFun = behaviorConfiguration[targetId];
    if (runFun != null) {
      runFun(globalState['targetElement']);
    }
    return;
  }

  return html`<host shadowDom>
    <div class="grid-container">
      <div id="1" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
      <div id="2" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
      <div id="3" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
      <div id="4" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
      <div id="5" class="grid-item" style="background-color:transparent;"></div>
      <div id="6" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
      <div id="7" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
      <div id="8" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
      <div id="9" class="grid-item" onmouseup=${handlerMouseup} oncontextmenu=${e => e.preventDefault()}></div>
    </div>
  </host>`;
}

component.props = {
  name: String,
};

component.styles = css`
  :host {
    font-size: 30px;
    width: 300px;
    height: 300px;
  }

.grid-container {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 10px;
  width: 300px;
  height: 300px;
  transform: translate(-50%, -50%);
}

.grid-item {
  background-color: #e74c3c;
  opacity: 0.3;
  color: #fff;
  text-align: center;
  line-height: 100px;
}

.grid-item:hover {
  background-color: #e74c3c;
  opacity: 1;
  color: #fff;
  text-align: center;
  line-height: 100px;
}

.text-in-square {
  word-wrap: break-word;
  width: 100px;
  height: 100px;
}
`;

customElements.define("my-component-c", c(component));


(function () {
  'use strict';
  console.log("v0.21")
  // Your code here...
  const myElementExists = !!customElements.get('my-component-c');
  console.log(myElementExists)
  let myc = document.createElement("my-component-c");
  let boxdiv = document.createElement("div")
  myc.style.position = "absolute";

  myc.style.display = "none"
  boxdiv.appendChild(myc);
  document.body.appendChild(boxdiv)

  addEventListener("mousedown", (event) => {
    console.log("mousedown:", event.target);
    globalState['targetElement'] = event.target;
    const selObj = window.getSelection();
    const selectedText = selObj.toString();
    globalState["selectedText"] = selectedText;
    const anchor = event.target.closest("a");
    globalState["closestAnchor"] = anchor;
    console.log(globalState['targetElement'])
    console.log("state:", globalState)
    let x = event.pageX;
    let y = event.pageY;
    if (event.button === 2) {
      myc.style.left = x + "px";
      myc.style.top = y + "px";
      myc.style.display = "block"
    }
  });

  addEventListener("mouseup", (event) => {
    console.log("mouseup:", event.target);

    if (event.button === 2) {
      setTimeout(() => {
        myc.style.display = "none";
        globalState['targetElement'] = null;
      }, "1");
    }
  });

})();

