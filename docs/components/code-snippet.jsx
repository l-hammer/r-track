/*
 * Created Date: 2019-08-19
 * Author: 宋慧武
 * ------
 * Last Modified: Monday 2019-08-19 17:01:58 pm
 * Modified By: the developer formerly known as 宋慧武 at <songhuiwu001@ke.com>
 * ------
 * HISTORY:
 * ------
 * Javascript will save your soul!
 */
import React, { Component } from "react";
import hljs from "highlight.js";

export default class CodeSnippet extends Component {
  render() {
    const { lang, code } = this.props;
    const result = hljs.highlight(lang, code.trim()).value;
    const lineCount = (() => {
      let length = 0;
      const str = result;

      for (var i = 0; i < str.length; ++i) {
        if (str[i] === "\n") {
          length++;
        }
      }
      return length + 1;
    })();

    return (
      <section className="code-snippet">
        <div className="language">{lang}</div>
        <div className="line-numbers">
          {Array.from({ length: lineCount }).map((line, idx) => (
            <div key={idx.toString()} className="line-number">
              {idx + 1}
            </div>
          ))}
        </div>
        <div
          className="render"
          dangerouslySetInnerHTML={{ __html: result }}
        ></div>
      </section>
    );
  }
}
