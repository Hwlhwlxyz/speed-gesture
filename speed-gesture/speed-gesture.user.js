// ==UserScript==
// @name         speed-gesture
// @namespace    https://github.com/Hwlhwlxyz/speed-gesture
// @version      2024-06-05
// @description  a mouse gesture userscript
// @author       Hwlhwlxyz
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_openInTab
// ==/UserScript==

let behaviorConfiguration = {
  "1": null,
  "2": { fn: openInIncognitoWindow, text: "cognito" },
  "3": null,
  "4": null,
  "6": { fn: openInIncognitoWindowOrSearchSelectedText, text:"new tab" },
  "7": { fn: back, text:"back" },
  "8": null,
  "9": { fn: forward, text:"forward" },
}

let globalState = {
  targetElement: null,
  selectedText: null,
  closestAnchor: null
}

// all functions to be used in configuration 所有配置文件中用到的函数
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
  if (selectedText != null && selectedText.length > 0) {
    const transformedText = selectedText.split(" ").join("+")
    let searchUrl = "https://duckduckgo.com/?q=" + transformedText;
    GM_openInTab(searchUrl);
    return true;
  }
  return false
}

function openInIncognitoWindowOrSearchSelectedText(element) {
  let success = openInBackground(element);
  if (success) {
    return true;
  }
  else {
    return searchSelectedText(element);
  }
}

function back() {
  history.back();
  return true;
}

function forward() {
  history.forward();
  return true;
}



const { c, html, css, useState } = await import("https://unpkg.com/atomico");

function component() {
  const handlerMouseup = (e, targetId) => {
    function prevent(e) {
      e.preventDefault();
    }
    let runFun = behaviorConfiguration[targetId].fn;
    if (runFun != null) {
      runFun(globalState['targetElement']);
      document.addEventListener("contextmenu", prevent);
      setTimeout(() => {
        document.removeEventListener("contextmenu", prevent);
      }, 1)
    }
    else {
      document.removeEventListener("contextmenu", prevent);
    }
    return;
  }

  function getTextInSquareStyle(text) {
    if (text!=null && text.length>0) {
      return "font-size:"+(20-parseInt(text.length/5))+"px";
    }
    return "";
  }

  return html`<host shadowDom>
    <div class="grid-container" id="gesture-container" >
      <div id="1" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 1)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["1"]?.text)}>${behaviorConfiguration["1"]?.text} </div></div>
      <div id="2" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 2)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["2"]?.text)}>${behaviorConfiguration["2"]?.text} </div> </div>
      <div id="3" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 3)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["3"]?.text)}>${behaviorConfiguration["3"]?.text} </div> </div>
      <div id="4" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 4)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["4"]?.text)}>${behaviorConfiguration["4"]?.text} </div> </div>
      <div id="5" class="grid-item" style="background-color:transparent;"></div>
      <div id="6" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 6)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["6"]?.text)}>${behaviorConfiguration["6"]?.text} </div> </div>
      <div id="7" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 7)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["7"]?.text)}>${behaviorConfiguration["7"]?.text} </div> </div>
      <div id="8" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 8)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["8"]?.text)}>${behaviorConfiguration["8"]?.text} </div> </div>
      <div id="9" class="grid-item" onmouseup=${(e)=>handlerMouseup(e, 9)} oncontextmenu=${e => e.preventDefault()}> <div class="text-in-square" style=${getTextInSquareStyle(behaviorConfiguration["9"]?.text)}>${behaviorConfiguration["9"]?.text} </div> </div>
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
  height: 100px;
  width: 100px;
  background-color: #e74c3c;
  opacity: 0.3;
  color: #fff;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.grid-item:hover {
  background-color: #e74c3c;
  opacity: 1;
  color: #fff;
  text-align: center;
}

.text-in-square {
  max-width: 100px;
  max-height: 100px;
  word-wrap: break-word;
  margin: auto;
  text-align: center;
}
`;

customElements.define("my-component-c", c(component));


(function () {
  'use strict';
  // Your code here...
  const myElementExists = !!customElements.get('my-component-c');
  console.log(myElementExists)
  let myc = document.createElement("my-component-c");
  let boxdiv = document.createElement("div")
  myc.style.position = "absolute";
  myc.style.display = "none";
  boxdiv.appendChild(myc);
  document.body.appendChild(boxdiv)

  addEventListener("mousedown", (event) => {
    globalState['targetElement'] = event.target;
    const selObj = window.getSelection();
    const selectedText = selObj.toString();
    globalState["selectedText"] = selectedText;
    const anchor = event.target.closest("a");
    globalState["closestAnchor"] = anchor;

    if (event.button === 2) {
      setTimeout(() => {
        let x = event.pageX;
        let y = event.pageY;
        myc.style.left = x + "px";
        myc.style.top = y + "px";
        myc.style.display = "block";
        myc.style.zIndex = 99999;
      }, 50)

    }
  });

  addEventListener("mouseup", (event) => {
    if (event.button === 2) {
      myc.style.display = "none"; // 不影响原始右键菜单的行为
    }
  });

})();

