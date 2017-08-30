import UriBase from '../editor/uri';

/**
 * The base uri is implemented by myself.
 */
const uri_1 = {
  default: UriBase,
}

/**
 * The code below is all from vscode.
 */
var __extends = (this && this.__extends) || (function () {
  var extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
  return function (d, b) {
      extendStatics(d, b);
      function __() { this.constructor = d; }
      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
})();

var Disposable = (function () {
  function Disposable(callOnDispose) {
    this._callOnDispose = callOnDispose;
  }
  Disposable.from = function () {
    var disposables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      disposables[_i] = arguments[_i];
    }
    return new Disposable(function () {
      if (disposables) {
        for (var _i = 0, disposables_1 = disposables; _i < disposables_1.length; _i++) {
          var disposable = disposables_1[_i];
          if (disposable && typeof disposable.dispose === 'function') {
            disposable.dispose();
          }
        }
        disposables = undefined;
      }
    });
  };
  Disposable.prototype.dispose = function () {
    if (typeof this._callOnDispose === 'function') {
      this._callOnDispose();
      this._callOnDispose = undefined;
    }
  };
  return Disposable;
}());
exports.Disposable = Disposable;
var Position = (function () {
  function Position(line, character) {
    if (line < 0) {
      throw errors_1.illegalArgument('line must be positive');
    }
    if (character < 0) {
      throw errors_1.illegalArgument('character must be positive');
    }
    this._line = line;
    this._character = character;
  }
  Position.Min = function () {
    var positions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      positions[_i] = arguments[_i];
    }
    var result = positions.pop();
    for (var _a = 0, positions_1 = positions; _a < positions_1.length; _a++) {
      var p = positions_1[_a];
      if (p.isBefore(result)) {
        result = p;
      }
    }
    return result;
  };
  Position.Max = function () {
    var positions = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      positions[_i] = arguments[_i];
    }
    var result = positions.pop();
    for (var _a = 0, positions_2 = positions; _a < positions_2.length; _a++) {
      var p = positions_2[_a];
      if (p.isAfter(result)) {
        result = p;
      }
    }
    return result;
  };
  Position.isPosition = function (other) {
    if (!other) {
      return false;
    }
    if (other instanceof Position) {
      return true;
    }
    var _a = other, line = _a.line, character = _a.character;
    if (typeof line === 'number' && typeof character === 'number') {
      return true;
    }
    return false;
  };
  Object.defineProperty(Position.prototype, "line", {
    get: function () {
      return this._line;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Position.prototype, "character", {
    get: function () {
      return this._character;
    },
    enumerable: true,
    configurable: true
  });
  Position.prototype.isBefore = function (other) {
    if (this._line < other._line) {
      return true;
    }
    if (other._line < this._line) {
      return false;
    }
    return this._character < other._character;
  };
  Position.prototype.isBeforeOrEqual = function (other) {
    if (this._line < other._line) {
      return true;
    }
    if (other._line < this._line) {
      return false;
    }
    return this._character <= other._character;
  };
  Position.prototype.isAfter = function (other) {
    return !this.isBeforeOrEqual(other);
  };
  Position.prototype.isAfterOrEqual = function (other) {
    return !this.isBefore(other);
  };
  Position.prototype.isEqual = function (other) {
    return this._line === other._line && this._character === other._character;
  };
  Position.prototype.compareTo = function (other) {
    if (this._line < other._line) {
      return -1;
    }
    else if (this._line > other.line) {
      return 1;
    }
    else {
      // equal line
      if (this._character < other._character) {
        return -1;
      }
      else if (this._character > other._character) {
        return 1;
      }
      else {
        // equal line and character
        return 0;
      }
    }
  };
  Position.prototype.translate = function (lineDeltaOrChange, characterDelta) {
    if (characterDelta === void 0) { characterDelta = 0; }
    if (lineDeltaOrChange === null || characterDelta === null) {
      throw errors_1.illegalArgument();
    }
    var lineDelta;
    if (typeof lineDeltaOrChange === 'undefined') {
      lineDelta = 0;
    }
    else if (typeof lineDeltaOrChange === 'number') {
      lineDelta = lineDeltaOrChange;
    }
    else {
      lineDelta = typeof lineDeltaOrChange.lineDelta === 'number' ? lineDeltaOrChange.lineDelta : 0;
      characterDelta = typeof lineDeltaOrChange.characterDelta === 'number' ? lineDeltaOrChange.characterDelta : 0;
    }
    if (lineDelta === 0 && characterDelta === 0) {
      return this;
    }
    return new Position(this.line + lineDelta, this.character + characterDelta);
  };
  Position.prototype.with = function (lineOrChange, character) {
    if (character === void 0) { character = this.character; }
    if (lineOrChange === null || character === null) {
      throw errors_1.illegalArgument();
    }
    var line;
    if (typeof lineOrChange === 'undefined') {
      line = this.line;
    }
    else if (typeof lineOrChange === 'number') {
      line = lineOrChange;
    }
    else {
      line = typeof lineOrChange.line === 'number' ? lineOrChange.line : this.line;
      character = typeof lineOrChange.character === 'number' ? lineOrChange.character : this.character;
    }
    if (line === this.line && character === this.character) {
      return this;
    }
    return new Position(line, character);
  };
  Position.prototype.toJSON = function () {
    return { line: this.line, character: this.character };
  };
  return Position;
}());
exports.Position = Position;
var Range = (function () {
  function Range(startLineOrStart, startColumnOrEnd, endLine, endColumn) {
    var start;
    var end;
    if (typeof startLineOrStart === 'number' && typeof startColumnOrEnd === 'number' && typeof endLine === 'number' && typeof endColumn === 'number') {
      start = new Position(startLineOrStart, startColumnOrEnd);
      end = new Position(endLine, endColumn);
    }
    else if (startLineOrStart instanceof Position && startColumnOrEnd instanceof Position) {
      start = startLineOrStart;
      end = startColumnOrEnd;
    }
    if (!start || !end) {
      throw new Error('Invalid arguments');
    }
    if (start.isBefore(end)) {
      this._start = start;
      this._end = end;
    }
    else {
      this._start = end;
      this._end = start;
    }
  }
  Range.isRange = function (thing) {
    if (thing instanceof Range) {
      return true;
    }
    if (!thing) {
      return false;
    }
    return Position.isPosition(thing.start)
      && Position.isPosition(thing.end);
  };
  Object.defineProperty(Range.prototype, "start", {
    get: function () {
      return this._start;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Range.prototype, "end", {
    get: function () {
      return this._end;
    },
    enumerable: true,
    configurable: true
  });
  Range.prototype.contains = function (positionOrRange) {
    if (positionOrRange instanceof Range) {
      return this.contains(positionOrRange._start)
        && this.contains(positionOrRange._end);
    }
    else if (positionOrRange instanceof Position) {
      if (positionOrRange.isBefore(this._start)) {
        return false;
      }
      if (this._end.isBefore(positionOrRange)) {
        return false;
      }
      return true;
    }
    return false;
  };
  Range.prototype.isEqual = function (other) {
    return this._start.isEqual(other._start) && this._end.isEqual(other._end);
  };
  Range.prototype.intersection = function (other) {
    var start = Position.Max(other.start, this._start);
    var end = Position.Min(other.end, this._end);
    if (start.isAfter(end)) {
      // this happens when there is no overlap:
      // |-----|
      //          |----|
      return undefined;
    }
    return new Range(start, end);
  };
  Range.prototype.union = function (other) {
    if (this.contains(other)) {
      return this;
    }
    else if (other.contains(this)) {
      return other;
    }
    var start = Position.Min(other.start, this._start);
    var end = Position.Max(other.end, this.end);
    return new Range(start, end);
  };
  Object.defineProperty(Range.prototype, "isEmpty", {
    get: function () {
      return this._start.isEqual(this._end);
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Range.prototype, "isSingleLine", {
    get: function () {
      return this._start.line === this._end.line;
    },
    enumerable: true,
    configurable: true
  });
  Range.prototype.with = function (startOrChange, end) {
    if (end === void 0) { end = this.end; }
    if (startOrChange === null || end === null) {
      throw errors_1.illegalArgument();
    }
    var start;
    if (!startOrChange) {
      start = this.start;
    }
    else if (Position.isPosition(startOrChange)) {
      start = startOrChange;
    }
    else {
      start = startOrChange.start || this.start;
      end = startOrChange.end || this.end;
    }
    if (start.isEqual(this._start) && end.isEqual(this.end)) {
      return this;
    }
    return new Range(start, end);
  };
  Range.prototype.toJSON = function () {
    return [this.start, this.end];
  };
  return Range;
}());
exports.Range = Range;
var Selection = (function (_super) {
  __extends(Selection, _super);
  function Selection(anchorLineOrAnchor, anchorColumnOrActive, activeLine, activeColumn) {
    var _this = this;
    var anchor;
    var active;
    if (typeof anchorLineOrAnchor === 'number' && typeof anchorColumnOrActive === 'number' && typeof activeLine === 'number' && typeof activeColumn === 'number') {
      anchor = new Position(anchorLineOrAnchor, anchorColumnOrActive);
      active = new Position(activeLine, activeColumn);
    }
    else if (anchorLineOrAnchor instanceof Position && anchorColumnOrActive instanceof Position) {
      anchor = anchorLineOrAnchor;
      active = anchorColumnOrActive;
    }
    if (!anchor || !active) {
      throw new Error('Invalid arguments');
    }
    _this = _super.call(this, anchor, active) || this;
    _this._anchor = anchor;
    _this._active = active;
    return _this;
  }
  Selection.isSelection = function (thing) {
    if (thing instanceof Selection) {
      return true;
    }
    if (!thing) {
      return false;
    }
    return Range.isRange(thing)
      && Position.isPosition(thing.anchor)
      && Position.isPosition(thing.active)
      && typeof thing.isReversed === 'boolean';
  };
  Object.defineProperty(Selection.prototype, "anchor", {
    get: function () {
      return this._anchor;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Selection.prototype, "active", {
    get: function () {
      return this._active;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(Selection.prototype, "isReversed", {
    get: function () {
      return this._anchor === this._end;
    },
    enumerable: true,
    configurable: true
  });
  Selection.prototype.toJSON = function () {
    return {
      start: this.start,
      end: this.end,
      active: this.active,
      anchor: this.anchor
    };
  };
  return Selection;
}(Range));
exports.Selection = Selection;
var EndOfLine;
(function (EndOfLine) {
  EndOfLine[EndOfLine["LF"] = 1] = "LF";
  EndOfLine[EndOfLine["CRLF"] = 2] = "CRLF";
})(EndOfLine = exports.EndOfLine || (exports.EndOfLine = {}));
var TextEdit = (function () {
  function TextEdit(range, newText) {
    this.range = range;
    this.newText = newText;
  }
  TextEdit.isTextEdit = function (thing) {
    if (thing instanceof TextEdit) {
      return true;
    }
    if (!thing) {
      return false;
    }
    return Range.isRange(thing)
      && typeof thing.newText === 'string';
  };
  TextEdit.replace = function (range, newText) {
    return new TextEdit(range, newText);
  };
  TextEdit.insert = function (position, newText) {
    return TextEdit.replace(new Range(position, position), newText);
  };
  TextEdit.delete = function (range) {
    return TextEdit.replace(range, '');
  };
  TextEdit.setEndOfLine = function (eol) {
    var ret = new TextEdit(undefined, undefined);
    ret.newEol = eol;
    return ret;
  };
  Object.defineProperty(TextEdit.prototype, "range", {
    get: function () {
      return this._range;
    },
    set: function (value) {
      if (value && !Range.isRange(value)) {
        throw errors_1.illegalArgument('range');
      }
      this._range = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(TextEdit.prototype, "newText", {
    get: function () {
      return this._newText || '';
    },
    set: function (value) {
      if (value && typeof value !== 'string') {
        throw errors_1.illegalArgument('newText');
      }
      this._newText = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(TextEdit.prototype, "newEol", {
    get: function () {
      return this._newEol;
    },
    set: function (value) {
      if (value && typeof value !== 'number') {
        throw errors_1.illegalArgument('newEol');
      }
      this._newEol = value;
    },
    enumerable: true,
    configurable: true
  });
  TextEdit.prototype.toJSON = function () {
    return {
      range: this.range,
      newText: this.newText,
      newEol: this._newEol
    };
  };
  return TextEdit;
}());
exports.TextEdit = TextEdit;
var Uri = (function (_super) {
  __extends(Uri, _super);
  function Uri() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  return Uri;
}(uri_1.default));
exports.Uri = Uri;
var WorkspaceEdit = (function () {
  function WorkspaceEdit() {
    this._values = [];
    this._index = new Map();
  }
  WorkspaceEdit.prototype.replace = function (uri, range, newText) {
    var edit = new TextEdit(range, newText);
    var array = this.get(uri);
    if (array) {
      array.push(edit);
    }
    else {
      this.set(uri, [edit]);
    }
  };
  WorkspaceEdit.prototype.insert = function (resource, position, newText) {
    this.replace(resource, new Range(position, position), newText);
  };
  WorkspaceEdit.prototype.delete = function (resource, range) {
    this.replace(resource, range, '');
  };
  WorkspaceEdit.prototype.has = function (uri) {
    return this._index.has(uri.toString());
  };
  WorkspaceEdit.prototype.set = function (uri, edits) {
    var idx = this._index.get(uri.toString());
    if (typeof idx === 'undefined') {
      var newLen = this._values.push([uri, edits]);
      this._index.set(uri.toString(), newLen - 1);
    }
    else {
      this._values[idx][1] = edits;
    }
  };
  WorkspaceEdit.prototype.get = function (uri) {
    var idx = this._index.get(uri.toString());
    return typeof idx !== 'undefined' && this._values[idx][1];
  };
  WorkspaceEdit.prototype.entries = function () {
    return this._values;
  };
  Object.defineProperty(WorkspaceEdit.prototype, "size", {
    get: function () {
      return this._values.length;
    },
    enumerable: true,
    configurable: true
  });
  WorkspaceEdit.prototype.toJSON = function () {
    return this._values;
  };
  return WorkspaceEdit;
}());
exports.WorkspaceEdit = WorkspaceEdit;
var SnippetString = (function () {
  function SnippetString(value) {
    this._tabstop = 1;
    this.value = value || '';
  }
  SnippetString.isSnippetString = function (thing) {
    if (thing instanceof SnippetString) {
      return true;
    }
    if (!thing) {
      return false;
    }
    return typeof thing.value === 'string';
  };
  SnippetString._escape = function (value) {
    return value.replace(/\$|}|\\/g, '\\$&');
  };
  SnippetString.prototype.appendText = function (string) {
    this.value += SnippetString._escape(string);
    return this;
  };
  SnippetString.prototype.appendTabstop = function (number) {
    if (number === void 0) { number = this._tabstop++; }
    this.value += '$';
    this.value += number;
    return this;
  };
  SnippetString.prototype.appendPlaceholder = function (value, number) {
    if (number === void 0) { number = this._tabstop++; }
    if (typeof value === 'function') {
      var nested = new SnippetString();
      nested._tabstop = this._tabstop;
      value(nested);
      this._tabstop = nested._tabstop;
      value = nested.value;
    }
    else {
      value = SnippetString._escape(value);
    }
    this.value += '${';
    this.value += number;
    this.value += ':';
    this.value += value;
    this.value += '}';
    return this;
  };
  SnippetString.prototype.appendVariable = function (name, defaultValue) {
    if (typeof defaultValue === 'function') {
      var nested = new SnippetString();
      nested._tabstop = this._tabstop;
      defaultValue(nested);
      this._tabstop = nested._tabstop;
      defaultValue = nested.value;
    }
    else if (typeof defaultValue === 'string') {
      defaultValue = defaultValue.replace(/\$|}/g, '\\$&');
    }
    this.value += '${';
    this.value += name;
    if (defaultValue) {
      this.value += ':';
      this.value += defaultValue;
    }
    this.value += '}';
    return this;
  };
  return SnippetString;
}());
exports.SnippetString = SnippetString;
var DiagnosticSeverity;
(function (DiagnosticSeverity) {
  DiagnosticSeverity[DiagnosticSeverity["Hint"] = 3] = "Hint";
  DiagnosticSeverity[DiagnosticSeverity["Information"] = 2] = "Information";
  DiagnosticSeverity[DiagnosticSeverity["Warning"] = 1] = "Warning";
  DiagnosticSeverity[DiagnosticSeverity["Error"] = 0] = "Error";
})(DiagnosticSeverity = exports.DiagnosticSeverity || (exports.DiagnosticSeverity = {}));
var Location = (function () {
  function Location(uri, rangeOrPosition) {
    this.uri = uri;
    if (!rangeOrPosition) {
      //that's OK
    }
    else if (rangeOrPosition instanceof Range) {
      this.range = rangeOrPosition;
    }
    else if (rangeOrPosition instanceof Position) {
      this.range = new Range(rangeOrPosition, rangeOrPosition);
    }
    else {
      throw new Error('Illegal argument');
    }
  }
  Location.isLocation = function (thing) {
    if (thing instanceof Location) {
      return true;
    }
    if (!thing) {
      return false;
    }
    return Range.isRange(thing.range)
      && uri_1.default.isUri(thing.uri);
  };
  Location.prototype.toJSON = function () {
    return {
      uri: this.uri,
      range: this.range
    };
  };
  return Location;
}());
exports.Location = Location;
var Diagnostic = (function () {
  function Diagnostic(range, message, severity) {
    if (severity === void 0) { severity = DiagnosticSeverity.Error; }
    this.range = range;
    this.message = message;
    this.severity = severity;
  }
  Diagnostic.prototype.toJSON = function () {
    return {
      severity: DiagnosticSeverity[this.severity],
      message: this.message,
      range: this.range,
      source: this.source,
      code: this.code,
    };
  };
  return Diagnostic;
}());
exports.Diagnostic = Diagnostic;
var Hover = (function () {
  function Hover(contents, range) {
    if (!contents) {
      throw new Error('Illegal argument, contents must be defined');
    }
    if (Array.isArray(contents)) {
      this.contents = contents;
    }
    else {
      this.contents = [contents];
    }
    this.range = range;
  }
  return Hover;
}());
exports.Hover = Hover;
var DocumentHighlightKind;
(function (DocumentHighlightKind) {
  DocumentHighlightKind[DocumentHighlightKind["Text"] = 0] = "Text";
  DocumentHighlightKind[DocumentHighlightKind["Read"] = 1] = "Read";
  DocumentHighlightKind[DocumentHighlightKind["Write"] = 2] = "Write";
})(DocumentHighlightKind = exports.DocumentHighlightKind || (exports.DocumentHighlightKind = {}));
var DocumentHighlight = (function () {
  function DocumentHighlight(range, kind) {
    if (kind === void 0) { kind = DocumentHighlightKind.Text; }
    this.range = range;
    this.kind = kind;
  }
  DocumentHighlight.prototype.toJSON = function () {
    return {
      range: this.range,
      kind: DocumentHighlightKind[this.kind]
    };
  };
  return DocumentHighlight;
}());
exports.DocumentHighlight = DocumentHighlight;
var SymbolKind;
(function (SymbolKind) {
  SymbolKind[SymbolKind["File"] = 0] = "File";
  SymbolKind[SymbolKind["Module"] = 1] = "Module";
  SymbolKind[SymbolKind["Namespace"] = 2] = "Namespace";
  SymbolKind[SymbolKind["Package"] = 3] = "Package";
  SymbolKind[SymbolKind["Class"] = 4] = "Class";
  SymbolKind[SymbolKind["Method"] = 5] = "Method";
  SymbolKind[SymbolKind["Property"] = 6] = "Property";
  SymbolKind[SymbolKind["Field"] = 7] = "Field";
  SymbolKind[SymbolKind["Constructor"] = 8] = "Constructor";
  SymbolKind[SymbolKind["Enum"] = 9] = "Enum";
  SymbolKind[SymbolKind["Interface"] = 10] = "Interface";
  SymbolKind[SymbolKind["Function"] = 11] = "Function";
  SymbolKind[SymbolKind["Variable"] = 12] = "Variable";
  SymbolKind[SymbolKind["Constant"] = 13] = "Constant";
  SymbolKind[SymbolKind["String"] = 14] = "String";
  SymbolKind[SymbolKind["Number"] = 15] = "Number";
  SymbolKind[SymbolKind["Boolean"] = 16] = "Boolean";
  SymbolKind[SymbolKind["Array"] = 17] = "Array";
  SymbolKind[SymbolKind["Object"] = 18] = "Object";
  SymbolKind[SymbolKind["Key"] = 19] = "Key";
  SymbolKind[SymbolKind["Null"] = 20] = "Null";
  SymbolKind[SymbolKind["EnumMember"] = 21] = "EnumMember";
  SymbolKind[SymbolKind["Struct"] = 22] = "Struct";
  SymbolKind[SymbolKind["Event"] = 23] = "Event";
  SymbolKind[SymbolKind["Operator"] = 24] = "Operator";
  SymbolKind[SymbolKind["TypeParameter"] = 25] = "TypeParameter";
})(SymbolKind = exports.SymbolKind || (exports.SymbolKind = {}));
var SymbolInformation = (function () {
  function SymbolInformation(name, kind, rangeOrContainer, locationOrUri, containerName) {
    this.name = name;
    this.kind = kind;
    this.containerName = containerName;
    if (typeof rangeOrContainer === 'string') {
      this.containerName = rangeOrContainer;
    }
    if (locationOrUri instanceof Location) {
      this.location = locationOrUri;
    }
    else if (rangeOrContainer instanceof Range) {
      this.location = new Location(locationOrUri, rangeOrContainer);
    }
  }
  SymbolInformation.prototype.toJSON = function () {
    return {
      name: this.name,
      kind: SymbolKind[this.kind],
      location: this.location,
      containerName: this.containerName
    };
  };
  return SymbolInformation;
}());
exports.SymbolInformation = SymbolInformation;
var CodeLens = (function () {
  function CodeLens(range, command) {
    this.range = range;
    this.command = command;
  }
  Object.defineProperty(CodeLens.prototype, "isResolved", {
    get: function () {
      return !!this.command;
    },
    enumerable: true,
    configurable: true
  });
  return CodeLens;
}());
exports.CodeLens = CodeLens;
var ParameterInformation = (function () {
  function ParameterInformation(label, documentation) {
    this.label = label;
    this.documentation = documentation;
  }
  return ParameterInformation;
}());
exports.ParameterInformation = ParameterInformation;
var SignatureInformation = (function () {
  function SignatureInformation(label, documentation) {
    this.label = label;
    this.documentation = documentation;
    this.parameters = [];
  }
  return SignatureInformation;
}());
exports.SignatureInformation = SignatureInformation;
var SignatureHelp = (function () {
  function SignatureHelp() {
    this.signatures = [];
  }
  return SignatureHelp;
}());
exports.SignatureHelp = SignatureHelp;
var CompletionItemKind;
(function (CompletionItemKind) {
  CompletionItemKind[CompletionItemKind["Text"] = 0] = "Text";
  CompletionItemKind[CompletionItemKind["Method"] = 1] = "Method";
  CompletionItemKind[CompletionItemKind["Function"] = 2] = "Function";
  CompletionItemKind[CompletionItemKind["Constructor"] = 3] = "Constructor";
  CompletionItemKind[CompletionItemKind["Field"] = 4] = "Field";
  CompletionItemKind[CompletionItemKind["Variable"] = 5] = "Variable";
  CompletionItemKind[CompletionItemKind["Class"] = 6] = "Class";
  CompletionItemKind[CompletionItemKind["Interface"] = 7] = "Interface";
  CompletionItemKind[CompletionItemKind["Module"] = 8] = "Module";
  CompletionItemKind[CompletionItemKind["Property"] = 9] = "Property";
  CompletionItemKind[CompletionItemKind["Unit"] = 10] = "Unit";
  CompletionItemKind[CompletionItemKind["Value"] = 11] = "Value";
  CompletionItemKind[CompletionItemKind["Enum"] = 12] = "Enum";
  CompletionItemKind[CompletionItemKind["Keyword"] = 13] = "Keyword";
  CompletionItemKind[CompletionItemKind["Snippet"] = 14] = "Snippet";
  CompletionItemKind[CompletionItemKind["Color"] = 15] = "Color";
  CompletionItemKind[CompletionItemKind["File"] = 16] = "File";
  CompletionItemKind[CompletionItemKind["Reference"] = 17] = "Reference";
  CompletionItemKind[CompletionItemKind["Folder"] = 18] = "Folder";
  CompletionItemKind[CompletionItemKind["EnumMember"] = 19] = "EnumMember";
  CompletionItemKind[CompletionItemKind["Constant"] = 20] = "Constant";
  CompletionItemKind[CompletionItemKind["Struct"] = 21] = "Struct";
  CompletionItemKind[CompletionItemKind["Event"] = 22] = "Event";
  CompletionItemKind[CompletionItemKind["Operator"] = 23] = "Operator";
  CompletionItemKind[CompletionItemKind["TypeParameter"] = 24] = "TypeParameter";
})(CompletionItemKind = exports.CompletionItemKind || (exports.CompletionItemKind = {}));
var CompletionItem = (function () {
  function CompletionItem(label, kind) {
    this.label = label;
    this.kind = kind;
  }
  CompletionItem.prototype.toJSON = function () {
    return {
      label: this.label,
      kind: CompletionItemKind[this.kind],
      detail: this.detail,
      documentation: this.documentation,
      sortText: this.sortText,
      filterText: this.filterText,
      insertText: this.insertText,
      textEdit: this.textEdit
    };
  };
  return CompletionItem;
}());
exports.CompletionItem = CompletionItem;
var CompletionList = (function () {
  function CompletionList(items, isIncomplete) {
    if (items === void 0) { items = []; }
    if (isIncomplete === void 0) { isIncomplete = false; }
    this.items = items;
    this.isIncomplete = isIncomplete;
  }
  return CompletionList;
}());
exports.CompletionList = CompletionList;
var ViewColumn;
(function (ViewColumn) {
  ViewColumn[ViewColumn["One"] = 1] = "One";
  ViewColumn[ViewColumn["Two"] = 2] = "Two";
  ViewColumn[ViewColumn["Three"] = 3] = "Three";
})(ViewColumn = exports.ViewColumn || (exports.ViewColumn = {}));
var StatusBarAlignment;
(function (StatusBarAlignment) {
  StatusBarAlignment[StatusBarAlignment["Left"] = 1] = "Left";
  StatusBarAlignment[StatusBarAlignment["Right"] = 2] = "Right";
})(StatusBarAlignment = exports.StatusBarAlignment || (exports.StatusBarAlignment = {}));
var TextEditorLineNumbersStyle;
(function (TextEditorLineNumbersStyle) {
  TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Off"] = 0] = "Off";
  TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["On"] = 1] = "On";
  TextEditorLineNumbersStyle[TextEditorLineNumbersStyle["Relative"] = 2] = "Relative";
})(TextEditorLineNumbersStyle = exports.TextEditorLineNumbersStyle || (exports.TextEditorLineNumbersStyle = {}));
var TextDocumentSaveReason;
(function (TextDocumentSaveReason) {
  TextDocumentSaveReason[TextDocumentSaveReason["Manual"] = 1] = "Manual";
  TextDocumentSaveReason[TextDocumentSaveReason["AfterDelay"] = 2] = "AfterDelay";
  TextDocumentSaveReason[TextDocumentSaveReason["FocusOut"] = 3] = "FocusOut";
})(TextDocumentSaveReason = exports.TextDocumentSaveReason || (exports.TextDocumentSaveReason = {}));
var TextEditorRevealType;
(function (TextEditorRevealType) {
  TextEditorRevealType[TextEditorRevealType["Default"] = 0] = "Default";
  TextEditorRevealType[TextEditorRevealType["InCenter"] = 1] = "InCenter";
  TextEditorRevealType[TextEditorRevealType["InCenterIfOutsideViewport"] = 2] = "InCenterIfOutsideViewport";
  TextEditorRevealType[TextEditorRevealType["AtTop"] = 3] = "AtTop";
})(TextEditorRevealType = exports.TextEditorRevealType || (exports.TextEditorRevealType = {}));
var TextEditorSelectionChangeKind;
(function (TextEditorSelectionChangeKind) {
  TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Keyboard"] = 1] = "Keyboard";
  TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Mouse"] = 2] = "Mouse";
  TextEditorSelectionChangeKind[TextEditorSelectionChangeKind["Command"] = 3] = "Command";
})(TextEditorSelectionChangeKind = exports.TextEditorSelectionChangeKind || (exports.TextEditorSelectionChangeKind = {}));
(function (TextEditorSelectionChangeKind) {
  function fromValue(s) {
    switch (s) {
      case 'keyboard': return TextEditorSelectionChangeKind.Keyboard;
      case 'mouse': return TextEditorSelectionChangeKind.Mouse;
      case 'api': return TextEditorSelectionChangeKind.Command;
    }
    return undefined;
  }
  TextEditorSelectionChangeKind.fromValue = fromValue;
})(TextEditorSelectionChangeKind = exports.TextEditorSelectionChangeKind || (exports.TextEditorSelectionChangeKind = {}));
var DocumentLink = (function () {
  function DocumentLink(range, target) {
    if (target && !(target instanceof uri_1.default)) {
      throw errors_1.illegalArgument('target');
    }
    if (!Range.isRange(range) || range.isEmpty) {
      throw errors_1.illegalArgument('range');
    }
    this.range = range;
    this.target = target;
  }
  return DocumentLink;
}());
exports.DocumentLink = DocumentLink;
var FileLocationKind;
(function (FileLocationKind) {
  FileLocationKind[FileLocationKind["Auto"] = 1] = "Auto";
  FileLocationKind[FileLocationKind["Relative"] = 2] = "Relative";
  FileLocationKind[FileLocationKind["Absolute"] = 3] = "Absolute";
})(FileLocationKind = exports.FileLocationKind || (exports.FileLocationKind = {}));
var ApplyToKind;
(function (ApplyToKind) {
  ApplyToKind[ApplyToKind["AllDocuments"] = 1] = "AllDocuments";
  ApplyToKind[ApplyToKind["OpenDocuments"] = 2] = "OpenDocuments";
  ApplyToKind[ApplyToKind["ClosedDocuments"] = 3] = "ClosedDocuments";
})(ApplyToKind = exports.ApplyToKind || (exports.ApplyToKind = {}));
var RevealKind;
(function (RevealKind) {
  RevealKind[RevealKind["Always"] = 1] = "Always";
  RevealKind[RevealKind["Silent"] = 2] = "Silent";
  RevealKind[RevealKind["Never"] = 3] = "Never";
})(RevealKind = exports.RevealKind || (exports.RevealKind = {}));
var BaseTask = (function () {
  function BaseTask(name, problemMatchers) {
    if (typeof name !== 'string') {
      throw errors_1.illegalArgument('name');
    }
    this._name = name;
    this._identifier = name;
    this._problemMatchers = problemMatchers || [];
    this._isBackground = false;
    this._terminal = Object.create(null);
  }
  Object.defineProperty(BaseTask.prototype, "identifier", {
    get: function () {
      return this._identifier;
    },
    set: function (value) {
      if (typeof value !== 'string') {
        throw errors_1.illegalArgument('identifier');
      }
      if (value.indexOf(':') !== -1) {
        throw errors_1.illegalArgument('identifier must not contain \':\'');
      }
      this._identifier = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, "name", {
    get: function () {
      return this._name;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, "isBackground", {
    get: function () {
      return this._isBackground;
    },
    set: function (value) {
      if (value !== true && value !== false) {
        value = false;
      }
      this._isBackground = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, "terminal", {
    get: function () {
      return this._terminal;
    },
    set: function (value) {
      if (value === void 0 || value === null) {
        value = Object.create(null);
      }
      this._terminal = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(BaseTask.prototype, "problemMatchers", {
    get: function () {
      return this._problemMatchers;
    },
    set: function (value) {
      if (!Array.isArray(value)) {
        value = [];
      }
      this._problemMatchers = value;
    },
    enumerable: true,
    configurable: true
  });
  return BaseTask;
}());
exports.BaseTask = BaseTask;
var ProblemMatcher;
(function (ProblemMatcher) {
  function is(value) {
    var candidate = value;
    return candidate && !!candidate.pattern;
  }
  ProblemMatcher.is = is;
})(ProblemMatcher || (ProblemMatcher = {}));
var ShellOptions;
(function (ShellOptions) {
  function is(value) {
    return value && ((typeof value.executable === 'string') || (typeof value.cwd === 'string') || !!value.env);
  }
  ShellOptions.is = is;
})(ShellOptions || (ShellOptions = {}));
var TaskGroup;
(function (TaskGroup) {
  /**
   * The clean task group
   */
  TaskGroup.Clean = 'clean';
  /**
   * The build task group
   */
  TaskGroup.Build = 'build';
  /**
   * The rebuild all task group
   */
  TaskGroup.RebuildAll = 'rebuildAll';
  /**
   * The test task group
   */
  TaskGroup.Test = 'test';
  function is(value) {
    return value === TaskGroup.Clean || value === TaskGroup.Build || value === TaskGroup.RebuildAll || value === TaskGroup.Test;
  }
  TaskGroup.is = is;
})(TaskGroup = exports.TaskGroup || (exports.TaskGroup = {}));
var ProcessTask = (function (_super) {
  __extends(ProcessTask, _super);
  function ProcessTask(name, process, arg3, arg4, arg5) {
    var _this = this;
    if (typeof process !== 'string') {
      throw errors_1.illegalArgument('process');
    }
    var args;
    var options;
    var problemMatchers;
    args = arg3 || [];
    if (arg4) {
      if (Array.isArray(arg4) || typeof arg4 === 'string' || ProblemMatcher.is(arg4)) {
        problemMatchers = arg4;
      }
      else {
        options = arg4;
      }
    }
    if (arg5 && !problemMatchers) {
      problemMatchers = arg5;
    }
    var pm;
    if (problemMatchers && (typeof problemMatchers === 'string' || ProblemMatcher.is(problemMatchers))) {
      pm = [problemMatchers];
    }
    else if (Array.isArray(problemMatchers)) {
      pm = problemMatchers;
    }
    pm = pm || [];
    _this = _super.call(this, name, pm) || this;
    _this._process = process;
    _this._args = args;
    _this._options = options || Object.create(null);
    return _this;
  }
  Object.defineProperty(ProcessTask.prototype, "process", {
    get: function () {
      return this._process;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ProcessTask.prototype, "args", {
    get: function () {
      return this._args;
    },
    set: function (value) {
      if (!Array.isArray(value)) {
        value = [];
      }
      this._args = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ProcessTask.prototype, "group", {
    get: function () {
      return this._group;
    },
    set: function (value) {
      if (!TaskGroup.is(value)) {
        throw errors_1.illegalArgument('group');
      }
      this._group = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ProcessTask.prototype, "options", {
    get: function () {
      return this._options;
    },
    set: function (value) {
      if (value === void 0 || value === null) {
        value = Object.create(null);
      }
      this._options = value;
    },
    enumerable: true,
    configurable: true
  });
  return ProcessTask;
}(BaseTask));
exports.ProcessTask = ProcessTask;
var ShellTask = (function (_super) {
  __extends(ShellTask, _super);
  function ShellTask(name, commandLine, optionsOrProblemMatchers, problemMatchers) {
    var _this = this;
    if (typeof commandLine !== 'string') {
      throw errors_1.illegalArgument('commandLine');
    }
    var options = undefined;
    var pm;
    if (ShellOptions.is(optionsOrProblemMatchers)) {
      options = optionsOrProblemMatchers;
    }
    else {
      problemMatchers = optionsOrProblemMatchers;
    }
    if (problemMatchers && (typeof problemMatchers === 'string' || ProblemMatcher.is(problemMatchers))) {
      pm = [problemMatchers];
    }
    else if (Array.isArray(problemMatchers)) {
      pm = problemMatchers;
    }
    pm = pm || [];
    _this = _super.call(this, name, pm) || this;
    _this._commandLine = commandLine;
    _this._options = options || Object.create(null);
    return _this;
  }
  Object.defineProperty(ShellTask.prototype, "commandLine", {
    get: function () {
      return this._commandLine;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ShellTask.prototype, "group", {
    get: function () {
      return this._group;
    },
    set: function (value) {
      if (!TaskGroup.is(value)) {
        throw errors_1.illegalArgument('group');
      }
      this._group = value;
    },
    enumerable: true,
    configurable: true
  });
  Object.defineProperty(ShellTask.prototype, "options", {
    get: function () {
      return this._options;
    },
    set: function (value) {
      if (value === void 0 || value === null) {
        value = Object.create(null);
      }
      this._options = value;
    },
    enumerable: true,
    configurable: true
  });
  return ShellTask;
}(BaseTask));
exports.ShellTask = ShellTask;
var ProgressLocation;
(function (ProgressLocation) {
  ProgressLocation[ProgressLocation["SourceControl"] = 1] = "SourceControl";
  ProgressLocation[ProgressLocation["Window"] = 10] = "Window";
})(ProgressLocation = exports.ProgressLocation || (exports.ProgressLocation = {}));
var TreeItemCollapsibleState;
(function (TreeItemCollapsibleState) {
  TreeItemCollapsibleState[TreeItemCollapsibleState["Collapsed"] = 1] = "Collapsed";
  TreeItemCollapsibleState[TreeItemCollapsibleState["Expanded"] = 2] = "Expanded";
})(TreeItemCollapsibleState = exports.TreeItemCollapsibleState || (exports.TreeItemCollapsibleState = {}));
var ThemeColor = (function () {
  function ThemeColor(id) {
    this.id = id;
  }
  return ThemeColor;
}());
exports.ThemeColor = ThemeColor;