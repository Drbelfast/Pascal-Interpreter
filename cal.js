/**
 * Grammar
 * expr = term ((PLUS | MINUS) term)*
 * term = factor((MUL | DIV) factor)*
 * factor = (PLUS | MINUS) factor | INTEGER | ( expr ) 
 */



/**
 * [lexer description]
 * @return {[type]} [description]
 */
var Lexer = function() {
  this.rules = {
    'whitespace': /^\s+/,
    'numbers': /^\d+\.?\d*/,
    'plus': /^\+/,
    'minus': /^\-/,
    'mul': /^\*/,
    'div': /^\//,
    'lparen': /^\(/,
    'rparen': /^\)/
  }
};
Lexer.prototype.tokenize = function(text){
  var cap,
      tokens=[];
  while(text) {
    // skip all spaces
    if (cap = this.rules.whitespace.exec(text)) {
      text = text.substring(cap[0].length);
      continue;
    }
    // tokenize numbers
    if (cap = this.rules.numbers.exec(text)) {
      text = text.substring(cap[0].length);
      tokens.push({
        type: 'NUMBER',
        value: parseFloat(cap[0])
      });
      continue;
    }
    // tokenize plus
    if (cap = this.rules.plus.exec(text)) {
      text = text.substring(cap[0].length);
      tokens.push({
        type: 'PLUS',
        value: cap[0]
      });
      continue;
    }

    // tokenize minus
    if (cap = this.rules.minus.exec(text)) {
      text = text.substring(cap[0].length);
      tokens.push({
        type: 'MINUS',
        value: cap[0]
      });
      continue;
    }

    // tokenize mul
    if (cap = this.rules.mul.exec(text)) {
      text = text.substring(cap[0].length);
      tokens.push({
        type: 'MUL',
        value: cap[0]
      });
      continue;
    }

    // tokenize div
    if (cap = this.rules.div.exec(text)) {
      text = text.substring(cap[0].length);
      tokens.push({
        type: 'DIV',
        value: cap[0]
      });
      continue;
    }

    // tokenize left parenthesis
    if (cap = this.rules.lparen.exec(text)) {
      text = text.substring(cap[0].length);
      tokens.push({
        type: 'LPAREN',
        value: '('
      });
      continue;
    }

    // tokenize right parenthesis
    if (cap = this.rules.rparen.exec(text)) {
      text = text.substring(cap[0].length);
      tokens.push({
        type: 'RPAREN',
        value: ')'
      });
      continue;
    }
    throw "invalid input";
  }
  return tokens;
}




var BinOpNode = function(left, op, right) {
  this.left = left;
  this.op = op;
  this.right = right;
}

var NumNode = function(token) {
  return token.value;
}


/**
 * [parser description]
 * @param  {[type]} tokens [description]
 * @return {[type]}        [description]
 */
var Parser = function() {
  this.pos = 0;
}
Parser.prototype.parse = function(tokens){
  this.tokens = tokens;
  this.currentToken = this.tokens[this.pos];
  return this.expr();
}
Parser.prototype.expr = function() {
  var node = this.term();
  while(this.currentToken.type == 'PLUS' || this.currentToken.type == 'MINUS') {
    var token = this.currentToken;
    this.getNextToken();
    node = new BinOpNode(node, token, this.term())
  }
  return node;
}
Parser.prototype.term = function() {
  var node = this.factor();
  while(this.currentToken.type == 'MUL' || this.currentToken.type == 'DIV') {
    var token = this.currentToken;
    this.getNextToken();
    node = new BinOpNode(node, token, this.factor());
  }
  return node;
}

Parser.prototype.factor = function() {
  var token = this.currentToken;
  if (token.typ == 'PLUS' || token.type == 'MINUS') {
    this.getNextToken();
    return new BinOpNode(0, token, this.factor());
  }

  if (token.type == 'NUMBER') {
    this.getNextToken();
    return NumNode(token);
  }
  if (token.type == 'LPAREN') {
    this.getNextToken();
    node = this.expr();
    this.getNextToken();
    return node
  }
}

Parser.prototype.getNextToken = function() {
  if (this.pos < this.tokens.length - 1) {
    this.currentToken = this.tokens[++this.pos];
  }
}

/**
 * [Interpreter description]
 */
var Interpreter = function() {

};
Interpreter.prototype.interprete = function(tree) {
  // use postorder to traverse AST
  if (tree.op == null) return tree;
  var left = this.interprete(tree.left);
  var right = this.interprete(tree.right);
  if (tree.op.type == "PLUS") {
    return left + right;
  } else if (tree.op.type == "MINUS") {
    return left - right;
  } else if (tree.op.type == "MUL") {
    return left * right;
  } else if (tree.op.type == "DIV") {
    return left / right;
  }

}

var test = function() {
  var texts = [
    "1 - - 1",
    "3 + 5 / 7 - 12*43 + (39+8) * 90"
  ];
  for (var i = 0; i < texts.length; i++) {
    text = texts[i];
    var lexer = new Lexer();
    var parser = new Parser();
    var interpreter = new Interpreter();
    var tokens = lexer.tokenize(text);
    // console.log(tokens);
    var tree = parser.parse(tokens);
    var res = interpreter.interprete(tree);
    console.log(res);
  }
  
}

test();

  
