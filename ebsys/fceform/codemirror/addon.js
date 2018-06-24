(function() {
    var DEFAULT_BRACKETS = "()[]{}''\"\"";
    var DEFAULT_EXPLODE_ON_ENTER = "[]{}";
    var SPACE_CHAR_REGEX = /\s/;

    CodeMirror.defineOption("autoCloseBrackets", false, function(cm, val, old) {
        if (old != CodeMirror.Init && old)
            cm.removeKeyMap("autoCloseBrackets");
        if (!val) return;
        var pairs = DEFAULT_BRACKETS, explode = DEFAULT_EXPLODE_ON_ENTER;
        if (typeof val == "string") pairs = val;
        else if (typeof val == "object") {
            if (val.pairs != null) pairs = val.pairs;
            if (val.explode != null) explode = val.explode;
        }
        var map = buildKeymap(pairs);
        if (explode) map.Enter = buildExplodeHandler(explode);
        cm.addKeyMap(map);
    });

    function charsAround(cm, pos) {
        var str = cm.getRange(CodeMirror.Pos(pos.line, pos.ch - 1),
                          CodeMirror.Pos(pos.line, pos.ch + 1));
        return str.length == 2 ? str : null;
    }

    function buildKeymap(pairs) {
        var map = {
            name: "autoCloseBrackets",
            Backspace: function(cm) {
                if (cm.somethingSelected()) return CodeMirror.Pass;
                var cur = cm.getCursor(), around = charsAround(cm, cur);
                if (around && pairs.indexOf(around) % 2 == 0)
                    cm.replaceRange("", CodeMirror.Pos(cur.line, cur.ch - 1), CodeMirror.Pos(cur.line, cur.ch + 1));
                else
                    return CodeMirror.Pass;
            }
        };
        var closingBrackets = "";
        for (var i = 0; i < pairs.length; i += 2) (function(left, right) {
            if (left != right) closingBrackets += right;
            function surround(cm) {
                var selection = cm.getSelection();
                cm.replaceSelection(left + selection + right);
            }
            function maybeOverwrite(cm) {
                var cur = cm.getCursor(), ahead = cm.getRange(cur, CodeMirror.Pos(cur.line, cur.ch + 1));
                if (ahead != right || cm.somethingSelected()) return CodeMirror.Pass;
                else cm.execCommand("goCharRight");
            }
            map["'" + left + "'"] = function(cm) {
                if (left == "'" && cm.getTokenAt(cm.getCursor()).type == "comment")
                    return CodeMirror.Pass;
                if (cm.somethingSelected()) return surround(cm);
                if (left == right && maybeOverwrite(cm) != CodeMirror.Pass) return;
                var cur = cm.getCursor(), ahead = CodeMirror.Pos(cur.line, cur.ch + 1);
                var line = cm.getLine(cur.line), nextChar = line.charAt(cur.ch), curChar = cur.ch > 0 ? line.charAt(cur.ch - 1) : "";
                if (left == right && CodeMirror.isWordChar(curChar))
                    return CodeMirror.Pass;
                if (line.length == cur.ch || closingBrackets.indexOf(nextChar) >= 0 || SPACE_CHAR_REGEX.test(nextChar))
                    cm.replaceSelection(left + right, { head: ahead, anchor: ahead });
                else
                    return CodeMirror.Pass;
            };
            if (left != right) map["'" + right + "'"] = maybeOverwrite;
        })(pairs.charAt(i), pairs.charAt(i + 1));
        return map;
    }

    function buildExplodeHandler(pairs) {
        return function(cm) {
            var cur = cm.getCursor(), around = charsAround(cm, cur);
            if (!around || pairs.indexOf(around) % 2 != 0) return CodeMirror.Pass;
            cm.operation(function() {
                var newPos = CodeMirror.Pos(cur.line + 1, 0);
                cm.replaceSelection("\n\n", { anchor: newPos, head: newPos }, "+input");
                cm.indentLine(cur.line + 1, null, true);
                cm.indentLine(cur.line + 2, null, true);
            });
        };
    }
})();


(function() {
    var modes = ["clike", "css", "javascript"];
    for (var i = 0; i < modes.length; ++i)
        CodeMirror.extendMode(modes[i], { blockCommentStart: "/*",
            blockCommentEnd: "*/",
            blockCommentContinue: " * "
        });

    function continueComment(cm) {
        var pos = cm.getCursor(), token = cm.getTokenAt(pos);
        var mode = CodeMirror.innerMode(cm.getMode(), token.state).mode;
        var space;

        if (token.type == "comment" && mode.blockCommentStart) {
            var end = token.string.indexOf(mode.blockCommentEnd);
            var full = cm.getRange(CodeMirror.Pos(pos.line, 0), CodeMirror.Pos(pos.line, token.end)), found;
            if (end != -1 && end == token.string.length - mode.blockCommentEnd.length) {
                // Comment ended, don't continue it
            } else if (token.string.indexOf(mode.blockCommentStart) == 0) {
                space = full.slice(0, token.start);
                if (!/^\s*$/.test(space)) {
                    space = "";
                    for (var i = 0; i < token.start; ++i) space += " ";
                }
            } else if ((found = full.indexOf(mode.blockCommentContinue)) != -1 &&
                 found + mode.blockCommentContinue.length > token.start &&
                 /^\s*$/.test(full.slice(0, found))) {
                space = full.slice(0, found);
            }
        }

        if (space != null)
            cm.replaceSelection("\n" + space + mode.blockCommentContinue, "end");
        else
            return CodeMirror.Pass;
    }

    CodeMirror.defineOption("continueComments", null, function(cm, val, prev) {
        if (prev && prev != CodeMirror.Init)
            cm.removeKeyMap("continueComment");
        var map = { name: "continueComment" };
        map[typeof val == "string" ? val : "Enter"] = continueComment;
        cm.addKeyMap(map);
    });
})();

(function() {
    var ie_lt8 = /MSIE \d/.test(navigator.userAgent) &&
    (document.documentMode == null || document.documentMode < 8);

    var Pos = CodeMirror.Pos;

    var matching = { "(": ")>", ")": "(<", "[": "]>", "]": "[<", "{": "}>", "}": "{<" };
    function findMatchingBracket(cm, where, strict) {
        var state = cm.state.matchBrackets;
        var maxScanLen = (state && state.maxScanLineLength) || 10000;

        var cur = where || cm.getCursor(), line = cm.getLineHandle(cur.line), pos = cur.ch - 1;
        var match = (pos >= 0 && matching[line.text.charAt(pos)]) || matching[line.text.charAt(++pos)];
        if (!match) return null;
        var forward = match.charAt(1) == ">", d = forward ? 1 : -1;
        if (strict && forward != (pos == cur.ch)) return null;
        var style = cm.getTokenTypeAt(Pos(cur.line, pos + 1));

        var stack = [line.text.charAt(pos)], re = /[(){}[\]]/;
        function scan(line, lineNo, start) {
            if (!line.text) return;
            var pos = forward ? 0 : line.text.length - 1, end = forward ? line.text.length : -1;
            if (line.text.length > maxScanLen) return null;
            if (start != null) pos = start + d;
            for (; pos != end; pos += d) {
                var ch = line.text.charAt(pos);
                if (re.test(ch) && cm.getTokenTypeAt(Pos(lineNo, pos + 1)) == style) {
                    var match = matching[ch];
                    if (match.charAt(1) == ">" == forward) stack.push(ch);
                    else if (stack.pop() != match.charAt(0)) return { pos: pos, match: false };
                    else if (!stack.length) return { pos: pos, match: true };
                }
            }
        }
        for (var i = cur.line, found, e = forward ? Math.min(i + 100, cm.lineCount()) : Math.max(-1, i - 100); i != e; i += d) {
            if (i == cur.line) found = scan(line, i, pos);
            else found = scan(cm.getLineHandle(i), i);
            if (found) break;
        }
        return { from: Pos(cur.line, pos), to: found && Pos(i, found.pos),
            match: found && found.match, forward: forward
        };
    }

    function matchBrackets(cm, autoclear) {
        // Disable brace matching in long lines, since it'll cause hugely slow updates
        var maxHighlightLen = cm.state.matchBrackets.maxHighlightLineLength || 1000;
        var found = findMatchingBracket(cm);
        if (!found || cm.getLine(found.from.line).length > maxHighlightLen ||
       found.to && cm.getLine(found.to.line).length > maxHighlightLen)
            return;

        var style = found.match ? "CodeMirror-matchingbracket" : "CodeMirror-nonmatchingbracket";
        var one = cm.markText(found.from, Pos(found.from.line, found.from.ch + 1), { className: style });
        var two = found.to && cm.markText(found.to, Pos(found.to.line, found.to.ch + 1), { className: style });
        // Kludge to work around the IE bug from issue #1193, where text
        // input stops going to the textare whever this fires.
        if (ie_lt8 && cm.state.focused) cm.display.input.focus();
        var clear = function() {
            cm.operation(function() { one.clear(); two && two.clear(); });
        };
        if (autoclear) setTimeout(clear, 800);
        else return clear;
    }

    var currentlyHighlighted = null;
    function doMatchBrackets(cm) {
        cm.operation(function() {
            if (currentlyHighlighted) { currentlyHighlighted(); currentlyHighlighted = null; }
            if (!cm.somethingSelected()) currentlyHighlighted = matchBrackets(cm, false);
        });
    }

    CodeMirror.defineOption("matchBrackets", false, function(cm, val, old) {
        if (old && old != CodeMirror.Init)
            cm.off("cursorActivity", doMatchBrackets);
        if (val) {
            cm.state.matchBrackets = typeof val == "object" ? val : {};
            cm.on("cursorActivity", doMatchBrackets);
        }
    });

    CodeMirror.defineExtension("matchBrackets", function() { matchBrackets(this, true); });
    CodeMirror.defineExtension("findMatchingBracket", function(pos, strict) {
        return findMatchingBracket(this, pos, strict);
    });
})();


CodeMirror.defineOption("showTrailingSpace", false, function(cm, val, prev) {
    if (prev == CodeMirror.Init) prev = false;
    if (prev && !val)
        cm.removeOverlay("trailingspace");
    else if (!prev && val)
        cm.addOverlay({
            token: function(stream) {
                for (var l = stream.string.length, i = l; i && /\s/.test(stream.string.charAt(i - 1)); --i) { }
                if (i > stream.pos) { stream.pos = i; return null; }
                stream.pos = l;
                return "trailingspace";
            },
            name: "trailingspace"
        });
});


(function() {
    "use strict";

    var noOptions = {};
    var nonWS = /[^\s\u00a0]/;
    var Pos = CodeMirror.Pos;

    function firstNonWS(str) {
        var found = str.search(nonWS);
        return found == -1 ? 0 : found;
    }

    CodeMirror.commands.toggleComment = function(cm) {
        var from = cm.getCursor("start"), to = cm.getCursor("end");
        cm.uncomment(from, to) || cm.lineComment(from, to);
    };

    CodeMirror.defineExtension("lineComment", function(from, to, options) {
        if (!options) options = noOptions;
        var self = this, mode = self.getModeAt(from);
        var commentString = options.lineComment || mode.lineComment;
        if (!commentString) {
            if (options.blockCommentStart || mode.blockCommentStart) {
                options.fullLines = true;
                self.blockComment(from, to, options);
            }
            return;
        }
        var firstLine = self.getLine(from.line);
        if (firstLine == null) return;
        var end = Math.min(to.ch != 0 || to.line == from.line ? to.line + 1 : to.line, self.lastLine() + 1);
        var pad = options.padding == null ? " " : options.padding;
        var blankLines = options.commentBlankLines || from.line == to.line;

        self.operation(function() {
            if (options.indent) {
                var baseString = firstLine.slice(0, firstNonWS(firstLine));
                for (var i = from.line; i < end; ++i) {
                    var line = self.getLine(i), cut = baseString.length;
                    if (!blankLines && !nonWS.test(line)) continue;
                    if (line.slice(0, cut) != baseString) cut = firstNonWS(line);
                    self.replaceRange(baseString + commentString + pad, Pos(i, 0), Pos(i, cut));
                }
            } else {
                for (var i = from.line; i < end; ++i) {
                    if (blankLines || nonWS.test(self.getLine(i)))
                        self.replaceRange(commentString + pad, Pos(i, 0));
                }
            }
        });
    });

    CodeMirror.defineExtension("blockComment", function(from, to, options) {
        if (!options) options = noOptions;
        var self = this, mode = self.getModeAt(from);
        var startString = options.blockCommentStart || mode.blockCommentStart;
        var endString = options.blockCommentEnd || mode.blockCommentEnd;
        if (!startString || !endString) {
            if ((options.lineComment || mode.lineComment) && options.fullLines != false)
                self.lineComment(from, to, options);
            return;
        }

        var end = Math.min(to.line, self.lastLine());
        if (end != from.line && to.ch == 0 && nonWS.test(self.getLine(end))) --end;

        var pad = options.padding == null ? " " : options.padding;
        if (from.line > end) return;

        self.operation(function() {
            if (options.fullLines != false) {
                var lastLineHasText = nonWS.test(self.getLine(end));
                self.replaceRange(pad + endString, Pos(end));
                self.replaceRange(startString + pad, Pos(from.line, 0));
                var lead = options.blockCommentLead || mode.blockCommentLead;
                if (lead != null) for (var i = from.line + 1; i <= end; ++i)
                    if (i != end || lastLineHasText)
                    self.replaceRange(lead + pad, Pos(i, 0));
            } else {
                self.replaceRange(endString, to);
                self.replaceRange(startString, from);
            }
        });
    });

    CodeMirror.defineExtension("uncomment", function(from, to, options) {
        if (!options) options = noOptions;
        var self = this, mode = self.getModeAt(from);
        var end = Math.min(to.line, self.lastLine()), start = Math.min(from.line, end);

        // Try finding line comments
        var lineString = options.lineComment || mode.lineComment, lines = [];
        var pad = options.padding == null ? " " : options.padding, didSomething;
        lineComment: 
        {
            if (!lineString) break lineComment;
            for (var i = start; i <= end; ++i) {
                var line = self.getLine(i);
                var found = line.indexOf(lineString);
                if (found == -1 && (i != end || i == start) && nonWS.test(line)) break lineComment;
                if (i != start && found > -1 && nonWS.test(line.slice(0, found))) break lineComment;
                lines.push(line);
            }
            self.operation(function() {
                for (var i = start; i <= end; ++i) {
                    var line = lines[i - start];
                    var pos = line.indexOf(lineString), endPos = pos + lineString.length;
                    if (pos < 0) continue;
                    if (line.slice(endPos, endPos + pad.length) == pad) endPos += pad.length;
                    didSomething = true;
                    self.replaceRange("", Pos(i, pos), Pos(i, endPos));
                }
            });
            if (didSomething) return true;
        }

        // Try block comments
        var startString = options.blockCommentStart || mode.blockCommentStart;
        var endString = options.blockCommentEnd || mode.blockCommentEnd;
        if (!startString || !endString) return false;
        var lead = options.blockCommentLead || mode.blockCommentLead;
        var startLine = self.getLine(start), endLine = end == start ? startLine : self.getLine(end);
        var open = startLine.indexOf(startString), close = endLine.lastIndexOf(endString);
        if (close == -1 && start != end) {
            endLine = self.getLine(--end);
            close = endLine.lastIndexOf(endString);
        }
        if (open == -1 || close == -1) return false;

        self.operation(function() {
            self.replaceRange("", Pos(end, close - (pad && endLine.slice(close - pad.length, close) == pad ? pad.length : 0)),
                        Pos(end, close + endString.length));
            var openEnd = open + startString.length;
            if (pad && startLine.slice(openEnd, openEnd + pad.length) == pad) openEnd += pad.length;
            self.replaceRange("", Pos(start, open), Pos(start, openEnd));
            if (lead) for (var i = start + 1; i <= end; ++i) {
                var line = self.getLine(i), found = line.indexOf(lead);
                if (found == -1 || nonWS.test(line.slice(0, found))) continue;
                var foundEnd = found + lead.length;
                if (pad && line.slice(foundEnd, foundEnd + pad.length) == pad) foundEnd += pad.length;
                self.replaceRange("", Pos(i, found), Pos(i, foundEnd));
            }
        });
        return true;
    });
})();

(function() {
    "use strict";

    function doFold(cm, pos, options) {
        var finder = options && (options.call ? options : options.rangeFinder);
        if (!finder) finder = cm.getHelper(pos, "fold");
        if (!finder) return;
        if (typeof pos == "number") pos = CodeMirror.Pos(pos, 0);
        var minSize = options && options.minFoldSize || 0;

        function getRange(allowFolded) {
            var range = finder(cm, pos);
            if (!range || range.to.line - range.from.line < minSize) return null;
            var marks = cm.findMarksAt(range.from);
            for (var i = 0; i < marks.length; ++i) {
                if (marks[i].__isFold) {
                    if (!allowFolded) return null;
                    range.cleared = true;
                    marks[i].clear();
                }
            }
            return range;
        }

        var range = getRange(true);
        if (options && options.scanUp) while (!range && pos.line > cm.firstLine()) {
            pos = CodeMirror.Pos(pos.line - 1, 0);
            range = getRange(false);
        }
        if (!range || range.cleared) return;

        var myWidget = makeWidget(options);
        CodeMirror.on(myWidget, "mousedown", function() { myRange.clear(); });
        var myRange = cm.markText(range.from, range.to, {
            replacedWith: myWidget,
            clearOnEnter: true,
            __isFold: true
        });
        myRange.on("clear", function(from, to) {
            CodeMirror.signal(cm, "unfold", cm, from, to);
        });
        CodeMirror.signal(cm, "fold", cm, range.from, range.to);
    }

    function makeWidget(options) {
        var widget = (options && options.widget) || "\u2194";
        if (typeof widget == "string") {
            var text = document.createTextNode(widget);
            widget = document.createElement("span");
            widget.appendChild(text);
            widget.className = "CodeMirror-foldmarker";
        }
        return widget;
    }

    // Clumsy backwards-compatible interface
    CodeMirror.newFoldFunction = function(rangeFinder, widget) {
        return function(cm, pos) { doFold(cm, pos, { rangeFinder: rangeFinder, widget: widget }); };
    };

    // New-style interface
    CodeMirror.defineExtension("foldCode", function(pos, options) { doFold(this, pos, options); });

    CodeMirror.registerHelper("fold", "combine", function() {
        var funcs = Array.prototype.slice.call(arguments, 0);
        return function(cm, start) {
            for (var i = 0; i < funcs.length; ++i) {
                var found = funcs[i](cm, start);
                if (found) return found;
            }
        };
    });
})();


(function() {
    "use strict";

    CodeMirror.defineOption("foldGutter", false, function(cm, val, old) {
        if (old && old != CodeMirror.Init) {
            cm.clearGutter(cm.state.foldGutter.options.gutter);
            cm.state.foldGutter = null;
            cm.off("gutterClick", onGutterClick);
            cm.off("change", onChange);
            cm.off("viewportChange", onViewportChange);
            cm.off("fold", onFold);
            cm.off("unfold", onFold);
        }
        if (val) {
            cm.state.foldGutter = new State(parseOptions(val));
            updateInViewport(cm);
            cm.on("gutterClick", onGutterClick);
            cm.on("change", onChange);
            cm.on("viewportChange", onViewportChange);
            cm.on("fold", onFold);
            cm.on("unfold", onFold);
        }
    });

    var Pos = CodeMirror.Pos;

    function State(options) {
        this.options = options;
        this.from = this.to = 0;
    }

    function parseOptions(opts) {
        if (opts === true) opts = {};
        if (opts.gutter == null) opts.gutter = "CodeMirror-foldgutter";
        if (opts.indicatorOpen == null) opts.indicatorOpen = "CodeMirror-foldgutter-open";
        if (opts.indicatorFolded == null) opts.indicatorFolded = "CodeMirror-foldgutter-folded";
        return opts;
    }

    function isFolded(cm, line) {
        var marks = cm.findMarksAt(Pos(line));
        for (var i = 0; i < marks.length; ++i)
            if (marks[i].__isFold && marks[i].find().from.line == line) return true;
    }

    function marker(spec) {
        if (typeof spec == "string") {
            var elt = document.createElement("div");
            elt.className = spec;
            return elt;
        } else {
            return spec.cloneNode(true);
        }
    }

    function updateFoldInfo(cm, from, to) {
        var opts = cm.state.foldGutter.options, cur = from;
        cm.eachLine(from, to, function(line) {
            var mark = null;
            if (isFolded(cm, cur)) {
                mark = marker(opts.indicatorFolded);
            } else {
                var pos = Pos(cur, 0), func = opts.rangeFinder || cm.getHelper(pos, "fold");
                var range = func && func(cm, pos);
                if (range && range.from.line + 1 < range.to.line)
                    mark = marker(opts.indicatorOpen);
            }
            cm.setGutterMarker(line, opts.gutter, mark);
            ++cur;
        });
    }

    function updateInViewport(cm) {
        var vp = cm.getViewport(), state = cm.state.foldGutter;
        if (!state) return;
        cm.operation(function() {
            updateFoldInfo(cm, vp.from, vp.to);
        });
        state.from = vp.from; state.to = vp.to;
    }

    function onGutterClick(cm, line, gutter) {
        var opts = cm.state.foldGutter.options;
        if (gutter != opts.gutter) return;
        cm.foldCode(Pos(line, 0), opts.rangeFinder);
    }

    function onChange(cm) {
        var state = cm.state.foldGutter;
        state.from = state.to = 0;
        clearTimeout(state.changeUpdate);
        state.changeUpdate = setTimeout(function() { updateInViewport(cm); }, 600);
    }

    function onViewportChange(cm) {
        var state = cm.state.foldGutter;
        clearTimeout(state.changeUpdate);
        state.changeUpdate = setTimeout(function() {
            var vp = cm.getViewport();
            if (state.from == state.to || vp.from - state.to > 20 || state.from - vp.to > 20) {
                updateInViewport(cm);
            } else {
                cm.operation(function() {
                    if (vp.from < state.from) {
                        updateFoldInfo(cm, vp.from, state.from);
                        state.from = vp.from;
                    }
                    if (vp.to > state.to) {
                        updateFoldInfo(cm, state.to, vp.to);
                        state.to = vp.to;
                    }
                });
            }
        }, 400);
    }

    function onFold(cm, from) {
        var state = cm.state.foldGutter, line = from.line;
        if (line >= state.from && line < state.to)
            updateFoldInfo(cm, line, line + 1);
    }
})();


CodeMirror.registerHelper("fold", "brace", function(cm, start) {
    var line = start.line, lineText = cm.getLine(line);
    var startCh, tokenType;

    function findOpening(openCh) {
        for (var at = start.ch, pass = 0; ; ) {
            var found = lineText.lastIndexOf(openCh, at - 1);
            if (found == -1) {
                if (pass == 1) break;
                pass = 1;
                at = lineText.length;
                continue;
            }
            if (pass == 1 && found < start.ch) break;
            tokenType = cm.getTokenAt(CodeMirror.Pos(line, found + 1)).type;
            if (!/^(comment|string)/.test(tokenType)) return found + 1;
            at = found - 1;
        }
    }

    var startToken = "{", endToken = "}", startCh = findOpening("{");
    if (startCh == null) {
        startToken = "[", endToken = "]";
        startCh = findOpening("[");
    }

    if (startCh == null) return;
    var count = 1, lastLine = cm.lastLine(), end, endCh;
    outer: for (var i = line; i <= lastLine; ++i) {
        var text = cm.getLine(i), pos = i == line ? startCh : 0;
        for (; ; ) {
            var nextOpen = text.indexOf(startToken, pos), nextClose = text.indexOf(endToken, pos);
            if (nextOpen < 0) nextOpen = text.length;
            if (nextClose < 0) nextClose = text.length;
            pos = Math.min(nextOpen, nextClose);
            if (pos == text.length) break;
            if (cm.getTokenAt(CodeMirror.Pos(i, pos + 1)).type == tokenType) {
                if (pos == nextOpen) ++count;
                else if (! --count) { end = i; endCh = pos; break outer; }
            }
            ++pos;
        }
    }
    if (end == null || line == end && endCh == startCh) return;
    return { from: CodeMirror.Pos(line, startCh),
        to: CodeMirror.Pos(end, endCh)
    };
});
CodeMirror.braceRangeFinder = CodeMirror.fold.brace; // deprecated

CodeMirror.registerHelper("fold", "import", function(cm, start) {
    function hasImport(line) {
        if (line < cm.firstLine() || line > cm.lastLine()) return null;
        var start = cm.getTokenAt(CodeMirror.Pos(line, 1));
        if (!/\S/.test(start.string)) start = cm.getTokenAt(CodeMirror.Pos(line, start.end + 1));
        if (start.type != "keyword" || start.string != "import") return null;
        // Now find closing semicolon, return its position
        for (var i = line, e = Math.min(cm.lastLine(), line + 10); i <= e; ++i) {
            var text = cm.getLine(i), semi = text.indexOf(";");
            if (semi != -1) return { startCh: start.end, end: CodeMirror.Pos(i, semi) };
        }
    }

    var start = start.line, has = hasImport(start), prev;
    if (!has || hasImport(start - 1) || ((prev = hasImport(start - 2)) && prev.end.line == start - 1))
        return null;
    for (var end = has.end; ; ) {
        var next = hasImport(end.line + 1);
        if (next == null) break;
        end = next.end;
    }
    return { from: cm.clipPos(CodeMirror.Pos(start, has.startCh + 1)), to: end };
});
CodeMirror.importRangeFinder = CodeMirror.fold["import"]; // deprecated

CodeMirror.registerHelper("fold", "include", function(cm, start) {
    function hasInclude(line) {
        if (line < cm.firstLine() || line > cm.lastLine()) return null;
        var start = cm.getTokenAt(CodeMirror.Pos(line, 1));
        if (!/\S/.test(start.string)) start = cm.getTokenAt(CodeMirror.Pos(line, start.end + 1));
        if (start.type == "meta" && start.string.slice(0, 8) == "#include") return start.start + 8;
    }

    var start = start.line, has = hasInclude(start);
    if (has == null || hasInclude(start - 1) != null) return null;
    for (var end = start; ; ) {
        var next = hasInclude(end + 1);
        if (next == null) break;
        ++end;
    }
    return { from: CodeMirror.Pos(start, has + 1),
        to: cm.clipPos(CodeMirror.Pos(end))
    };
});
CodeMirror.includeRangeFinder = CodeMirror.fold.include; // deprecated



(function() {
    "use strict";

    CodeMirror.showHint = function(cm, getHints, options) {
        // We want a single cursor position.
        if (cm.somethingSelected()) return;
        if (getHints == null) getHints = cm.getHelper(cm.getCursor(), "hint");
        if (getHints == null) return;

        if (cm.state.completionActive) cm.state.completionActive.close();

        var completion = cm.state.completionActive = new Completion(cm, getHints, options || {});
        CodeMirror.signal(cm, "startCompletion", cm);
        if (completion.options.async)
            getHints(cm, function(hints) { completion.showHints(hints); }, completion.options);
        else
            return completion.showHints(getHints(cm, completion.options));
    };

    function Completion(cm, getHints, options) {
        this.cm = cm;
        this.getHints = getHints;
        this.options = options;
        this.widget = this.onClose = null;
    }

    Completion.prototype = {
        close: function() {
            if (!this.active()) return;
            this.cm.state.completionActive = null;

            if (this.widget) this.widget.close();
            if (this.onClose) this.onClose();
            CodeMirror.signal(this.cm, "endCompletion", this.cm);
        },

        active: function() {
            return this.cm.state.completionActive == this;
        },

        pick: function(data, i) {
            var completion = data.list[i];
            if (completion.hint) completion.hint(this.cm, data, completion);
            else this.cm.replaceRange(getText(completion), data.from, data.to);
            this.close();
        },

        showHints: function(data) {
            if (!data || !data.list.length || !this.active()) return this.close();

            if (this.options.completeSingle != false && data.list.length == 1)
                this.pick(data, 0);
            else
                this.showWidget(data);
        },

        showWidget: function(data) {
            this.widget = new Widget(this, data);
            CodeMirror.signal(data, "shown");

            var debounce = null, completion = this, finished;
            var closeOn = this.options.closeCharacters || /[\s()\[\]{};:>,]/;
            var startPos = this.cm.getCursor(), startLen = this.cm.getLine(startPos.line).length;

            function done() {
                if (finished) return;
                finished = true;
                completion.close();
                completion.cm.off("cursorActivity", activity);
                CodeMirror.signal(data, "close");
            }
            function isDone() {
                if (finished) return true;
                if (!completion.widget) { done(); return true; }
            }

            function update() {
                if (isDone()) return;
                CodeMirror.signal(data, "update");
                if (completion.options.async)
                    completion.getHints(completion.cm, finishUpdate, completion.options);
                else
                    finishUpdate(completion.getHints(completion.cm, completion.options));
            }
            function finishUpdate(data_) {
                data = data_;
                if (isDone()) return;
                if (!data || !data.list.length) return done();
                completion.widget.close();
                completion.widget = new Widget(completion, data);
            }

            function activity() {
                clearTimeout(debounce);
                var pos = completion.cm.getCursor(), line = completion.cm.getLine(pos.line);
                if (pos.line != startPos.line || line.length - pos.ch != startLen - startPos.ch ||
            pos.ch < startPos.ch || completion.cm.somethingSelected() ||
            (pos.ch && closeOn.test(line.charAt(pos.ch - 1))))
                    completion.close();
                else
                    debounce = setTimeout(update, 170);
            }
            this.cm.on("cursorActivity", activity);
            this.onClose = done;
        }
    };

    function getText(completion) {
        if (typeof completion == "string") return completion;
        else return completion.text;
    }

    function buildKeyMap(options, handle) {
        var baseMap = {
            Up: function() { handle.moveFocus(-1); },
            Down: function() { handle.moveFocus(1); },
            PageUp: function() { handle.moveFocus(-handle.menuSize()); },
            PageDown: function() { handle.moveFocus(handle.menuSize()); },
            Home: function() { handle.setFocus(0); },
            End: function() { handle.setFocus(handle.length); },
            Enter: handle.pick,
            Tab: handle.pick,
            Esc: handle.close
        };
        var ourMap = options.customKeys ? {} : baseMap;
        function addBinding(key, val) {
            var bound;
            if (typeof val != "string")
                bound = function(cm) { return val(cm, handle); };
            // This mechanism is deprecated
            else if (baseMap.hasOwnProperty(val))
                bound = baseMap[val];
            else
                bound = val;
            ourMap[key] = bound;
        }
        if (options.customKeys)
            for (var key in options.customKeys) if (options.customKeys.hasOwnProperty(key))
            addBinding(key, options.customKeys[key]);
        if (options.extraKeys)
            for (var key in options.extraKeys) if (options.extraKeys.hasOwnProperty(key))
            addBinding(key, options.extraKeys[key]);
        return ourMap;
    }

    function Widget(completion, data) {
        this.completion = completion;
        this.data = data;
        var widget = this, cm = completion.cm, options = completion.options;

        var hints = this.hints = document.createElement("ul");
        hints.className = "CodeMirror-hints";
        this.selectedHint = 0;

        var completions = data.list;
        for (var i = 0; i < completions.length; ++i) {
            var elt = hints.appendChild(document.createElement("li")), cur = completions[i];
            var className = "CodeMirror-hint" + (i ? "" : " CodeMirror-hint-active");
            if (cur.className != null) className = cur.className + " " + className;
            elt.className = className;
            if (cur.render) cur.render(elt, data, cur);
            else elt.appendChild(document.createTextNode(cur.displayText || getText(cur)));
            elt.hintId = i;
        }

        var pos = cm.cursorCoords(options.alignWithWord !== false ? data.from : null);
        var left = pos.left, top = pos.bottom, below = true;
        hints.style.left = left + "px";
        hints.style.top = top + "px";
        // If we're at the edge of the screen, then we want the menu to appear on the left of the cursor.
        var winW = window.innerWidth || Math.max(document.body.offsetWidth, document.documentElement.offsetWidth);
        var winH = window.innerHeight || Math.max(document.body.offsetHeight, document.documentElement.offsetHeight);
        var box = hints.getBoundingClientRect();
        var overlapX = box.right - winW, overlapY = box.bottom - winH;
        if (overlapX > 0) {
            if (box.right - box.left > winW) {
                hints.style.width = (winW - 5) + "px";
                overlapX -= (box.right - box.left) - winW;
            }
            hints.style.left = (left = pos.left - overlapX) + "px";
        }
        if (overlapY > 0) {
            var height = box.bottom - box.top;
            if (box.top - (pos.bottom - pos.top) - height > 0) {
                overlapY = height + (pos.bottom - pos.top);
                below = false;
            } else if (height > winH) {
                hints.style.height = (winH - 5) + "px";
                overlapY -= height - winH;
            }
            hints.style.top = (top = pos.bottom - overlapY) + "px";
        }
        (options.container || document.body).appendChild(hints);

        cm.addKeyMap(this.keyMap = buildKeyMap(options, {
            moveFocus: function(n) { widget.changeActive(widget.selectedHint + n); },
            setFocus: function(n) { widget.changeActive(n); },
            menuSize: function() { return widget.screenAmount(); },
            length: completions.length,
            close: function() { completion.close(); },
            pick: function() { widget.pick(); }
        }));

        if (options.closeOnUnfocus !== false) {
            var closingOnBlur;
            cm.on("blur", this.onBlur = function() { closingOnBlur = setTimeout(function() { completion.close(); }, 100); });
            cm.on("focus", this.onFocus = function() { clearTimeout(closingOnBlur); });
        }

        var startScroll = cm.getScrollInfo();
        cm.on("scroll", this.onScroll = function() {
            var curScroll = cm.getScrollInfo(), editor = cm.getWrapperElement().getBoundingClientRect();
            var newTop = top + startScroll.top - curScroll.top;
            var point = newTop - (window.pageYOffset || (document.documentElement || document.body).scrollTop);
            if (!below) point += hints.offsetHeight;
            if (point <= editor.top || point >= editor.bottom) return completion.close();
            hints.style.top = newTop + "px";
            hints.style.left = (left + startScroll.left - curScroll.left) + "px";
        });

        CodeMirror.on(hints, "dblclick", function(e) {
            var t = e.target || e.srcElement;
            if (t.hintId != null) { widget.changeActive(t.hintId); widget.pick(); }
        });
        CodeMirror.on(hints, "click", function(e) {
            var t = e.target || e.srcElement;
            if (t.hintId != null) widget.changeActive(t.hintId);
        });
        CodeMirror.on(hints, "mousedown", function() {
            setTimeout(function() { cm.focus(); }, 20);
        });

        CodeMirror.signal(data, "select", completions[0], hints.firstChild);
        return true;
    }

    Widget.prototype = {
        close: function() {
            if (this.completion.widget != this) return;
            this.completion.widget = null;
            this.hints.parentNode.removeChild(this.hints);
            this.completion.cm.removeKeyMap(this.keyMap);

            var cm = this.completion.cm;
            if (this.completion.options.closeOnUnfocus !== false) {
                cm.off("blur", this.onBlur);
                cm.off("focus", this.onFocus);
            }
            cm.off("scroll", this.onScroll);
        },

        pick: function() {
            this.completion.pick(this.data, this.selectedHint);
        },

        changeActive: function(i) {
            i = Math.max(0, Math.min(i, this.data.list.length - 1));
            if (this.selectedHint == i) return;
            var node = this.hints.childNodes[this.selectedHint];
            node.className = node.className.replace(" CodeMirror-hint-active", "");
            node = this.hints.childNodes[this.selectedHint = i];
            node.className += " CodeMirror-hint-active";
            if (node.offsetTop < this.hints.scrollTop)
                this.hints.scrollTop = node.offsetTop - 3;
            else if (node.offsetTop + node.offsetHeight > this.hints.scrollTop + this.hints.clientHeight)
                this.hints.scrollTop = node.offsetTop + node.offsetHeight - this.hints.clientHeight + 3;
            CodeMirror.signal(this.data, "select", this.data.list[this.selectedHint], node);
        },

        screenAmount: function() {
            return Math.floor(this.hints.clientHeight / this.hints.firstChild.offsetHeight) || 1;
        }
    };
})();





(function() {
    var Pos = CodeMirror.Pos;

    function SearchCursor(doc, query, pos, caseFold) {
        this.atOccurrence = false; this.doc = doc;
        if (caseFold == null && typeof query == "string") caseFold = false;

        pos = pos ? doc.clipPos(pos) : Pos(0, 0);
        this.pos = { from: pos, to: pos };

        // The matches method is filled in based on the type of query.
        // It takes a position and a direction, and returns an object
        // describing the next occurrence of the query, or null if no
        // more matches were found.
        if (typeof query != "string") { // Regexp match
            if (!query.global) query = new RegExp(query.source, query.ignoreCase ? "ig" : "g");
            this.matches = function(reverse, pos) {
                if (reverse) {
                    query.lastIndex = 0;
                    var line = doc.getLine(pos.line).slice(0, pos.ch), cutOff = 0, match, start;
                    for (; ; ) {
                        query.lastIndex = cutOff;
                        var newMatch = query.exec(line);
                        if (!newMatch) break;
                        match = newMatch;
                        start = match.index;
                        cutOff = match.index + (match[0].length || 1);
                        if (cutOff == line.length) break;
                    }
                    var matchLen = (match && match[0].length) || 0;
                    if (!matchLen) {
                        if (start == 0 && line.length == 0) { match = undefined; }
                        else if (start != doc.getLine(pos.line).length) {
                            matchLen++;
                        }
                    }
                } else {
                    query.lastIndex = pos.ch;
                    var line = doc.getLine(pos.line), match = query.exec(line);
                    var matchLen = (match && match[0].length) || 0;
                    var start = match && match.index;
                    if (start + matchLen != line.length && !matchLen) matchLen = 1;
                }
                if (match && matchLen)
                    return { from: Pos(pos.line, start),
                        to: Pos(pos.line, start + matchLen),
                        match: match
                    };
            };
        } else { // String query
            if (caseFold) query = query.toLowerCase();
            var fold = caseFold ? function(str) { return str.toLowerCase(); } : function(str) { return str; };
            var target = query.split("\n");
            // Different methods for single-line and multi-line queries
            if (target.length == 1) {
                if (!query.length) {
                    // Empty string would match anything and never progress, so
                    // we define it to match nothing instead.
                    this.matches = function() { };
                } else {
                    this.matches = function(reverse, pos) {
                        var line = fold(doc.getLine(pos.line)), len = query.length, match;
                        if (reverse ? (pos.ch >= len && (match = line.lastIndexOf(query, pos.ch - len)) != -1)
                        : (match = line.indexOf(query, pos.ch)) != -1)
                            return { from: Pos(pos.line, match),
                                to: Pos(pos.line, match + len)
                            };
                    };
                }
            } else {
                this.matches = function(reverse, pos) {
                    var ln = pos.line, idx = (reverse ? target.length - 1 : 0), match = target[idx], line = fold(doc.getLine(ln));
                    var offsetA = (reverse ? line.indexOf(match) + match.length : line.lastIndexOf(match));
                    if (reverse ? offsetA >= pos.ch || offsetA != match.length
              : offsetA <= pos.ch || offsetA != line.length - match.length)
                        return;
                    for (; ; ) {
                        if (reverse ? !ln : ln == doc.lineCount() - 1) return;
                        line = fold(doc.getLine(ln += reverse ? -1 : 1));
                        match = target[reverse ? --idx : ++idx];
                        if (idx > 0 && idx < target.length - 1) {
                            if (line != match) return;
                            else continue;
                        }
                        var offsetB = (reverse ? line.lastIndexOf(match) : line.indexOf(match) + match.length);
                        if (reverse ? offsetB != line.length - match.length : offsetB != match.length)
                            return;
                        var start = Pos(pos.line, offsetA), end = Pos(ln, offsetB);
                        return { from: reverse ? end : start, to: reverse ? start : end };
                    }
                };
            }
        }
    }

    SearchCursor.prototype = {
        findNext: function() { return this.find(false); },
        findPrevious: function() { return this.find(true); },

        find: function(reverse) {
            var self = this, pos = this.doc.clipPos(reverse ? this.pos.from : this.pos.to);
            function savePosAndFail(line) {
                var pos = Pos(line, 0);
                self.pos = { from: pos, to: pos };
                self.atOccurrence = false;
                return false;
            }

            for (; ; ) {
                if (this.pos = this.matches(reverse, pos)) {
                    if (!this.pos.from || !this.pos.to) { console.log(this.matches, this.pos); }
                    this.atOccurrence = true;
                    return this.pos.match || true;
                }
                if (reverse) {
                    if (!pos.line) return savePosAndFail(0);
                    pos = Pos(pos.line - 1, this.doc.getLine(pos.line - 1).length);
                }
                else {
                    var maxLine = this.doc.lineCount();
                    if (pos.line == maxLine - 1) return savePosAndFail(maxLine);
                    pos = Pos(pos.line + 1, 0);
                }
            }
        },

        from: function() { if (this.atOccurrence) return this.pos.from; },
        to: function() { if (this.atOccurrence) return this.pos.to; },

        replace: function(newText) {
            if (!this.atOccurrence) return;
            var lines = CodeMirror.splitLines(newText);
            this.doc.replaceRange(lines, this.pos.from, this.pos.to);
            this.pos.to = Pos(this.pos.from.line + lines.length - 1,
                        lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0));
        }
    };

    CodeMirror.defineExtension("getSearchCursor", function(query, pos, caseFold) {
        return new SearchCursor(this.doc, query, pos, caseFold);
    });
    CodeMirror.defineDocExtension("getSearchCursor", function(query, pos, caseFold) {
        return new SearchCursor(this, query, pos, caseFold);
    });
})();



(function() {
    "use strict";
    var GUTTER_ID = "CodeMirror-lint-markers";
    var SEVERITIES = /^(?:error|warning)$/;

    function showTooltip(e, content) {
        var tt = document.createElement("div");
        tt.className = "CodeMirror-lint-tooltip";
        tt.appendChild(content.cloneNode(true));
        document.body.appendChild(tt);

        function position(e) {
            if (!tt.parentNode) return CodeMirror.off(document, "mousemove", position);
            tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + "px";
            tt.style.left = (e.clientX + 5) + "px";
        }
        CodeMirror.on(document, "mousemove", position);
        position(e);
        if (tt.style.opacity != null) tt.style.opacity = 1;
        return tt;
    }
    function rm(elt) {
        if (elt.parentNode) elt.parentNode.removeChild(elt);
    }
    function hideTooltip(tt) {
        if (!tt.parentNode) return;
        if (tt.style.opacity == null) rm(tt);
        tt.style.opacity = 0;
        setTimeout(function() { rm(tt); }, 600);
    }

    function showTooltipFor(e, content, node) {
        var tooltip = showTooltip(e, content);
        function hide() {
            CodeMirror.off(node, "mouseout", hide);
            if (tooltip) { hideTooltip(tooltip); tooltip = null; }
        }
        var poll = setInterval(function() {
            if (tooltip) for (var n = node; ; n = n.parentNode) {
                if (n == document.body) return;
                if (!n) { hide(); break; }
            }
            if (!tooltip) return clearInterval(poll);
        }, 400);
        CodeMirror.on(node, "mouseout", hide);
    }

    function LintState(cm, options, hasGutter) {
        this.marked = [];
        this.options = options;
        this.timeout = null;
        this.hasGutter = hasGutter;
        this.onMouseOver = function(e) { onMouseOver(cm, e); };
    }

    function parseOptions(cm, options) {
        if (options instanceof Function) return { getAnnotations: options };
        if (!options || options === true) options = {};
        if (!options.getAnnotations) options.getAnnotations = cm.getHelper(CodeMirror.Pos(0, 0), "lint");
        if (!options.getAnnotations) throw new Error("Required option 'getAnnotations' missing (lint addon)");
        return options;
    }

    function clearMarks(cm) {
        var state = cm.state.lint;
        if (state.hasGutter) cm.clearGutter(GUTTER_ID);
        for (var i = 0; i < state.marked.length; ++i)
            state.marked[i].clear();
        state.marked.length = 0;
    }

    function makeMarker(labels, severity, multiple, tooltips) {
        var marker = document.createElement("div"), inner = marker;
        marker.className = "CodeMirror-lint-marker-" + severity;
        if (multiple) {
            inner = marker.appendChild(document.createElement("div"));
            inner.className = "CodeMirror-lint-marker-multiple";
        }

        if (tooltips != false) CodeMirror.on(inner, "mouseover", function(e) {
            showTooltipFor(e, labels, inner);
        });

        return marker;
    }

    function getMaxSeverity(a, b) {
        if (a == "error") return a;
        else return b;
    }

    function groupByLine(annotations) {
        var lines = [];
        for (var i = 0; i < annotations.length; ++i) {
            var ann = annotations[i], line = ann.from.line;
            (lines[line] || (lines[line] = [])).push(ann);
        }
        return lines;
    }

    function annotationTooltip(ann) {
        var severity = ann.severity;
        if (!SEVERITIES.test(severity)) severity = "error";
        var tip = document.createElement("div");
        tip.className = "CodeMirror-lint-message-" + severity;
        tip.appendChild(document.createTextNode(ann.message));
        return tip;
    }

    function startLinting(cm) {
        var state = cm.state.lint, options = state.options;
        if (options.async)
            options.getAnnotations(cm, updateLinting, options);
        else
            updateLinting(cm, options.getAnnotations(cm.getValue()));
    }

    function updateLinting(cm, annotationsNotSorted) {
        clearMarks(cm);
        var state = cm.state.lint, options = state.options;

        var annotations = groupByLine(annotationsNotSorted);

        for (var line = 0; line < annotations.length; ++line) {
            var anns = annotations[line];
            if (!anns) continue;

            var maxSeverity = null;
            var tipLabel = state.hasGutter && document.createDocumentFragment();

            for (var i = 0; i < anns.length; ++i) {
                var ann = anns[i];
                var severity = ann.severity;
                if (!SEVERITIES.test(severity)) severity = "error";
                maxSeverity = getMaxSeverity(maxSeverity, severity);

                if (options.formatAnnotation) ann = options.formatAnnotation(ann);
                if (state.hasGutter) tipLabel.appendChild(annotationTooltip(ann));

                if (ann.to) state.marked.push(cm.markText(ann.from, ann.to, {
                    className: "CodeMirror-lint-mark-" + severity,
                    __annotation: ann
                }));
            }

            if (state.hasGutter)
                cm.setGutterMarker(line, GUTTER_ID, makeMarker(tipLabel, maxSeverity, anns.length > 1,
                                                       state.options.tooltips));
        }
        if (options.onUpdateLinting) options.onUpdateLinting(annotationsNotSorted, annotations, cm);
    }

    function onChange(cm) {
        var state = cm.state.lint;
        clearTimeout(state.timeout);
        state.timeout = setTimeout(function() { startLinting(cm); }, state.options.delay || 500);
    }

    function popupSpanTooltip(ann, e) {
        var target = e.target || e.srcElement;
        showTooltipFor(e, annotationTooltip(ann), target);
    }

    // When the mouseover fires, the cursor might not actually be over
    // the character itself yet. These pairs of x,y offsets are used to
    // probe a few nearby points when no suitable marked range is found.
    var nearby = [0, 0, 0, 5, 0, -5, 5, 0, -5, 0];

    function onMouseOver(cm, e) {
        if (!/\bCodeMirror-lint-mark-/.test((e.target || e.srcElement).className)) return;
        for (var i = 0; i < nearby.length; i += 2) {
            var spans = cm.findMarksAt(cm.coordsChar({ left: e.clientX + nearby[i],
                top: e.clientY + nearby[i + 1]
            }));
            for (var j = 0; j < spans.length; ++j) {
                var span = spans[j], ann = span.__annotation;
                if (ann) return popupSpanTooltip(ann, e);
            }
        }
    }

    function optionHandler(cm, val, old) {
        if (old && old != CodeMirror.Init) {
            clearMarks(cm);
            cm.off("change", onChange);
            CodeMirror.off(cm.getWrapperElement(), "mouseover", cm.state.lint.onMouseOver);
            delete cm.state.lint;
        }

        if (val) {
            var gutters = cm.getOption("gutters"), hasLintGutter = false;
            for (var i = 0; i < gutters.length; ++i) if (gutters[i] == GUTTER_ID) hasLintGutter = true;
            var state = cm.state.lint = new LintState(cm, parseOptions(cm, val), hasLintGutter);
            cm.on("change", onChange);
            if (state.options.tooltips != false)
                CodeMirror.on(cm.getWrapperElement(), "mouseover", state.onMouseOver);

            startLinting(cm);
        }
    }

    CodeMirror.defineOption("lintWith", false, optionHandler); // deprecated
    CodeMirror.defineOption("lint", false, optionHandler); // deprecated
})();

// Because sometimes you need to style the cursor's line.
//
// Adds an option 'styleActiveLine' which, when enabled, gives the
// active line's wrapping <div> the CSS class "CodeMirror-activeline",
// and gives its background <div> the class "CodeMirror-activeline-background".

(function() {
    "use strict";
    var WRAP_CLASS = "CodeMirror-activeline";
    var BACK_CLASS = "CodeMirror-activeline-background";

    CodeMirror.defineOption("styleActiveLine", false, function(cm, val, old) {
        var prev = old && old != CodeMirror.Init;
        if (val && !prev) {
            updateActiveLine(cm);
            cm.on("cursorActivity", updateActiveLine);
        } else if (!val && prev) {
            cm.off("cursorActivity", updateActiveLine);
            clearActiveLine(cm);
            delete cm.state.activeLine;
        }
    });

    function clearActiveLine(cm) {
        if ("activeLine" in cm.state) {
            cm.removeLineClass(cm.state.activeLine, "wrap", WRAP_CLASS);
            cm.removeLineClass(cm.state.activeLine, "background", BACK_CLASS);
        }
    }

    function updateActiveLine(cm) {
        var line = cm.getLineHandleVisualStart(cm.getCursor().line);
        if (cm.state.activeLine == line) return;
        clearActiveLine(cm);
        cm.addLineClass(line, "wrap", WRAP_CLASS);
        cm.addLineClass(line, "background", BACK_CLASS);
        cm.state.activeLine = line;
    }
})();


// Open simple dialogs on top of an editor. Relies on dialog.css.

(function() {
    function dialogDiv(cm, template, bottom) {
        var wrap = cm.getWrapperElement();
        var dialog;
        dialog = wrap.appendChild(document.createElement("div"));
        if (bottom) {
            dialog.className = "CodeMirror-dialog CodeMirror-dialog-bottom";
        } else {
            dialog.className = "CodeMirror-dialog CodeMirror-dialog-top";
        }
        dialog.innerHTML = template;
        return dialog;
    }

    CodeMirror.defineExtension("openDialog", function(template, callback, options) {
        var dialog = dialogDiv(this, template, options && options.bottom);
        var closed = false, me = this;
        function close() {
            if (closed) return;
            closed = true;
            dialog.parentNode.removeChild(dialog);
        }
        var inp = dialog.getElementsByTagName("input")[0], button;
        if (inp) {
            CodeMirror.on(inp, "keydown", function(e) {
                if (options && options.onKeyDown && options.onKeyDown(e, inp.value, close)) { return; }
                if (e.keyCode == 13 || e.keyCode == 27) {
                    CodeMirror.e_stop(e);
                    close();
                    me.focus();
                    if (e.keyCode == 13) callback(inp.value);
                }
            });
            if (options && options.onKeyUp) {
                CodeMirror.on(inp, "keyup", function(e) { options.onKeyUp(e, inp.value, close); });
            }
            if (options && options.value) inp.value = options.value;
            inp.focus();
            CodeMirror.on(inp, "blur", close);
        } else if (button = dialog.getElementsByTagName("button")[0]) {
            CodeMirror.on(button, "click", function() {
                close();
                me.focus();
            });
            button.focus();
            CodeMirror.on(button, "blur", close);
        }
        return close;
    });

    CodeMirror.defineExtension("openConfirm", function(template, callbacks, options) {
        var dialog = dialogDiv(this, template, options && options.bottom);
        var buttons = dialog.getElementsByTagName("button");
        var closed = false, me = this, blurring = 1;
        function close() {
            if (closed) return;
            closed = true;
            dialog.parentNode.removeChild(dialog);
            me.focus();
        }
        buttons[0].focus();
        for (var i = 0; i < buttons.length; ++i) {
            var b = buttons[i];
            (function(callback) {
                CodeMirror.on(b, "click", function(e) {
                    CodeMirror.e_preventDefault(e);
                    close();
                    if (callback) callback(me);
                });
            })(callbacks[i]);
            CodeMirror.on(b, "blur", function() {
                --blurring;
                setTimeout(function() { if (blurring <= 0) close(); }, 200);
            });
            CodeMirror.on(b, "focus", function() { ++blurring; });
        }
    });
})();


// Highlighting text that matches the selection
//
// Defines an option highlightSelectionMatches, which, when enabled,
// will style strings that match the selection throughout the
// document.
//
// The option can be set to true to simply enable it, or to a
// {minChars, style, showToken} object to explicitly configure it.
// minChars is the minimum amount of characters that should be
// selected for the behavior to occur, and style is the token style to
// apply to the matches. This will be prefixed by "cm-" to create an
// actual CSS class name. showToken, when enabled, will cause the
// current token to be highlighted when nothing is selected.

(function() {
    var DEFAULT_MIN_CHARS = 2;
    var DEFAULT_TOKEN_STYLE = "matchhighlight";

    function State(options) {
        if (typeof options == "object") {
            this.minChars = options.minChars;
            this.style = options.style;
            this.showToken = options.showToken;
        }
        if (this.style == null) this.style = DEFAULT_TOKEN_STYLE;
        if (this.minChars == null) this.minChars = DEFAULT_MIN_CHARS;
        this.overlay = this.timeout = null;
    }

    CodeMirror.defineOption("highlightSelectionMatches", false, function(cm, val, old) {
        if (old && old != CodeMirror.Init) {
            var over = cm.state.matchHighlighter.overlay;
            if (over) cm.removeOverlay(over);
            clearTimeout(cm.state.matchHighlighter.timeout);
            cm.state.matchHighlighter = null;
            cm.off("cursorActivity", cursorActivity);
        }
        if (val) {
            cm.state.matchHighlighter = new State(val);
            highlightMatches(cm);
            cm.on("cursorActivity", cursorActivity);
        }
    });

    function cursorActivity(cm) {
        var state = cm.state.matchHighlighter;
        clearTimeout(state.timeout);
        state.timeout = setTimeout(function() { highlightMatches(cm); }, 100);
    }

    function highlightMatches(cm) {
        cm.operation(function() {
            var state = cm.state.matchHighlighter;
            if (state.overlay) {
                cm.removeOverlay(state.overlay);
                state.overlay = null;
            }
            if (!cm.somethingSelected() && state.showToken) {
                var re = state.showToken === true ? /[\w$]/ : state.showToken;
                var cur = cm.getCursor(), line = cm.getLine(cur.line), start = cur.ch, end = start;
                while (start && re.test(line.charAt(start - 1))) --start;
                while (end < line.length && re.test(line.charAt(end))) ++end;
                if (start < end)
                    cm.addOverlay(state.overlay = makeOverlay(line.slice(start, end), re, state.style));
                return;
            }
            if (cm.getCursor("head").line != cm.getCursor("anchor").line) return;
            var selection = cm.getSelection().replace(/^\s+|\s+$/g, "");
            if (selection.length >= state.minChars)
                cm.addOverlay(state.overlay = makeOverlay(selection, false, state.style));
        });
    }

    function boundariesAround(stream, re) {
        return (!stream.start || !re.test(stream.string.charAt(stream.start - 1))) &&
      (stream.pos == stream.string.length || !re.test(stream.string.charAt(stream.pos)));
    }

    function makeOverlay(query, hasBoundary, style) {
        return { token: function(stream) {
            if (stream.match(query) &&
          (!hasBoundary || boundariesAround(stream, hasBoundary)))
                return style;
            stream.next();
            stream.skipTo(query.charAt(0)) || stream.skipToEnd();
        } 
        };
    }
})();

// Define search commands. Depends on dialog.js or another
// implementation of the openDialog method.

// Replace works a little oddly -- it will do the replace on the next
// Ctrl-G (or whatever is bound to findNext) press. You prevent a
// replace by making sure the match is no longer selected when hitting
// Ctrl-G.

(function() {
    function searchOverlay(query) {
        if (typeof query == "string") return { token: function(stream) {
            if (stream.match(query)) return "searching";
            stream.next();
            stream.skipTo(query.charAt(0)) || stream.skipToEnd();
        } 
        };
        return { token: function(stream) {
            if (stream.match(query)) return "searching";
            while (!stream.eol()) {
                stream.next();
                if (stream.match(query, false)) break;
            }
        } 
        };
    }

    function SearchState() {
        this.posFrom = this.posTo = this.query = null;
        this.overlay = null;
    }
    function getSearchState(cm) {
        return cm.state.search || (cm.state.search = new SearchState());
    }
    function getSearchCursor(cm, query, pos) {
        // Heuristic: if the query string is all lowercase, do a case insensitive search.
        return cm.getSearchCursor(query, pos, typeof query == "string" && query == query.toLowerCase());
    }
    function dialog(cm, text, shortText, f) {
        if (cm.openDialog) cm.openDialog(text, f);
        else f(prompt(shortText, ""));
    }
    function confirmDialog(cm, text, shortText, fs) {
        if (cm.openConfirm) cm.openConfirm(text, fs);
        else if (confirm(shortText)) fs[0]();
    }
    function parseQuery(query) {
        var isRE = query.match(/^\/(.*)\/([a-z]*)$/);
        return isRE ? new RegExp(isRE[1], isRE[2].indexOf("i") == -1 ? "" : "i") : query;
    }
    var queryDialog =
    'Search: <input type="text" style="width: 10em"/> <span style="color: #888">(Use /re/ syntax for regexp search)</span>';
    function doSearch(cm, rev) {
        var state = getSearchState(cm);
        if (state.query) return findNext(cm, rev);
        dialog(cm, queryDialog, "Search for:", function(query) {
            cm.operation(function() {
                if (!query || state.query) return;
                state.query = parseQuery(query);
                cm.removeOverlay(state.overlay);
                state.overlay = searchOverlay(state.query);
                cm.addOverlay(state.overlay);
                state.posFrom = state.posTo = cm.getCursor();
                findNext(cm, rev);
            });
        });
    }
    function findNext(cm, rev) {
        cm.operation(function() {
            var state = getSearchState(cm);
            var cursor = getSearchCursor(cm, state.query, rev ? state.posFrom : state.posTo);
            if (!cursor.find(rev)) {
                cursor = getSearchCursor(cm, state.query, rev ? CodeMirror.Pos(cm.lastLine()) : CodeMirror.Pos(cm.firstLine(), 0));
                if (!cursor.find(rev)) return;
            }
            cm.setSelection(cursor.from(), cursor.to());
            state.posFrom = cursor.from(); state.posTo = cursor.to();
        });
    }
    function clearSearch(cm) {
        cm.operation(function() {
            var state = getSearchState(cm);
            if (!state.query) return;
            state.query = null;
            cm.removeOverlay(state.overlay);
        });
    }

    var replaceQueryDialog =
    'Replace: <input type="text" style="width: 10em"/> <span style="color: #888">(Use /re/ syntax for regexp search)</span>';
    var replacementQueryDialog = 'With: <input type="text" style="width: 10em"/>';
    var doReplaceConfirm = "Replace? <button>Yes</button> <button>No</button> <button>Stop</button>";
    function replace(cm, all) {
        dialog(cm, replaceQueryDialog, "Replace:", function(query) {
            if (!query) return;
            query = parseQuery(query);
            dialog(cm, replacementQueryDialog, "Replace with:", function(text) {
                if (all) {
                    cm.operation(function() {
                        for (var cursor = getSearchCursor(cm, query); cursor.findNext(); ) {
                            if (typeof query != "string") {
                                var match = cm.getRange(cursor.from(), cursor.to()).match(query);
                                cursor.replace(text.replace(/\$(\d)/, function(_, i) { return match[i]; }));
                            } else cursor.replace(text);
                        }
                    });
                } else {
                    clearSearch(cm);
                    var cursor = getSearchCursor(cm, query, cm.getCursor());
                    var advance = function() {
                        var start = cursor.from(), match;
                        if (!(match = cursor.findNext())) {
                            cursor = getSearchCursor(cm, query);
                            if (!(match = cursor.findNext()) ||
                  (start && cursor.from().line == start.line && cursor.from().ch == start.ch)) return;
                        }
                        cm.setSelection(cursor.from(), cursor.to());
                        confirmDialog(cm, doReplaceConfirm, "Replace?",
                          [function() { doReplace(match); }, advance]);
                    };
                    var doReplace = function(match) {
                        cursor.replace(typeof query == "string" ? text :
                           text.replace(/\$(\d)/, function(_, i) { return match[i]; }));
                        advance();
                    };
                    advance();
                }
            });
        });
    }

    CodeMirror.commands.find = function(cm) { clearSearch(cm); doSearch(cm); };
    CodeMirror.commands.findNext = doSearch;
    CodeMirror.commands.findPrev = function(cm) { doSearch(cm, true); };
    CodeMirror.commands.clearSearch = clearSearch;
    CodeMirror.commands.replace = replace;
    CodeMirror.commands.replaceAll = function(cm) { replace(cm, true); };
})();



// Glue code between CodeMirror and Tern.
//
// Create a CodeMirror.TernServer to wrap an actual Tern server,
// register open documents (CodeMirror.Doc instances) with it, and
// call its methods to activate the assisting functions that Tern
// provides.
//
// Options supported (all optional):
// * defs: An array of JSON definition data structures.
// * plugins: An object mapping plugin names to configuration
//   options.
// * getFile: A function(name, c) that can be used to access files in
//   the project that haven't been loaded yet. Simply do c(null) to
//   indicate that a file is not available.
// * fileFilter: A function(value, docName, doc) that will be applied
//   to documents before passing them on to Tern.
// * switchToDoc: A function(name) that should, when providing a
//   multi-file view, switch the view or focus to the named file.
// * showError: A function(editor, message) that can be used to
//   override the way errors are displayed.
// * completionTip: Customize the content in tooltips for completions.
//   Is passed a single argument¡ªthe completion's data as returned by
//   Tern¡ªand may return a string, DOM node, or null to indicate that
//   no tip should be shown. By default the docstring is shown.
// * typeTip: Like completionTip, but for the tooltips shown for type
//   queries.
//
// It is possible to run the Tern server in a web worker by specifying
// these additional options:
// * useWorker: Set to true to enable web worker mode. You'll probably
//   want to feature detect the actual value you use here, for example
//   !!window.Worker.
// * workerScript: The main script of the worker. Point this to
//   wherever you are hosting worker.js from this directory.
// * workerDeps: An array of paths pointing (relative to workerScript)
//   to the Acorn and Tern libraries and any Tern plugins you want to
//   load. Or, if you minified those into a single script and included
//   them in the workerScript, simply leave this undefined.

(function() {
    "use strict";

    CodeMirror.TernServer = function(options) {
        var self = this;
        this.options = options || {};
        var plugins = this.options.plugins || (this.options.plugins = {});
        if (!plugins.doc_comment) plugins.doc_comment = true;
        if (this.options.useWorker) {
            this.server = new WorkerServer(this);
        } else {
            this.server = new tern.Server({
                getFile: function(name, c) { return getFile(self, name, c); },
                async: true,
                defs: this.options.defs || [],
                plugins: plugins
            });
        }
        this.docs = Object.create(null);
        this.trackChange = function(doc, change) { trackChange(self, doc, change); };

        this.cachedArgHints = null;
        this.activeArgHints = null;
        this.jumpStack = [];
    };

    CodeMirror.TernServer.prototype = {
        addDoc: function(name, doc) {
            var data = { doc: doc, name: name, changed: null };
            this.server.addFile(name, docValue(this, data));
            CodeMirror.on(doc, "change", this.trackChange);
            return this.docs[name] = data;
        },

        delDoc: function(name) {
            var found = this.docs[name];
            if (!found) return;
            CodeMirror.off(found.doc, "change", this.trackChange);
            delete this.docs[name];
            this.server.delFile(name);
        },

        hideDoc: function(name) {
            closeArgHints(this);
            var found = this.docs[name];
            if (found && found.changed) sendDoc(this, found);
        },

        complete: function(cm) {
            var self = this;
            CodeMirror.showHint(cm, function(cm, c) { return hint(self, cm, c); }, { async: true });
        },

        getHint: function(cm, c) { return hint(this, cm, c); },

        showType: function(cm) { showType(this, cm); },

        updateArgHints: function(cm) { updateArgHints(this, cm); },

        jumpToDef: function(cm) { jumpToDef(this, cm); },

        jumpBack: function(cm) { jumpBack(this, cm); },

        rename: function(cm) { rename(this, cm); },

        request: function(cm, query, c) {
            this.server.request(buildRequest(this, findDoc(this, cm.getDoc()), query), c);
        }
    };

    var Pos = CodeMirror.Pos;
    var cls = "CodeMirror-Tern-";
    var bigDoc = 250;

    function getFile(ts, name, c) {
        var buf = ts.docs[name];
        if (buf)
            c(docValue(ts, buf));
        else if (ts.options.getFile)
            ts.options.getFile(name, c);
        else
            c(null);
    }

    function findDoc(ts, doc, name) {
        for (var n in ts.docs) {
            var cur = ts.docs[n];
            if (cur.doc == doc) return cur;
        }
        if (!name) for (var i = 0; ; ++i) {
            n = "[doc" + (i || "") + "]";
            if (!ts.docs[n]) { name = n; break; }
        }
        return ts.addDoc(name, doc);
    }

    function trackChange(ts, doc, change) {
        var data = findDoc(ts, doc);

        var argHints = ts.cachedArgHints;
        if (argHints && argHints.doc == doc && cmpPos(argHints.start, change.to) <= 0)
            ts.cachedArgHints = null;

        var changed = data.changed;
        if (changed == null)
            data.changed = changed = { from: change.from.line, to: change.from.line };
        var end = change.from.line + (change.text.length - 1);
        if (change.from.line < changed.to) changed.to = changed.to - (change.to.line - end);
        if (end >= changed.to) changed.to = end + 1;
        if (changed.from > change.from.line) changed.from = change.from.line;

        if (doc.lineCount() > bigDoc && change.to - changed.from > 100) setTimeout(function() {
            if (data.changed && data.changed.to - data.changed.from > 100) sendDoc(ts, data);
        }, 200);
    }

    function sendDoc(ts, doc) {
        ts.server.request({ files: [{ type: "full", name: doc.name, text: docValue(ts, doc)}] }, function(error) {
            if (error) console.error(error);
            else doc.changed = null;
        });
    }

    // Completion

    function hint(ts, cm, c) {
        ts.request(cm, { type: "completions", types: true, docs: true, urls: true }, function(error, data) {
            if (error) return showError(ts, cm, error);
            var completions = [], after = "";
            var from = data.start, to = data.end;
            if (cm.getRange(Pos(from.line, from.ch - 2), from) == "[\"" &&
          cm.getRange(to, Pos(to.line, to.ch + 2)) != "\"]")
                after = "\"]";

            for (var i = 0; i < data.completions.length; ++i) {
                var completion = data.completions[i], className = typeToIcon(completion.type);
                if (data.guess) className += " " + cls + "guess";
                completions.push({ text: completion.name + after,
                    displayText: completion.name,
                    className: className,
                    data: completion
                });
            }

            var obj = { from: from, to: to, list: completions };
            var tooltip = null;
            CodeMirror.on(obj, "close", function() { remove(tooltip); });
            CodeMirror.on(obj, "update", function() { remove(tooltip); });
            CodeMirror.on(obj, "select", function(cur, node) {
                remove(tooltip);
                var content = ts.options.completionTip ? ts.options.completionTip(cur.data) : cur.data.doc;
                if (content) {
                    tooltip = makeTooltip(node.parentNode.getBoundingClientRect().right + window.pageXOffset,
                                node.getBoundingClientRect().top + window.pageYOffset, content);
                    tooltip.className += " " + cls + "hint-doc";
                }
            });
            c(obj);
        });
    }

    function typeToIcon(type) {
        var suffix;
        if (type == "?") suffix = "unknown";
        else if (type == "number" || type == "string" || type == "bool") suffix = type;
        else if (/^fn\(/.test(type)) suffix = "fn";
        else if (/^\[/.test(type)) suffix = "array";
        else suffix = "object";
        return cls + "completion " + cls + "completion-" + suffix;
    }

    // Type queries

    function showType(ts, cm) {
        ts.request(cm, "type", function(error, data) {
            if (error) return showError(ts, cm, error);
            if (ts.options.typeTip) {
                var tip = ts.options.typeTip(data);
            } else {
                var tip = elt("span", null, elt("strong", null, data.type || "not found"));
                if (data.doc)
                    tip.appendChild(document.createTextNode(" ¡ª " + data.doc));
                if (data.url) {
                    tip.appendChild(document.createTextNode(" "));
                    tip.appendChild(elt("a", null, "[docs]")).href = data.url;
                }
            }
            tempTooltip(cm, tip);
        });
    }

    // Maintaining argument hints

    function updateArgHints(ts, cm) {
        closeArgHints(ts);

        if (cm.somethingSelected()) return;
        var lex = cm.getTokenAt(cm.getCursor()).state.lexical;
        if (lex.info != "call") return;

        var ch = lex.column, pos = lex.pos || 0;
        for (var line = cm.getCursor().line, e = Math.max(0, line - 9), found = false; line >= e; --line)
            if (cm.getLine(line).charAt(ch) == "(") { found = true; break; }
        if (!found) return;

        var start = Pos(line, ch);
        var cache = ts.cachedArgHints;
        if (cache && cache.doc == cm.getDoc() && cmpPos(start, cache.start) == 0)
            return showArgHints(ts, cm, pos);

        ts.request(cm, { type: "type", preferFunction: true, end: start }, function(error, data) {
            if (error || !data.type || !(/^fn\(/).test(data.type)) return;
            ts.cachedArgHints = {
                start: pos,
                type: parseFnType(data.type),
                name: data.exprName || data.name || "fn",
                guess: data.guess,
                doc: cm.getDoc()
            };
            showArgHints(ts, cm, pos);
        });
    }

    function showArgHints(ts, cm, pos) {
        closeArgHints(ts);

        var cache = ts.cachedArgHints, tp = cache.type;
        var tip = elt("span", cache.guess ? cls + "fhint-guess" : null,
                  elt("span", cls + "fname", cache.name), "(");
        for (var i = 0; i < tp.args.length; ++i) {
            if (i) tip.appendChild(document.createTextNode(", "));
            var arg = tp.args[i];
            tip.appendChild(elt("span", cls + "farg" + (i == pos ? " " + cls + "farg-current" : ""), arg.name || "?"));
            if (arg.type != "?") {
                tip.appendChild(document.createTextNode(":\u00a0"));
                tip.appendChild(elt("span", cls + "type", arg.type));
            }
        }
        tip.appendChild(document.createTextNode(tp.rettype ? ") ->\u00a0" : ")"));
        if (tp.rettype) tip.appendChild(elt("span", cls + "type", tp.rettype));
        var place = cm.cursorCoords(null, "page");
        ts.activeArgHints = makeTooltip(place.right + 1, place.bottom, tip);
    }

    function parseFnType(text) {
        var args = [], pos = 3;

        function skipMatching(upto) {
            var depth = 0, start = pos;
            for (; ; ) {
                var next = text.charAt(pos);
                if (upto.test(next) && !depth) return text.slice(start, pos);
                if (/[{\[\(]/.test(next)) ++depth;
                else if (/[}\]\)]/.test(next)) --depth;
                ++pos;
            }
        }

        // Parse arguments
        if (text.charAt(pos) != ")") for (; ; ) {
            var name = text.slice(pos).match(/^([^, \(\[\{]+): /);
            if (name) {
                pos += name[0].length;
                name = name[1];
            }
            args.push({ name: name, type: skipMatching(/[\),]/) });
            if (text.charAt(pos) == ")") break;
            pos += 2;
        }

        var rettype = text.slice(pos).match(/^\) -> (.*)$/);

        return { args: args, rettype: rettype && rettype[1] };
    }

    // Moving to the definition of something

    function jumpToDef(ts, cm) {
        function inner(varName) {
            var req = { type: "definition", variable: varName || null };
            var doc = findDoc(ts, cm.getDoc());
            ts.server.request(buildRequest(ts, doc, req), function(error, data) {
                if (error) return showError(ts, cm, error);
                if (!data.file && data.url) { window.open(data.url); return; }

                if (data.file) {
                    var localDoc = ts.docs[data.file], found;
                    if (localDoc && (found = findContext(localDoc.doc, data))) {
                        ts.jumpStack.push({ file: doc.name,
                            start: cm.getCursor("from"),
                            end: cm.getCursor("to")
                        });
                        moveTo(ts, doc, localDoc, found.start, found.end);
                        return;
                    }
                }
                showError(ts, cm, "Could not find a definition.");
            });
        }

        if (!atInterestingExpression(cm))
            dialog(cm, "Jump to variable", function(name) { if (name) inner(name); });
        else
            inner();
    }

    function jumpBack(ts, cm) {
        var pos = ts.jumpStack.pop(), doc = pos && ts.docs[pos.file];
        if (!doc) return;
        moveTo(ts, findDoc(ts, cm.getDoc()), doc, pos.start, pos.end);
    }

    function moveTo(ts, curDoc, doc, start, end) {
        doc.doc.setSelection(end, start);
        if (curDoc != doc && ts.options.switchToDoc) {
            closeArgHints(ts);
            ts.options.switchToDoc(doc.name);
        }
    }

    // The {line,ch} representation of positions makes this rather awkward.
    function findContext(doc, data) {
        var before = data.context.slice(0, data.contextOffset).split("\n");
        var startLine = data.start.line - (before.length - 1);
        var start = Pos(startLine, (before.length == 1 ? data.start.ch : doc.getLine(startLine).length) - before[0].length);

        var text = doc.getLine(startLine).slice(start.ch);
        for (var cur = startLine + 1; cur < doc.lineCount() && text.length < data.context.length; ++cur)
            text += "\n" + doc.getLine(cur);
        if (text.slice(0, data.context.length) == data.context) return data;

        var cursor = doc.getSearchCursor(data.context, 0, false);
        var nearest, nearestDist = Infinity;
        while (cursor.findNext()) {
            var from = cursor.from(), dist = Math.abs(from.line - start.line) * 10000;
            if (!dist) dist = Math.abs(from.ch - start.ch);
            if (dist < nearestDist) { nearest = from; nearestDist = dist; }
        }
        if (!nearest) return null;

        if (before.length == 1)
            nearest.ch += before[0].length;
        else
            nearest = Pos(nearest.line + (before.length - 1), before[before.length - 1].length);
        if (data.start.line == data.end.line)
            var end = Pos(nearest.line, nearest.ch + (data.end.ch - data.start.ch));
        else
            var end = Pos(nearest.line + (data.end.line - data.start.line), data.end.ch);
        return { start: nearest, end: end };
    }

    function atInterestingExpression(cm) {
        var pos = cm.getCursor("end"), tok = cm.getTokenAt(pos);
        if (tok.start < pos.ch && (tok.type == "comment" || tok.type == "string")) return false;
        return /\w/.test(cm.getLine(pos.line).slice(Math.max(pos.ch - 1, 0), pos.ch + 1));
    }

    // Variable renaming

    function rename(ts, cm) {
        var token = cm.getTokenAt(cm.getCursor());
        if (!/\w/.test(token.string)) showError(ts, cm, "Not at a variable");
        dialog(cm, "New name for " + token.string, function(newName) {
            ts.request(cm, { type: "rename", newName: newName, fullDocs: true }, function(error, data) {
                if (error) return showError(ts, cm, error);
                applyChanges(ts, data.changes);
            });
        });
    }

    var nextChangeOrig = 0;
    function applyChanges(ts, changes) {
        var perFile = Object.create(null);
        for (var i = 0; i < changes.length; ++i) {
            var ch = changes[i];
            (perFile[ch.file] || (perFile[ch.file] = [])).push(ch);
        }
        for (var file in perFile) {
            var known = ts.docs[file], chs = perFile[file]; ;
            if (!known) continue;
            chs.sort(function(a, b) { return cmpPos(b, a); });
            var origin = "*rename" + (++nextChangeOrig);
            for (var i = 0; i < chs.length; ++i) {
                var ch = chs[i];
                known.doc.replaceRange(ch.text, ch.start, ch.end, origin);
            }
        }
    }

    // Generic request-building helper

    function buildRequest(ts, doc, query) {
        var files = [], offsetLines = 0, allowFragments = !query.fullDocs;
        if (!allowFragments) delete query.fullDocs;
        if (typeof query == "string") query = { type: query };
        query.lineCharPositions = true;
        if (query.end == null) {
            query.end = doc.doc.getCursor("end");
            if (doc.doc.somethingSelected())
                query.start = doc.doc.getCursor("start");
        }
        var startPos = query.start || query.end;

        if (doc.changed) {
            if (doc.doc.lineCount() > bigDoc && allowFragments !== false &&
          doc.changed.to - doc.changed.from < 100 &&
          doc.changed.from <= startPos.line && doc.changed.to > query.end.line) {
                files.push(getFragmentAround(doc, startPos, query.end));
                query.file = "#0";
                var offsetLines = files[0].offsetLines;
                if (query.start != null) query.start = Pos(query.start.line - -offsetLines, query.start.ch);
                query.end = Pos(query.end.line - offsetLines, query.end.ch);
            } else {
                files.push({ type: "full",
                    name: doc.name,
                    text: docValue(ts, doc)
                });
                query.file = doc.name;
                doc.changed = null;
            }
        } else {
            query.file = doc.name;
        }
        for (var name in ts.docs) {
            var cur = ts.docs[name];
            if (cur.changed && cur != doc) {
                files.push({ type: "full", name: cur.name, text: docValue(ts, cur) });
                cur.changed = null;
            }
        }

        return { query: query, files: files };
    }

    function getFragmentAround(data, start, end) {
        var doc = data.doc;
        var minIndent = null, minLine = null, endLine, tabSize = 4;
        for (var p = start.line - 1, min = Math.max(0, p - 50); p >= min; --p) {
            var line = doc.getLine(p), fn = line.search(/\bfunction\b/);
            if (fn < 0) continue;
            var indent = CodeMirror.countColumn(line, null, tabSize);
            if (minIndent != null && minIndent <= indent) continue;
            minIndent = indent;
            minLine = p;
        }
        if (minLine == null) minLine = min;
        var max = Math.min(doc.lastLine(), end.line + 20);
        if (minIndent == null || minIndent == CodeMirror.countColumn(doc.getLine(start.line), null, tabSize))
            endLine = max;
        else for (endLine = end.line + 1; endLine < max; ++endLine) {
            var indent = CodeMirror.countColumn(doc.getLine(endLine), null, tabSize);
            if (indent <= minIndent) break;
        }
        var from = Pos(minLine, 0);

        return { type: "part",
            name: data.name,
            offsetLines: from.line,
            text: doc.getRange(from, Pos(endLine, 0))
        };
    }

    // Generic utilities

    function cmpPos(a, b) { return a.line - b.line || a.ch - b.ch; }

    function elt(tagname, cls /*, ... elts*/) {
        var e = document.createElement(tagname);
        if (cls) e.className = cls;
        for (var i = 2; i < arguments.length; ++i) {
            var elt = arguments[i];
            if (typeof elt == "string") elt = document.createTextNode(elt);
            e.appendChild(elt);
        }
        return e;
    }

    function dialog(cm, text, f) {
        if (cm.openDialog)
            cm.openDialog(text + ": <input type=text>", f);
        else
            f(prompt(text, ""));
    }

    // Tooltips

    function tempTooltip(cm, content) {
        var where = cm.cursorCoords();
        var tip = makeTooltip(where.right + 1, where.bottom, content);
        function clear() {
            if (!tip.parentNode) return;
            cm.off("cursorActivity", clear);
            fadeOut(tip);
        }
        setTimeout(clear, 1700);
        cm.on("cursorActivity", clear);
    }

    function makeTooltip(x, y, content) {
        var node = elt("div", cls + "tooltip", content);
        node.style.left = x + "px";
        node.style.top = y + "px";
        document.body.appendChild(node);
        return node;
    }

    function remove(node) {
        var p = node && node.parentNode;
        if (p) p.removeChild(node);
    }

    function fadeOut(tooltip) {
        tooltip.style.opacity = "0";
        setTimeout(function() { remove(tooltip); }, 1100);
    }

    function showError(ts, cm, msg) {
        if (ts.options.showError)
            ts.options.showError(cm, msg);
        else
            tempTooltip(cm, String(msg));
    }

    function closeArgHints(ts) {
        if (ts.activeArgHints) { remove(ts.activeArgHints); ts.activeArgHints = null; }
    }

    function docValue(ts, doc) {
        var val = doc.doc.getValue();
        if (ts.options.fileFilter) val = ts.options.fileFilter(val, doc.name, doc.doc);
        return val;
    }

    // Worker wrapper

    function WorkerServer(ts) {
        var worker = new Worker(ts.options.workerScript);
        worker.postMessage({ type: "init",
            defs: ts.options.defs,
            plugins: ts.options.plugins,
            scripts: ts.options.workerDeps
        });
        var msgId = 0, pending = {};

        function send(data, c) {
            if (c) {
                data.id = ++msgId;
                pending[msgId] = c;
            }
            worker.postMessage(data);
        }
        worker.onmessage = function(e) {
            var data = e.data;
            if (data.type == "getFile") {
                getFile(ts, name, function(err, text) {
                    send({ type: "getFile", err: String(err), text: text, id: data.id });
                });
            } else if (data.type == "debug") {
                console.log(data.message);
            } else if (data.id && pending[data.id]) {
                pending[data.id](data.err, data.body);
                delete pending[data.id];
            }
        };
        worker.onerror = function(e) {
            for (var id in pending) pending[id](e);
            pending = {};
        };

        this.addFile = function(name, text) { send({ type: "add", name: name, text: text }); };
        this.delFile = function(name) { send({ type: "del", name: name }); };
        this.request = function(body, c) { send({ type: "req", body: body }, c); };
    }
})();




// TODO actually recognize syntax of TypeScript constructs

CodeMirror.defineMode("javascript", function(config, parserConfig) {
    var indentUnit = config.indentUnit;
    var statementIndent = parserConfig.statementIndent;
    var jsonMode = parserConfig.json;
    var isTS = parserConfig.typescript;

    // Tokenizer

    var keywords = function() {
        function kw(type) { return { type: type, style: "keyword" }; }
        var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
        var operator = kw("operator"), atom = { type: "atom", style: "atom" };

        var jsKeywords = {
            "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
            "return": C, "break": C, "continue": C, "new": C, "delete": C, "throw": C,
            "var": kw("var"), "const": kw("var"), "let": kw("var"),
            "function": kw("function"), "catch": kw("catch"),
            "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
            "in": operator, "typeof": operator, "instanceof": operator,
            "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
            "this": kw("this")
        };

        // Extend the 'normal' keywords with the TypeScript language extensions
        if (isTS) {
            var type = { type: "variable", style: "variable-3" };
            var tsKeywords = {
                // object-like things
                "interface": kw("interface"),
                "class": kw("class"),
                "extends": kw("extends"),
                "constructor": kw("constructor"),

                // scope modifiers
                "public": kw("public"),
                "private": kw("private"),
                "protected": kw("protected"),
                "static": kw("static"),

                "super": kw("super"),

                // types
                "string": type, "number": type, "bool": type, "any": type
            };

            for (var attr in tsKeywords) {
                jsKeywords[attr] = tsKeywords[attr];
            }
        }

        return jsKeywords;
    } ();

    var isOperatorChar = /[+\-*&%=<>!?|~^]/;

    function chain(stream, state, f) {
        state.tokenize = f;
        return f(stream, state);
    }

    function nextUntilUnescaped(stream, end) {
        var escaped = false, next;
        while ((next = stream.next()) != null) {
            if (next == end && !escaped)
                return false;
            escaped = !escaped && next == "\\";
        }
        return escaped;
    }

    // Used as scratch variables to communicate multiple values without
    // consing up tons of objects.
    var type, content;
    function ret(tp, style, cont) {
        type = tp; content = cont;
        return style;
    }

    function jsTokenBase(stream, state) {
        var ch = stream.next();
        if (ch == '"' || ch == "'")
            return chain(stream, state, jsTokenString(ch));
        else if (/[\[\]{}\(\),;\:\.]/.test(ch))
            return ret(ch);
        else if (ch == "0" && stream.eat(/x/i)) {
            stream.eatWhile(/[\da-f]/i);
            return ret("number", "number");
        }
        else if (/\d/.test(ch) || ch == "-" && stream.eat(/\d/)) {
            stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
            return ret("number", "number");
        }
        else if (ch == "/") {
            if (stream.eat("*")) {
                return chain(stream, state, jsTokenComment);
            }
            else if (stream.eat("/")) {
                stream.skipToEnd();
                return ret("comment", "comment");
            }
            else if (state.lastType == "operator" || state.lastType == "keyword c" ||
               /^[\[{}\(,;:]$/.test(state.lastType)) {
                nextUntilUnescaped(stream, "/");
                stream.eatWhile(/[gimy]/); // 'y' is "sticky" option in Mozilla
                return ret("regexp", "string-2");
            }
            else {
                stream.eatWhile(isOperatorChar);
                return ret("operator", null, stream.current());
            }
        }
        else if (ch == "#") {
            stream.skipToEnd();
            return ret("error", "error");
        }
        else if (isOperatorChar.test(ch)) {
            stream.eatWhile(isOperatorChar);
            return ret("operator", null, stream.current());
        }
        else {
            stream.eatWhile(/[\w\$_]/);
            var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
            return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
                     ret("variable", "variable", word);
        }
    }

    function jsTokenString(quote) {
        return function(stream, state) {
            if (!nextUntilUnescaped(stream, quote))
                state.tokenize = jsTokenBase;
            return ret("string", "string");
        };
    }

    function jsTokenComment(stream, state) {
        var maybeEnd = false, ch;
        while (ch = stream.next()) {
            if (ch == "/" && maybeEnd) {
                state.tokenize = jsTokenBase;
                break;
            }
            maybeEnd = (ch == "*");
        }
        return ret("comment", "comment");
    }

    // Parser

    var atomicTypes = { "atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true };

    function JSLexical(indented, column, type, align, prev, info) {
        this.indented = indented;
        this.column = column;
        this.type = type;
        this.prev = prev;
        this.info = info;
        if (align != null) this.align = align;
    }

    function inScope(state, varname) {
        for (var v = state.localVars; v; v = v.next)
            if (v.name == varname) return true;
    }

    function parseJS(state, style, type, content, stream) {
        var cc = state.cc;
        // Communicate our context to the combinators.
        // (Less wasteful than consing up a hundred closures on every call.)
        cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc;

        if (!state.lexical.hasOwnProperty("align"))
            state.lexical.align = true;

        while (true) {
            var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
            if (combinator(type, content)) {
                while (cc.length && cc[cc.length - 1].lex)
                    cc.pop()();
                if (cx.marked) return cx.marked;
                if (type == "variable" && inScope(state, content)) return "variable-2";
                return style;
            }
        }
    }

    // Combinator utils

    var cx = { state: null, column: null, marked: null, cc: null };
    function pass() {
        for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
    }
    function cont() {
        pass.apply(null, arguments);
        return true;
    }
    function register(varname) {
        function inList(list) {
            for (var v = list; v; v = v.next)
                if (v.name == varname) return true;
            return false;
        }
        var state = cx.state;
        if (state.context) {
            cx.marked = "def";
            if (inList(state.localVars)) return;
            state.localVars = { name: varname, next: state.localVars };
        } else {
            if (inList(state.globalVars)) return;
            state.globalVars = { name: varname, next: state.globalVars };
        }
    }

    // Combinators

    var defaultVars = { name: "this", next: { name: "arguments"} };
    function pushcontext() {
        cx.state.context = { prev: cx.state.context, vars: cx.state.localVars };
        cx.state.localVars = defaultVars;
    }
    function popcontext() {
        cx.state.localVars = cx.state.context.vars;
        cx.state.context = cx.state.context.prev;
    }
    function pushlex(type, info) {
        var result = function() {
            var state = cx.state, indent = state.indented;
            if (state.lexical.type == "stat") indent = state.lexical.indented;
            state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
        };
        result.lex = true;
        return result;
    }
    function poplex() {
        var state = cx.state;
        if (state.lexical.prev) {
            if (state.lexical.type == ")")
                state.indented = state.lexical.indented;
            state.lexical = state.lexical.prev;
        }
    }
    poplex.lex = true;

    function expect(wanted) {
        return function(type) {
            if (type == wanted) return cont();
            else if (wanted == ";") return pass();
            else return cont(arguments.callee);
        };
    }

    function statement(type) {
        if (type == "var") return cont(pushlex("vardef"), vardef1, expect(";"), poplex);
        if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
        if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
        if (type == "{") return cont(pushlex("}"), block, poplex);
        if (type == ";") return cont();
        if (type == "if") return cont(pushlex("form"), expression, statement, poplex, maybeelse);
        if (type == "function") return cont(functiondef);
        if (type == "for") return cont(pushlex("form"), expect("("), pushlex(")"), forspec1, expect(")"),
                                   poplex, statement, poplex);
        if (type == "variable") return cont(pushlex("stat"), maybelabel);
        if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
                                      block, poplex, poplex);
        if (type == "case") return cont(expression, expect(":"));
        if (type == "default") return cont(expect(":"));
        if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
                                     statement, poplex, popcontext);
        return pass(pushlex("stat"), expression, expect(";"), poplex);
    }
    function expression(type) {
        return expressionInner(type, false);
    }
    function expressionNoComma(type) {
        return expressionInner(type, true);
    }
    function expressionInner(type, noComma) {
        var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
        if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
        if (type == "function") return cont(functiondef);
        if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
        if (type == "(") return cont(pushlex(")"), maybeexpression, expect(")"), poplex, maybeop);
        if (type == "operator") return cont(noComma ? expressionNoComma : expression);
        if (type == "[") return cont(pushlex("]"), commasep(expressionNoComma, "]"), poplex, maybeop);
        if (type == "{") return cont(pushlex("}"), commasep(objprop, "}"), poplex, maybeop);
        return cont();
    }
    function maybeexpression(type) {
        if (type.match(/[;\}\)\],]/)) return pass();
        return pass(expression);
    }
    function maybeexpressionNoComma(type) {
        if (type.match(/[;\}\)\],]/)) return pass();
        return pass(expressionNoComma);
    }

    function maybeoperatorComma(type, value) {
        if (type == ",") return cont(expression);
        return maybeoperatorNoComma(type, value, false);
    }
    function maybeoperatorNoComma(type, value, noComma) {
        var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
        var expr = noComma == false ? expression : expressionNoComma;
        if (type == "operator") {
            if (/\+\+|--/.test(value)) return cont(me);
            if (value == "?") return cont(expression, expect(":"), expr);
            return cont(expr);
        }
        if (type == ";") return;
        if (type == "(") return cont(pushlex(")", "call"), commasep(expressionNoComma, ")"), poplex, me);
        if (type == ".") return cont(property, me);
        if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
    }
    function maybelabel(type) {
        if (type == ":") return cont(poplex, statement);
        return pass(maybeoperatorComma, expect(";"), poplex);
    }
    function property(type) {
        if (type == "variable") { cx.marked = "property"; return cont(); }
    }
    function objprop(type, value) {
        if (type == "variable") {
            cx.marked = "property";
            if (value == "get" || value == "set") return cont(getterSetter);
        } else if (type == "number" || type == "string") {
            cx.marked = type + " property";
        }
        if (atomicTypes.hasOwnProperty(type)) return cont(expect(":"), expressionNoComma);
    }
    function getterSetter(type) {
        if (type == ":") return cont(expression);
        if (type != "variable") return cont(expect(":"), expression);
        cx.marked = "property";
        return cont(functiondef);
    }
    function commasep(what, end) {
        function proceed(type) {
            if (type == ",") {
                var lex = cx.state.lexical;
                if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
                return cont(what, proceed);
            }
            if (type == end) return cont();
            return cont(expect(end));
        }
        return function(type) {
            if (type == end) return cont();
            else return pass(what, proceed);
        };
    }
    function block(type) {
        if (type == "}") return cont();
        return pass(statement, block);
    }
    function maybetype(type) {
        if (type == ":") return cont(typedef);
        return pass();
    }
    function typedef(type) {
        if (type == "variable") { cx.marked = "variable-3"; return cont(); }
        return pass();
    }
    function vardef1(type, value) {
        if (type == "variable") {
            register(value);
            return isTS ? cont(maybetype, vardef2) : cont(vardef2);
        }
        return pass();
    }
    function vardef2(type, value) {
        if (value == "=") return cont(expressionNoComma, vardef2);
        if (type == ",") return cont(vardef1);
    }
    function maybeelse(type, value) {
        if (type == "keyword b" && value == "else") return cont(pushlex("form"), statement, poplex);
    }
    function forspec1(type) {
        if (type == "var") return cont(vardef1, expect(";"), forspec2);
        if (type == ";") return cont(forspec2);
        if (type == "variable") return cont(formaybein);
        return pass(expression, expect(";"), forspec2);
    }
    function formaybein(_type, value) {
        if (value == "in") return cont(expression);
        return cont(maybeoperatorComma, forspec2);
    }
    function forspec2(type, value) {
        if (type == ";") return cont(forspec3);
        if (value == "in") return cont(expression);
        return pass(expression, expect(";"), forspec3);
    }
    function forspec3(type) {
        if (type != ")") cont(expression);
    }
    function functiondef(type, value) {
        if (type == "variable") { register(value); return cont(functiondef); }
        if (type == "(") return cont(pushlex(")"), pushcontext, commasep(funarg, ")"), poplex, statement, popcontext);
    }
    function funarg(type, value) {
        if (type == "variable") { register(value); return isTS ? cont(maybetype) : cont(); }
    }

    // Interface

    return {
        startState: function(basecolumn) {
            return {
                tokenize: jsTokenBase,
                lastType: null,
                cc: [],
                lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
                localVars: parserConfig.localVars,
                globalVars: parserConfig.globalVars,
                context: parserConfig.localVars && { vars: parserConfig.localVars },
                indented: 0
            };
        },

        token: function(stream, state) {
            if (stream.sol()) {
                if (!state.lexical.hasOwnProperty("align"))
                    state.lexical.align = false;
                state.indented = stream.indentation();
            }
            if (state.tokenize != jsTokenComment && stream.eatSpace()) return null;
            var style = state.tokenize(stream, state);
            if (type == "comment") return style;
            state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
            return parseJS(state, style, type, content, stream);
        },

        indent: function(state, textAfter) {
            if (state.tokenize == jsTokenComment) return CodeMirror.Pass;
            if (state.tokenize != jsTokenBase) return 0;
            var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
            // Kludge to prevent 'maybelse' from blocking lexical scope pops
            for (var i = state.cc.length - 1; i >= 0; --i) {
                var c = state.cc[i];
                if (c == poplex) lexical = lexical.prev;
                else if (c != maybeelse || /^else\b/.test(textAfter)) break;
            }
            if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
            if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
                lexical = lexical.prev;
            var type = lexical.type, closing = firstChar == type;

            if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? 4 : 0);
            else if (type == "form" && firstChar == "{") return lexical.indented;
            else if (type == "form") return lexical.indented + indentUnit;
            else if (type == "stat")
                return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? statementIndent || indentUnit : 0);
            else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
                return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
            else if (lexical.align) return lexical.column + (closing ? 0 : 1);
            else return lexical.indented + (closing ? 0 : indentUnit);
        },

        electricChars: ":{}",
        blockCommentStart: jsonMode ? null : "/*",
        blockCommentEnd: jsonMode ? null : "*/",
        lineComment: jsonMode ? null : "//",
        fold: "brace",

        helperType: jsonMode ? "json" : "javascript",
        jsonMode: jsonMode
    };
});

CodeMirror.defineMIME("text/javascript", "javascript");
CodeMirror.defineMIME("text/ecmascript", "javascript");
CodeMirror.defineMIME("application/javascript", "javascript");
CodeMirror.defineMIME("application/ecmascript", "javascript");
CodeMirror.defineMIME("application/json", { name: "javascript", json: true });
CodeMirror.defineMIME("application/x-json", { name: "javascript", json: true });
CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });




(function() {

    var bogus = ["Dangerous comment"];

    var warnings = [["Expected '{'",
                     "Statement body should be inside '{ }' braces."]];

    var errors = ["Missing semicolon", "Extra comma", "Missing property name",
                 "Unmatched ", " and instead saw", " is not defined",
                 "Unclosed string", "Stopping, unable to continue"];

    function validator(text, options) {
        JSHINT(text, options);
        var errors = JSHINT.data().errors, result = [];
        if (errors) parseErrors(errors, result);
        return result;
    }

    CodeMirror.registerHelper("lint", "javascript", validator);
    CodeMirror.javascriptValidator = CodeMirror.lint.javascript; // deprecated

    function cleanup(error) {
        // All problems are warnings by default
        fixWith(error, warnings, "warning", true);
        fixWith(error, errors, "error");

        return isBogus(error) ? null : error;
    }

    function fixWith(error, fixes, severity, force) {
        var description, fix, find, replace, found;

        description = error.description;

        for (var i = 0; i < fixes.length; i++) {
            fix = fixes[i];
            find = (typeof fix === "string" ? fix : fix[0]);
            replace = (typeof fix === "string" ? null : fix[1]);
            found = description.indexOf(find) !== -1;

            if (force || found) {
                error.severity = severity;
            }
            if (found && replace) {
                error.description = replace;
            }
        }
    }

    function isBogus(error) {
        var description = error.description;
        for (var i = 0; i < bogus.length; i++) {
            if (description.indexOf(bogus[i]) !== -1) {
                return true;
            }
        }
        return false;
    }

    function parseErrors(errors, output) {
        for (var i = 0; i < errors.length; i++) {
            var error = errors[i];
            if (error) {
                var linetabpositions, index;

                linetabpositions = [];

                // This next block is to fix a problem in jshint. Jshint
                // replaces
                // all tabs with spaces then performs some checks. The error
                // positions (character/space) are then reported incorrectly,
                // not taking the replacement step into account. Here we look
                // at the evidence line and try to adjust the character position
                // to the correct value.
                if (error.evidence) {
                    // Tab positions are computed once per line and cached
                    var tabpositions = linetabpositions[error.line];
                    if (!tabpositions) {
                        var evidence = error.evidence;
                        tabpositions = [];
                        // ugggh phantomjs does not like this
                        // forEachChar(evidence, function(item, index) {
                        Array.prototype.forEach.call(evidence, function(item,
                                                            index) {
                            if (item === '\t') {
                                // First col is 1 (not 0) to match error
                                // positions
                                tabpositions.push(index + 1);
                            }
                        });
                        linetabpositions[error.line] = tabpositions;
                    }
                    if (tabpositions.length > 0) {
                        var pos = error.character;
                        tabpositions.forEach(function(tabposition) {
                            if (pos > tabposition) pos -= 1;
                        });
                        error.character = pos;
                    }
                }

                var start = error.character - 1, end = start + 1;
                if (error.evidence) {
                    index = error.evidence.substring(start).search(/.\b/);
                    if (index > -1) {
                        end += index;
                    }
                }

                // Convert to format expected by validation service
                error.description = error.reason; // + "(jshint)";
                error.start = error.character;
                error.end = end;
                error = cleanup(error);

                if (error)
                    output.push({ message: error.description,
                        severity: error.severity,
                        from: CodeMirror.Pos(error.line - 1, start),
                        to: CodeMirror.Pos(error.line - 1, end)
                    });
            }
        }
    }
})();



(function() {
    "use strict";

    var WORD = /[\w$]+/, RANGE = 500;

    CodeMirror.registerHelper("hint", "anyword", function(editor, options) {
        var word = options && options.word || WORD;
        var range = options && options.range || RANGE;
        var cur = editor.getCursor(), curLine = editor.getLine(cur.line);
        var start = cur.ch, end = start;
        while (end < curLine.length && word.test(curLine.charAt(end))) ++end;
        while (start && word.test(curLine.charAt(start - 1))) --start;
        var curWord = start != end && curLine.slice(start, end);

        var list = [], seen = {};
        function scan(dir) {
            var line = cur.line, end = Math.min(Math.max(line + dir * range, editor.firstLine()), editor.lastLine()) + dir;
            for (; line != end; line += dir) {
                var text = editor.getLine(line), m;
                var re = new RegExp(word.source, "g");
                while (m = re.exec(text)) {
                    if (line == cur.line && m[0] === curWord) continue;
                    if ((!curWord || m[0].indexOf(curWord) == 0) && !seen.hasOwnProperty(m[0])) {
                        seen[m[0]] = true;
                        list.push(m[0]);
                    }
                }
            }
        }
        scan(-1);
        scan(1);
        return { list: list, from: CodeMirror.Pos(cur.line, start), to: CodeMirror.Pos(cur.line, end) };
    });
})();




(function() {
    var Pos = CodeMirror.Pos;

    function forEach(arr, f) {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
    }

    function arrayContains(arr, item) {
        if (!Array.prototype.indexOf) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === item) {
                    return true;
                }
            }
            return false;
        }
        return arr.indexOf(item) != -1;
    }

    function scriptHint(editor, keywords, getToken, options) {
        // Find the token at the cursor
        var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;
        token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;

        // If it's not a 'word-style' token, ignore the token.
        if (!/^[\w$_]*$/.test(token.string)) {
            token = tprop = { start: cur.ch, end: cur.ch, string: "", state: token.state,
                type: token.string == "." ? "property" : null
            };
        }
        // If it is a property, find out what it is a property of.
        while (tprop.type == "property") {
            tprop = getToken(editor, Pos(cur.line, tprop.start));
            if (tprop.string != ".") return;
            tprop = getToken(editor, Pos(cur.line, tprop.start));
            if (tprop.string == ')') {
                var level = 1;
                do {
                    tprop = getToken(editor, Pos(cur.line, tprop.start));
                    switch (tprop.string) {
                        case ')': level++; break;
                        case '(': level--; break;
                        default: break;
                    }
                } while (level > 0);
                tprop = getToken(editor, Pos(cur.line, tprop.start));
                if (tprop.type.indexOf("variable") === 0)
                    tprop.type = "function";
                else return; // no clue
            }
            if (!context) var context = [];
            context.push(tprop);
        }
        return { list: getCompletions(token, context, keywords, options),
            from: Pos(cur.line, token.start),
            to: Pos(cur.line, token.end)
        };
    }

    function javascriptHint(editor, options) {
        return scriptHint(editor, javascriptKeywords,
                      function(e, cur) { return e.getTokenAt(cur); },
                      options);
    };
    CodeMirror.javascriptHint = javascriptHint; // deprecated
    CodeMirror.registerHelper("hint", "javascript", javascriptHint);

    function getCoffeeScriptToken(editor, cur) {
        // This getToken, it is for coffeescript, imitates the behavior of
        // getTokenAt method in javascript.js, that is, returning "property"
        // type and treat "." as indepenent token.
        var token = editor.getTokenAt(cur);
        if (cur.ch == token.start + 1 && token.string.charAt(0) == '.') {
            token.end = token.start;
            token.string = '.';
            token.type = "property";
        }
        else if (/^\.[\w$_]*$/.test(token.string)) {
            token.type = "property";
            token.start++;
            token.string = token.string.replace(/\./, '');
        }
        return token;
    }

    function coffeescriptHint(editor, options) {
        return scriptHint(editor, coffeescriptKeywords, getCoffeeScriptToken, options);
    }
    CodeMirror.coffeescriptHint = coffeescriptHint; // deprecated
    CodeMirror.registerHelper("hint", "coffeescript", coffeescriptHint);

    var stringProps = ("charAt charCodeAt indexOf lastIndexOf substring substr slice trim trimLeft trimRight " +
                     "toUpperCase toLowerCase split concat match replace search").split(" ");
    var arrayProps = ("length concat join splice push pop shift unshift slice reverse sort indexOf " +
                    "lastIndexOf every some filter forEach map reduce reduceRight ").split(" ");
    var funcProps = "prototype apply call bind".split(" ");
    var javascriptKeywords = ("break case catch continue debugger default delete do else false finally for function " +
                  "if in instanceof new null return switch throw true try typeof var void while with").split(" ");
    var coffeescriptKeywords = ("and break catch class continue delete do else extends false finally for " +
                  "if in instanceof isnt new no not null of off on or return switch then throw true try typeof until void while with yes").split(" ");

    function getCompletions(token, context, keywords, options) {
        var found = [], start = token.string;
        function maybeAdd(str) {
            if (str.indexOf(start) == 0 && !arrayContains(found, str)) found.push(str);
        }
        function gatherCompletions(obj) {
            if (typeof obj == "string") forEach(stringProps, maybeAdd);
            else if (obj instanceof Array) forEach(arrayProps, maybeAdd);
            else if (obj instanceof Function) forEach(funcProps, maybeAdd);
            for (var name in obj) maybeAdd(name);
        }

        if (context) {
            // If this is a property, see if it belongs to some object we can
            // find in the current environment.
            var obj = context.pop(), base;
            if (obj.type.indexOf("variable") === 0) {
                if (options && options.additionalContext)
                    base = options.additionalContext[obj.string];
                base = base || window[obj.string];
            } else if (obj.type == "string") {
                base = "";
            } else if (obj.type == "atom") {
                base = 1;
            } else if (obj.type == "function") {
                if (window.jQuery != null && (obj.string == '$' || obj.string == 'jQuery') &&
            (typeof window.jQuery == 'function'))
                    base = window.jQuery();
                else if (window._ != null && (obj.string == '_') && (typeof window._ == 'function'))
                    base = window._();
            }
            while (base != null && context.length)
                base = base[context.pop().string];
            if (base != null) gatherCompletions(base);
        }
        else {
            // If not, just look in the window object and any local scope
            // (reading into JS mode internals to get at the local and global variables)
            for (var v = token.state.localVars; v; v = v.next) maybeAdd(v.name);
            for (var v = token.state.globalVars; v; v = v.next) maybeAdd(v.name);
            gatherCompletions(window);
            forEach(keywords, maybeAdd);
        }
        return found;
    }
})();
