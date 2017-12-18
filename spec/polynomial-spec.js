var me = require('../lib/math-expressions');
var trees = require('../lib/trees/basic');
var poly = require('../lib/polynomial/polynomial');
var simplify = require('../lib/expression/simplify');

describe("text to polynomial", function () {

    var polys = {
	'1+x^3': ["polynomial", "x", {0:1, 3:1}],
	'3-2y^2+5/2y': ["polynomial", "y", {0: 3, 1: 2.5, 2:-2}],
	'2abc-a-2b+3c': ["polynomial", "a", {0: ["polynomial", "b", {0: ["polynomial", "c", {1: 3}], 1: -2}], 1: ["polynomial", "b", {0: -1, 1: ["polynomial", "c", {1: 2}]}]}],
	'x sin(x)-x': ["polynomial", "x", {1: ["polynomial", ["apply", "sin", "x"], {0: -1, 1: 1}]}],
	'(x+3)(2x-4)': ["polynomial", "x", {0: -12, 1: 2, 2: 2}],
	'x/7-2/3+3/4x^2': ["polynomial", "x", {0: ['/', -2, 3], 1: ['/', 1, 7], 2: 0.75}],
	'9x^(2/3)-pi*x': ["polynomial", "x", {0: ["polynomial", ['^', 'x', ['/', 1, 3]], {2: 9}], 1: ['-', 'pi']}],
	'(5x^2-3x+1)/3': ["polynomial", "x", {0: ['/', 1, 3], 1: -1, 2: ['/', 5, 3]}],
	'7i+2x+3ix': ["polynomial", "x", {0: ['*', 7, 'i'], 1: ['+', 2, ['*', 3, 'i']]}],
	'6t+2t-5t^2-1+5t^2': ["polynomial", "t", {0: -1, 1: 8}],
	'(3,4)': false,
	'0/0': NaN,
	't-t^1000000000': ["polynomial", "t", {1:1, 1000000000: -1}],
	'x/y+3x': ["polynomial", 'x', {0: ["polynomial", ['/', 'x', 'y'], {1:1}], 1: 3}],
	'(x+y)^2': ["polynomial", 'x', {0: ["polynomial", "y", {2:1}], 1: ["polynomial", "y", {1: 2}], 2: 1}],
	'(s-t)(s+t)': ["polynomial", "s", {0: ["polynomial", "t", {2:-1}], 2: 1}],
	'5t^(3.1)': ["polynomial", ['^', 't', 0.1], {31: 5}],
	'5t^(3.1415)': ["polynomial", ['^', 't', 3.1415], {1: 5}],
    };

    Object.keys(polys).forEach(function(string) {
	it("poly " + string, function() {
	    expect(poly.expression_to_polynomial(me.fromText(string))).toEqual(polys[string]);
	});	
    });


    var expressions = [
	'3x^2+2xy-z^2',
	['(s-t)(s+t)', 's^2-t^2'],
	['(x+y)^3', 'x^3 + 3x^2y + 3xy^2 + y^3'],
	'sin(x)y-y^3',
	'9(3y-2x)^3.1',
	'9(3y-2x)^3.1415',
	['(5a^2xyz-3uvw)(5a^2xyz+3uvw)', '25a^4x^2y^2z^2-9u^2v^2w^2'],
	'3qt-qt/(3sr)',
    ];

    function round_trip(expr) {
	return poly.polynomial_to_expression(poly.expression_to_polynomial(
	    me.from(expr)))
    }
    
    // expression should be equal after converting to polynomial and back
    // (if an array, then first element should be converted to second)
    expressions.forEach(function(expr) {
	it(expr, function() {
	    if(Array.isArray(expr)) {
		expect(trees.equal(
		    round_trip(expr[0]),
		    simplify.simplify(me.fromText(expr[1]))
		)).toBeTruthy();
	    }
	    else {
		expect(trees.equal(
		    round_trip(expr),
		    simplify.simplify(me.fromText(expr))
		)).toBeTruthy();
	    }
	});
    });

    // additional round trips should leave expression unchanged
    expressions.forEach(function(expr) {
	it(expr, function() {
	    if(Array.isArray(expr)) {
		expect(trees.equal(
		    round_trip(round_trip(expr[0])),
		    round_trip(expr[0])
		)).toBeTruthy();
	    }
	    else {
		expect(trees.equal(
		    round_trip(round_trip(expr)),
		    round_trip(expr)
		)).toBeTruthy();
	    }
	});
    });

    
});

