function Markdown(data) {
  console.log("starting", Array.isArray(data));
  var md = "";
  if(!Array.isArray(data)) return false;
  data.forEach(function(section) {
    md += buildSection(section) + "\n\n";
  });
  console.log(md);
  md = md.trim();
  return md;
}

function buildSection(section) {
  var title, body;
  if(typeof section.title == "string") title = `<h1>${section.title}</h1>`;
  else title = complexTitle(section.title);
  if(typeof section.body == "string") body = `<h1>${section.body}</h1>`;
  else body = complexBody(section.body);
  return title.trim() + "\n\n" + body;
}

function complexTitle(title) {
  var level = title.level || 1;
  var modifiers = title.modifiers || {};
  var content = title.content;
  if(modifiers.bold)
    content = bold(content);
  if(modifiers.italic)
    content = italic(content);
  if(modifiers.align)
    return align("h"+level, content, modifiers.align);
  return `<h${level}>${content}</h${level}>`;
}

function italic(content) {
  return `<em>${content}</em>`;
}

function bold(content) {
  return `<b>${content}</b>`;
}

function align(type, content, align) {
  return `<${type} align="${align}">${content}</${type}>`;
}

function complexBody(body) {
  console.log(body);
  var section = "";
  body.content.forEach(function(el) {
    if(typeof el == "string") section += el + "\n\n";
    else {
      section += buildEl(el) + "\n\n";
    }
  });
  if(body.modifiers && body.modifiers.align) {
    return align("div", section, body.modifiers.align);
  }
  return `<div>${section}</div>`;
}

function buildEl(el) {
  var modifiers = el.modifiers || {};
  switch(el.type) {
    case "table":
      return buildTable(el);
    case "code": {
      el.content = `<code>${el.content}</code>`;
      if(modifiers.align)
        return align("div", el.content, el.modifiers.align);
      return el.content;
    }
    default:
      if(Array.isArray(el.content)) {
        var str = "";
        el.content.forEach(function(e) {
          if(typeof e == "string") str += e + "\n\n";
          else {
            str += buildEl(e) + "\n\n";
          }
        });
        if(modifiers.bold) {
          str = bold(str);
        }
        if(modifiers.italic) {
          str = italic(str);
        }
        if(modifiers.align) {
          return align("div", str, modifiers.align)
        }
        return `<div>${str}</div>`;
      } else {
        var str = el.content;
        if(modifiers.bold) {
          str = bold(str);
        }
        if(modifiers.italic) {
          str = italic(str);
        }
        if(modifiers.align) {
          return align("div", str, modifiers.align)
        }
        return `<div>${str}</div>`;
      }
  }
}

function buildTable(table) {
  var str = "";
  str += "<tr>";
  table.content.headings.forEach(function(heading) {
    str += "<th>" + heading + "</th>\n\n";
  });
  str += "</tr>\n\n";
  table.content.data.forEach(function(row) {
    str += "<tr>\n\n";
    row.forEach(function(column) {
      str += "<td>" + column + "</td>";
    });
    str += "</tr>\n\n";
  });
  if(table.modifiers && table.modifiers.align) {
    return align("table", str, table.modifiers.align);
  }
  return `<table>\n\n${str.trim()}\n\n</table>`;
}

/*

  sectionFormat: {
    title: "Heading",
    body: "This is a sample body"
  }

  sectionFormat(alt): {
    title: {
      level: [1-5],
      modifiers: {
        bold: true,
        align: "center"
      },
      content: <String>
    },
    body: {
      modifiers: {
        bold: true,
        align: "center"
      },
      content: [
        "Hello world",
        {
          type: "table",
          content: {
            headings: ["first", "second", "third"],
            data: [
              [1,2,3],
              [4,5,6],
              [7,8,9]
            ]
          }
        },
        {
          type: "code",
          content: "sudo apt-get install *"
        }
      ]
    }
  }

  dataFormat: [section1, section2, ..., sectionN];

*/

var data = [
  {
    title: {
      level: 1,
      modifiers: {
        bold: true,
        align: "center"
      },
      content: "Testing"
    },
    body: {
      modifiers: {
        bold: true,
        align: "center"
      },
      content: [
        "hello world",
        {
          type: "table",
          content: {
            headings: ["first", "second", "third"],
            data: [
              [1,2,3],
              [4,5,6],
              [7,8,9]
            ]
          }
        },
        {
          type: "code",
          content: "sudo apt-get install sl"
        }
      ]
    }
  }
]
var a = Markdown(data);
require("fs").writeFileSync("testoutput.md", a);

// var data = [{
//     title: {
//       level: [1-5],
//       modifiers: {
//         bold: true,
//         align: "center"
//       },
//       content: "<String>"
//     },
//     body: {
//       modifiers: {
//         bold: true,
//         align: "center"
//       },
//       content: [
//         "Hello world",
//         {
//           type: "table",
//           content: {
//             headings: ["first", "second", "third"],
//             data: [
//               [1,2,3],
//               [4,5,6],
//               [7,8,9]
//             ]
//           }
//         },
//         {
//           type: "code",
//           content: "sudo apt-get install *"
//         }
//       ]
//     }
//   }
// }]
