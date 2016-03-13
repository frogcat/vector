(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var japanese = {};

require('./src/kana.js')(japanese);
require('./src/romanize.js')(japanese);
require('./src/numbers.js')(japanese);

module.exports = japanese;

},{"./src/kana.js":3,"./src/numbers.js":4,"./src/romanize.js":5}],2:[function(require,module,exports){
'use strict';

var hasOwn = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;

var isArray = function isArray(arr) {
	if (typeof Array.isArray === 'function') {
		return Array.isArray(arr);
	}

	return toStr.call(arr) === '[object Array]';
};

var isPlainObject = function isPlainObject(obj) {
	if (!obj || toStr.call(obj) !== '[object Object]') {
		return false;
	}

	var hasOwnConstructor = hasOwn.call(obj, 'constructor');
	var hasIsPrototypeOf = obj.constructor && obj.constructor.prototype && hasOwn.call(obj.constructor.prototype, 'isPrototypeOf');
	// Not own constructor property must be Object
	if (obj.constructor && !hasOwnConstructor && !hasIsPrototypeOf) {
		return false;
	}

	// Own properties are enumerated firstly, so to speed up,
	// if last one is own, then all properties are own.
	var key;
	for (key in obj) {/**/}

	return typeof key === 'undefined' || hasOwn.call(obj, key);
};

module.exports = function extend() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0],
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if (typeof target === 'boolean') {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	} else if ((typeof target !== 'object' && typeof target !== 'function') || target == null) {
		target = {};
	}

	for (; i < length; ++i) {
		options = arguments[i];
		// Only deal with non-null/undefined values
		if (options != null) {
			// Extend the base object
			for (name in options) {
				src = target[name];
				copy = options[name];

				// Prevent never-ending loop
				if (target !== copy) {
					// Recurse if we're merging plain objects or arrays
					if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
						if (copyIsArray) {
							copyIsArray = false;
							clone = src && isArray(src) ? src : [];
						} else {
							clone = src && isPlainObject(src) ? src : {};
						}

						// Never move original objects, clone them
						target[name] = extend(deep, clone, copy);

					// Don't bring in undefined values
					} else if (typeof copy !== 'undefined') {
						target[name] = copy;
					}
				}
			}
		}
	}

	// Return the modified object
	return target;
};


},{}],3:[function(require,module,exports){
'use strict';

module.exports = function (japanese) {
	japanese.katakanaRegex = new RegExp(
		'(' +
			'[' +
				'\\u30a1-\\u30f4' + // ァ～ヴ
				'\\u30f7-\\u30fa' + // ヷ～ヺ
				'\\u30fd-\\u30ff' + // ヽ～ヿ
				'\\u31f0-\\u31ff' + // ㇰ～ㇿ
			']' +
		'|' +
			'\\ud869\\udf08\\u3099' + // 𪜈゙
		'|' +
			'\\ud869\\udf08' + // 𪜈
		'|' +
			'\\ud82c\\udc00' + // 𛀀
		')',
	'g');

	japanese.hiraganaRegex = new RegExp(
		'(' +
			'[' +
				'\\u3041-\\u3094' + // ぁ～ゔ
				'\\u309d-\\u309f' + // ゝ～ゟ
			']' +
		'|' +
			'\\ud82c\\udc01' + // 𛀁
		')',
	'g');

	japanese.specialHiraganizationTable = {
		'ヿ': 'こと',
		'𪜈': 'とも',
		'𪜈゙': 'ども',
		'ヷ': 'わ゙',
		'ヸ': 'ゐ゙',
		'ヹ': 'ゑ゙',
		'ヺ': 'を゙',
		'𛀀': 'え',
		'ㇰ': 'く',
		'ㇱ': 'し',
		'ㇲ': 'す',
		'ㇳ': 'と',
		'ㇴ': 'ぬ',
		'ㇵ': 'は',
		'ㇶ': 'ひ',
		'ㇷ': 'ふ',
		'ㇸ': 'へ',
		'ㇹ': 'ほ',
		'ㇺ': 'む',
		'ㇻ': 'ら',
		'ㇼ': 'り',
		'ㇽ': 'る',
		'ㇾ': 'れ',
		'ㇿ': 'ろ',
	};

	japanese.specialKatakanizationTable = {
		'ゟ': 'ヨリ',
		'𛀁': 'エ',
	};

	var chr = String.fromCharCode;
	var ord = function (char) {
		return char.charCodeAt(0);
	};

	japanese.hiraganize = function (string) {
		return string.replace(japanese.katakanaRegex, function (katakana) {
			if (katakana.match(/^[\u30a1-\u30f4\u30fd\u30fe]$/)) {
				return chr(ord(katakana) - ord('ァ') + ord('ぁ'));
			} else if (japanese.specialHiraganizationTable[katakana]) {
				return japanese.specialHiraganizationTable[katakana];
			}
		});
	};

	japanese.katakanize = function (string) {
		return string.replace(japanese.hiraganaRegex, function (hiragana) {
			if (hiragana.match(/^[\u3041-\u3094\u309d\u309e]$/)) {
				return chr(ord(hiragana) - ord('ぁ') + ord('ァ'));
			} else if (japanese.specialKatakanizationTable[hiragana]) {
				return japanese.specialKatakanizationTable[hiragana];
			}
		});
	};
};

},{}],4:[function(require,module,exports){
'use strict';

var extend = require('extend');

module.exports = function (japanese) {
	japanese.transcriptionConfigs = {
		'default': {
			minusSign: 'マイナス',
			decimalPoint: '・',
			digits: 'common',
			unitNames: 'jinkoki3',
			specialUnitNames: 'none',
			truncateOne: ['十', '百', '千', '拾', '佰', '阡', '仟'],
			smallUnitNames: 'none',
		},
		formal: {
			digits: 'formal',
			unitNames: 'formal',
			specialUnitNames: 'common',
			smallUnitNames: 'common',
		},
		traditional: {
			digits: 'traditional',
			specialUnitNames: 'full',
			smallUnitNames: 'full',
		},
	};

	japanese.predefineedTranscriptionConfigs = {
		digits: {
			arabic: {
				0: '0',
				1: '1',
				2: '2',
				3: '3',
				4: '4',
				5: '5',
				6: '6',
				7: '7',
				8: '8',
				9: '9',
			},
			common: {
				0: '〇',
				1: '一',
				2: '二',
				3: '三',
				4: '四',
				5: '五',
				6: '六',
				7: '七',
				8: '八',
				9: '九',
			},
			formal: {
				0: '〇',
				1: '壱',
				2: '弐',
				3: '参',
				4: '四',
				5: '五',
				6: '六',
				7: '七',
				8: '八',
				9: '九',
			},
			traditional: {
				0: '零',
				1: '壱',
				2: '弐',
				3: '参',
				4: '肆',
				5: '伍',
				6: '陸',
				7: '柒',
				8: '捌',
				9: '玖',
			},
			traditionalOld: {
				0: '零',
				1: '壹',
				2: '貳',
				3: '參',
				4: '肆',
				5: '伍',
				6: '陸',
				7: '柒',
				8: '捌',
				9: '玖',
			},
			simplified: {
				0: '零',
				1: '壹',
				2: '贰',
				3: '叁',
				4: '肆',
				5: '伍',
				6: '陆',
				7: '柒',
				8: '捌',
				9: '玖',
			},
			chineseMilitary: {
				0: '洞',
				1: '幺',
				2: '两',
				3: '三',
				4: '刀',
				5: '五',
				6: '六',
				7: '拐',
				8: '八',
				9: '勾',
			},
			vietnam: {
				0: '〇',
				1: '𠬠',
				2: '𠄩',
				3: '𠀧',
				4: '𦊚',
				5: '𠄼',
				6: '𦒹',
				7: '𦉱',
				8: '𠔭',
				9: '𠃩',
			},
		},
		unitNames: {
			jinkoki1: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				5: '億',
				6: '兆',
				7: '京',
				8: '垓',
				9: '𥝱',
				10: '穣',
				11: '溝',
				12: '澗',
				13: '正',
				14: '載',
				15: '極',
				23: '恒河沙',
				31: '阿僧祇',
				39: '那由他',
				47: '不可思議',
				55: '無量大数',
				lit: 63,
			},
			jinkoki2: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				12: '兆',
				16: '京',
				20: '垓',
				24: '𥝱',
				28: '穣',
				32: '溝',
				36: '澗',
				40: '正',
				44: '載',
				48: '極',
				56: '恒河沙',
				64: '阿僧祇',
				72: '那由他',
				80: '不可思議',
				88: '無量大数',
				lit: 96,
			},
			jinkoki3: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				12: '兆',
				16: '京',
				20: '垓',
				24: '𥝱',
				28: '穣',
				32: '溝',
				36: '澗',
				40: '正',
				44: '載',
				48: '極',
				52: '恒河沙',
				56: '阿僧祇',
				60: '那由他',
				64: '不可思議',
				68: '無量大数',
				lit: 72,
			},
			josu: {
				1: '十',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				16: '兆',
				32: '京',
				64: '垓',
				128: '𥝱',
				256: '穣',
				512: '溝',
				1024: '澗',
				2048: '正',
				4096: '載',
				8192: '極',
				16384: '恒河沙',
				32768: '阿僧祇',
				65536: '那由他',
				131072: '不可思議',
				262144: '無量大数',
				lit: 524288,
			},
			formal: {
				1: '拾',
				2: '百',
				3: '千',
				4: '万',
				8: '億',
				12: '兆',
				16: '京',
				20: '垓',
				24: '𥝱',
				28: '穣',
				32: '溝',
				36: '澗',
				40: '正',
				44: '載',
				48: '極',
				52: '恒河沙',
				56: '阿僧祇',
				60: '那由他',
				64: '不可思議',
				68: '無量大数',
				lit: 72,
			},
		},
		specialUnitNames: {
			none: {},
			common: {
				20: '廿',
				30: '卅',
			},
			full: {
				20: '廿',
				30: '卅',
				40: '卌',
				200: '皕',
			},
		},
		smallUnitNames: {
			none: {},
			common: {
				1: '分',
				2: '厘',
				3: '毛',
				4: '糸',
			},
			wari: {
				1: '割',
				2: '分',
				3: '厘',
				4: '毛',
				5: '糸',
			},
			full: {
				1: '分',
				2: '厘',
				3: '毛',
				4: '糸',
				5: '忽',
				6: '微',
				7: '繊',
				8: '沙',
				9: '塵',
				10: '埃',
				11: '渺',
				12: '漠',
				13: '模糊',
				14: '逡巡',
				15: '須臾',
				16: '瞬息',
				17: '弾指',
				18: '刹那',
				19: '六徳',
				20: '虚空',
				21: '清浄',
			},
			wariFull: {
				1: '割',
				2: '分',
				3: '厘',
				4: '毛',
				5: '糸',
				6: '忽',
				7: '微',
				8: '繊',
				9: '沙',
				10: '塵',
				11: '埃',
				12: '渺',
				13: '漠',
				14: '模糊',
				15: '逡巡',
				16: '須臾',
				17: '瞬息',
				18: '弾指',
				19: '刹那',
				20: '六徳',
				21: '虚空',
				22: '清浄',
			},
		},
	};

	japanese.transcribeNumber = function (number, config) {
		if (typeof config === 'undefined') {
			// default config
			config = japanese.transcriptionConfigs['default'];
		}

		if (typeof config === 'string') {
			config = japanese.transcriptionConfigs[config];

			if (typeof config === 'undefined') {
				throw new ReferenceError('Transcription method "' + config + '" is undefined');
			}
		}

		if (typeof config === 'object') {
			config = extend({}, japanese.transcriptionConfigs['default'], config);
		} else {
			throw new Error('You specified unknown config to japanese.transcribeNumber');
		}

		if (typeof config.digits === 'string') {
			config.digits = japanese.predefineedTranscriptionConfigs.digits[config.digits];

			if (typeof config.digits === 'undefined') {
				throw new ReferenceError('Transcription method of digits "' + config.digits + '" is undefined');
			}
		}

		if (typeof config.unitNames === 'string') {
			config.unitNames = japanese.predefineedTranscriptionConfigs.unitNames[config.unitNames];

			if (typeof config.unitNames === 'undefined') {
				throw new ReferenceError('Transcription method of unitNames "' + config.unitNames + '" is undefined');
			}
		}

		if (typeof config.specialUnitNames === 'string') {
			config.specialUnitNames = japanese.predefineedTranscriptionConfigs.specialUnitNames[config.specialUnitNames];

			if (typeof config.specialUnitNames === 'undefined') {
				throw new ReferenceError('Transcription method of specialUnitNames "' + config.specialUnitNames + '" is undefined');
			}
		}

		if (typeof config.smallUnitNames === 'string') {
			config.smallUnitNames = japanese.predefineedTranscriptionConfigs.smallUnitNames[config.smallUnitNames];

			if (typeof config.smallUnitNames === 'undefined') {
				throw new ReferenceError('Transcription method of smallUnitNames "' + config.smallUnitNames + '" is undefined');
			}
		}

		// Unify input to string

		if (typeof number === 'number') {
			// TODO
			number = number.toString();
		} else if (typeof number !== 'string') {
			throw new ReferenceError('Type of `number` is unsupported');
		}

		var length = number.length;

		// Main convertion starts here

		// handle zero
		if (number === '0') {
			return config.digits[0];
		}

		var transcription = '';

		if (number.slice(-1) !== '0') {
			transcription += config.digits[number.slice(-1)]
		}

		// Get sanitized unit name keys
		var keysOfUnitNames = Object.keys(config.unitNames).map(function (key) {
			// convert to int
			return parseInt(key);
		}).filter(function (key, index, self) {
			// unique
			return self.indexOf(key) === index;
		}).filter(function (key) {
			// validate
			return isFinite(key) && key > 0;
		}).sort(function (a, b) {
			// asc sort
			return a - b;
		});

		keysOfUnitNames.forEach(function (key, index) {
			var nextKey = keysOfUnitNames[index + 1] || Infinity;
			// slice the digits spaned by the unit name
			var token = number.slice(Math.max(length - nextKey, 0), Math.max(length - key, 0));

			if (token.length > 0) {
				// check if every number in the token is zero
				if (!token.split('').every(function (digit) { return digit === '0' })) {
					// truncateOne
					if (config.truncateOne.indexOf(config.unitNames[key]) !== -1 && parseInt(token) === 1) {
						transcription = config.unitNames[key] + transcription;
					} else {
						transcription = japanese.transcribeNumber(token, config) + config.unitNames[key] + transcription;
					}
				}
			}
		});

		return transcription;
	};

	return japanese;
};

},{"extend":2}],5:[function(require,module,exports){
'use strict';

var extend = require('extend');

module.exports = function (japanese) {
	japanese.romanizationTable = {
		'あ': 'a',
		'い': 'i',
		'う': 'u',
		'え': 'e',
		'お': 'o',
		'か': 'ka',
		'き': 'ki',
		'く': 'ku',
		'け': 'ke',
		'こ': 'ko',
		'さ': 'sa',
		'し': 'si',
		'す': 'su',
		'せ': 'se',
		'そ': 'so',
		'た': 'ta',
		'ち': 'ti',
		'つ': 'tu',
		'て': 'te',
		'と': 'to',
		'な': 'na',
		'に': 'ni',
		'ぬ': 'nu',
		'ね': 'ne',
		'の': 'no',
		'は': 'ha',
		'ひ': 'hi',
		'ふ': 'hu',
		'へ': 'he',
		'ほ': 'ho',
		'ま': 'ma',
		'み': 'mi',
		'む': 'mu',
		'め': 'me',
		'も': 'mo',
		'や': 'ya',
		'ゆ': 'yu',
		'よ': 'yo',
		'ら': 'ra',
		'り': 'ri',
		'る': 'ru',
		'れ': 're',
		'ろ': 'ro',
		'わ': 'wa',
		'ゐ': 'wi',
		'ゑ': 'we',
		'を': 'wo',
		'ん': 'n',
		'が': 'ga',
		'ぎ': 'gi',
		'ぐ': 'gu',
		'げ': 'ge',
		'ご': 'go',
		'ざ': 'za',
		'じ': 'zi',
		'ず': 'zu',
		'ぜ': 'ze',
		'ぞ': 'zo',
		'だ': 'da',
		'ぢ': 'di',
		'づ': 'du',
		'で': 'de',
		'ど': 'do',
		'ば': 'ba',
		'び': 'bi',
		'ぶ': 'bu',
		'べ': 'be',
		'ぼ': 'bo',
		'ゔ': 'vu',
		'ぱ': 'pa',
		'ぴ': 'pi',
		'ぷ': 'pu',
		'ぺ': 'pe',
		'ぽ': 'po',
		'きゃ': 'kya',
		'きゅ': 'kyu',
		'きぇ': 'kye',
		'きょ': 'kyo',
		'しゃ': 'sya',
		'しゅ': 'syu',
		'しぇ': 'sye',
		'しょ': 'syo',
		'ちゃ': 'tya',
		'ちゅ': 'tyu',
		'ちぇ': 'tye',
		'ちょ': 'tyo',
		'にゃ': 'nya',
		'にゅ': 'nyu',
		'にぇ': 'nye',
		'にょ': 'nyo',
		'ひゃ': 'hya',
		'ひゅ': 'hyu',
		'ひぇ': 'hye',
		'ひょ': 'hyo',
		'みゃ': 'mya',
		'みゅ': 'my',
		'みぇ': 'mye',
		'みょ': 'myo',
		'りゃ': 'rya',
		'りゅ': 'ryu',
		'りぇ': 'rye',
		'りょ': 'ryo',
		'ぎゃ': 'gya',
		'ぎゅ': 'gyu',
		'ぎぇ': 'gye',
		'ぎょ': 'gyo',
		'じゃ': 'zya',
		'じゅ': 'zyu',
		'じぇ': 'zye',
		'じょ': 'zyo',
		'ぢゃ': 'dya',
		'ぢゅ': 'dyu',
		'ぢぇ': 'dye',
		'ぢょ': 'dyo',
		'びゃ': 'bya',
		'びゅ': 'byu',
		'びぇ': 'bye',
		'びょ': 'byo',
		'ゔぁ': 'va',
		'ゔぃ': 'vi',
		'ゔぇ': 've',
		'ゔぉ': 'vo',
		'ぴゃ': 'pya',
		'ぴゅ': 'pyu',
		'ぴぇ': 'pye',
		'ぴょ': 'pyo',
		/*
		 * Rarely used character combinations
		 *
		 * These romanizations are normally not defined in most specifications and
		 * very hard to verify therefore.
		 * In this library, most of the codes are derived from following Wikipedia article.
		 * http://en.wikipedia.org/wiki/Hepburn_romanization#For_extended_katakana
		 */
		'いぃ': 'yi',
		'いぇ': 'ye',
		'うぁ': 'wa',
		'うぃ': 'wi',
		'うぅ': 'wu',
		'うぇ': 'we',
		'うぉ': 'wo',
		'うゅ': 'wyu',
		'ゔゃ': 'vya',
		'ゔゅ': 'vyu',
		'ゔょ': 'vyo',
		'くぁ': 'kwa',
		'くぃ': 'kwi',
		'くぅ': 'kwu',
		'くぇ': 'kwe',
		'くぉ': 'kwo',
		'くゎ': 'kwa',
		'ぐぁ': 'gwa',
		'ぐぃ': 'gwi',
		'ぐぅ': 'gwu',
		'ぐぇ': 'gwe',
		'ぐぉ': 'gwo',
		'ぐゎ': 'gwa',
		'すぃ': 'si',
		'ずぃ': 'zi',
		'つぁ': 'tua',
		'つぃ': 'tui',
		'つぇ': 'tue',
		'つぉ': 'tuo',
		'つゅ': 'tuyu',
		'づぁ': 'dua',
		'づぃ': 'dui',
		'づぇ': 'due',
		'づぉ': 'duo',
		'てゃ': 'tea',
		'てぃ': 'tei',
		'てゅ': 'teu',
		'てぇ': 'tee',
		'てょ': 'teo',
		'とぅ': 'tou',
		'でゃ': 'dea',
		'でぃ': 'dei',
		'でゅ': 'deu',
		'でぇ': 'dee',
		'でょ': 'deo',
		'どぅ': 'dou',
		'ふぁ': 'hua',
		'ふぃ': 'hui',
		'ふぇ': 'hue',
		'ふぉ': 'huo',
		'ふゃ': 'huya',
		'ふゅ': 'huyu',
		'ふょ': 'huyo',
		'ほぅ': 'hu',
		'ら゚': 'la',
		'り゚': 'li',
		'る゚': 'lu',
		'れ゚': 'le',
		'ろ゚': 'lo',
		'わ゙': 'va',
		'ゐ゙': 'vi',
		'ゑ゙': 've',
		'を゙': 'vo',
		'ぁ': 'a',
		'ぃ': 'i',
		'ぅ': 'u',
		'ぇ': 'e',
		'ぉ': 'o',
		'ゃ': 'ya',
		'ゅ': 'yu',
		'ょ': 'yo',
		'っ': 'tu',
		'ゎ': 'wa',
		'ヵ': 'ka',
		'ヶ': 'ke',
	};

	japanese.romanizePuncutuationTable = {
		'。': '.',
		'、': ',',
		'・': '-',
		'－': '-',
		'「': '“',
		'」': '”',
		'（': '(',
		'）': ')',
		'　': ' ',
		' ': ' ',
	};

	japanese.defaultRomanizationConfig = {
		'し': 'shi',
		'ち': 'chi',
		'つ': 'tsu',
		'ふ': 'fu',
		'じ': 'ji',
		'ぢ': 'ji',
		'づ': 'zu',
		'ああ': 'aa',
		'いい': 'ii',
		'うう': 'ū',
		'ええ': 'ee',
		'おお': 'ō',
		'あー': 'ā',
		'えい': 'ei',
		'おう': 'ō',
		'んあ': 'n\'a',
		'んば': 'nba',
		'っち': 'tchi',
		'ゐ': 'i',
		'を': 'o',
		punctuation: true,
	};

	japanese.romanizationConfigs = {
		wikipedia: {},
		'traditional hepburn': {
			'を': 'wo',
			'んあ': 'n-a',
			'んば': 'mba',
		},
		'modified hepburn': {
			'ああ': 'ā',
			'いい': 'ii',
			'うう': 'ū',
			'ええ': 'ē',
			'おお': 'ō',
		},
		kunrei: {
			'し': 'si',
			'ち': 'ti',
			'つ': 'tu',
			'ふ': 'hu',
			'じ': 'zi',
			'ぢ': 'zi',
			'づ': 'zu',
			'ああ': 'â',
			'いい': 'î',
			'うう': 'û',
			'ええ': 'ê',
			'おお': 'ô',
			'あー': 'â',
			'おう': 'ô',
			'っち': 'tti',
		},
		nihon: {
			'し': 'si',
			'ち': 'ti',
			'つ': 'tu',
			'ふ': 'hu',
			'じ': 'zi',
			'ぢ': 'di',
			'づ': 'du',
			'ああ': 'ā',
			'いい': 'ī',
			'うう': 'ū',
			'ええ': 'ē',
			'おお': 'ō',
			'あー': 'ā',
			'おう': 'ō',
			'っち': 'tti',
			'ゐ': 'wi',
			'を': 'wo',
		},
	};



	japanese.romanize = function (string, config) {
		if (typeof config === 'undefined') {
			config = 'wikipedia';
		}

		if (typeof config === 'string') {
			config = japanese.romanizationConfigs[config];

			if (typeof config === 'undefined') {
				throw new ReferenceError('Romanization method "' + config + '" is undefined');
			}
		}

		if (typeof config === 'object') {
			config = extend({}, japanese.defaultRomanizationConfig, config);
		} else {
			throw new Error('You specified unknown config to japanese.romanize');
		}

		var table = extend({}, japanese.romanizationTable);

		if (config['し'] === 'shi') {
			extend(table, {
				'し': 'shi',
				'しゃ': 'sha',
				'しゅ': 'shu',
				'しぇ': 'she',
				'しょ': 'sho',
			});
		}

		if (config['ち'] === 'chi') {
			extend(table, {
				'ち': 'chi',
				'ちゃ': 'cha',
				'ちゅ': 'chu',
				'ちぇ': 'che',
				'ちょ': 'cho',
				'てぃ': 'ti',
				'てゅ': 'tyu',
			});
		}

		if (config['つ'] === 'tsu') {
			extend(table, {
				'つ': 'tsu',
				'つぁ': 'tsa',
				'つぃ': 'tsi',
				'つぇ': 'tse',
				'つぉ': 'tso',
				'つゅ': 'tsyu',
				'とぅ': 'tu',
			});
		}

		if (config['ふ'] === 'fu') {
			extend(table, {
				'ふ': 'fu',
				'ふぁ': 'fa',
				'ふぃ': 'fi',
				'ふぇ': 'fe',
				'ふぉ': 'fo',
				'ふゃ': 'fya',
				'ふゅ': 'fyu',
				'ふょ': 'fyo',
			});
		}

		if (config['じ'] === 'ji') {
			extend(table, {
				'じ': 'ji',
				'じゃ': 'ja',
				'じゅ': 'ju',
				'じぇ': 'je',
				'じょ': 'jo',
			});
		}

		if (config['ぢ'] === 'ji') {
			extend(table, {
				'ぢ': 'ji',
				'ぢゃ': 'ja',
				'ぢゅ': 'ju',
				'ぢぇ': 'je',
				'ぢょ': 'jo',
				'でぃ': 'di',
				'でゅ': 'dyu',
			});
		}

		if (config['ぢ'] === 'zi') {
			extend(table, {
				'ぢ': 'zi',
				'ぢゃ': 'zya',
				'ぢゅ': 'zyu',
				'ぢぇ': 'zye',
				'ぢょ': 'zyo',
				'でぃ': 'di',
				'でゅ': 'dyu',
			});
		}

		if (config['づ'] === 'zu') {
			extend(table, {
				'づ': 'zu',
				'づぁ': 'zua',
				'づぃ': 'zui',
				'づぇ': 'zue',
				'づぉ': 'zuo',
				'どぅ': 'du',
			});
		}

		if (config['ゐ'] === 'i') {
			extend(table, {
				'ゐ': 'i',
				'ゑ': 'e',
			});
		}

		if (config['を'] === 'o') {
			extend(table, {
				'を': 'o',
			});
		}

		string = japanese.hiraganize(string);

		var dest = '';
		var previousToken = '';

		while (string.length > 0) {
			var token = '';

			// assuming we have only one or two letter token in table
			if (table[string.slice(0, 2)]) {
				token = string.slice(0, 2);
				string = string.slice(2);
			} else {
				token = string[0];
				string = string.slice(1);
			}

			// handle small tsu
			if (token === 'っ') {
				previousToken = token;
				continue;
			}

			var tokenDest = table[token] || '';

			// small tsu
			if (previousToken === 'っ') {
				if (tokenDest.match(/^[^aiueo]/)) {
					if (token[0] === 'ち') {
						if (config['っち'] === 'tchi') {
							tokenDest = {
								'ち': 'tchi',
								'ちゃ': 'tcha',
								'ちゅ': 'tchu',
								'ちぇ': 'tche',
								'ちょ': 'tcho',
							}[token];
						} else if (config['っち'] === 'cchi') {
							tokenDest = {
								'ち': 'cchi',
								'ちゃ': 'ccha',
								'ちゅ': 'cchu',
								'ちぇ': 'cche',
								'ちょ': 'ccho',
							}[token];
						} else { // normally 'tti'
							tokenDest = {
								'ち': 'tti',
								'ちゃ': 'ttya',
								'ちゅ': 'ttyu',
								'ちぇ': 'ttye',
								'ちょ': 'ttyo',
							}[token];
						}
					} else {
						tokenDest = tokenDest[0] + tokenDest;
					}
				} else {
					/*
					 * Some article claims that "ローマ字教育の指針(文部科学省)" defines that
					 * strings ending with "っ" must be represented with trailing apostrophe
					 * though I couldn't confirm.
					 */
					dest += '\'';
				}
			}

			// long vowel
			if (token === 'ー') {
				if (dest.match(/[aiueo]$/)) {
					if (config['あー'] === 'a') {
						// nope
					} else if (config['あー'] === 'ah') {
						dest += 'h';
					} else if (config['あー'] === 'a-') {
						dest += '-';
					} else if (config['あー'] === 'aa') {
						dest = dest.slice(0, -1) + {
							'a': 'aa',
							'i': 'ii',
							'u': 'uu',
							'e': 'ee',
							'o': 'oo',
						}[dest.slice(-1)];
					} else if (config['あー'] === 'â') {
						dest = dest.slice(0, -1) + {
							'a': 'â',
							'i': 'î',
							'u': 'û',
							'e': 'ê',
							'o': 'ô',
						}[dest.slice(-1)];
					} else if (config['あー'] === 'ā') {
						dest = dest.slice(0, -1) + {
							'a': 'ā',
							'i': 'ī',
							'u': 'ū',
							'e': 'ē',
							'o': 'ō',
						}[dest.slice(-1)];
					}

					tokenDest = '';
				} else {
					tokenDest = '-';
				}
			} else if (dest.slice(-1) === 'e' && tokenDest[0] === 'i') {
				tokenDest = tokenDest.slice(1);

				if (config['えい'] === 'ei') {
					dest += 'i';
				} else if (config['えい'] === 'ee') {
					dest += 'e';
				} else if (config['えい'] === 'eh') {
					dest += 'h';
				} else if (config['えい'] === 'ê') {
					dest = dest.slice(0, -1) + 'ê';
				} else if (config['えい'] === 'ē') {
					dest = dest.slice(0, -1) + 'ē';
				} else if (config['えい'] === 'e') {
					// nope
				}
			} else if (dest.slice(-1) === 'o' && tokenDest[0] === 'u') {
				tokenDest = tokenDest.slice(1);

				if (config['おう'] === 'ou') {
					dest += 'u';
				} else if (config['おう'] === 'oo') {
					dest += 'o';
				} else if (config['おう'] === 'oh') {
					dest += 'h';
				} else if (config['おう'] === 'ô') {
					dest = dest.slice(0, -1) + 'ô';
				} else if (config['おう'] === 'ō') {
					dest = dest.slice(0, -1) + 'ō';
				} else if (config['おう'] === 'o') {
					// nope
				}
			} else if (dest.match(/[aiueo]$/) && dest.slice(-1) === tokenDest[0] && token !== 'を') {
				tokenDest = tokenDest.slice(1);

				dest = dest.slice(0, -1) + config[{
					'a': 'ああ',
					'i': 'いい',
					'u': 'うう',
					'e': 'ええ',
					'o': 'おお',
				}[dest.slice(-1)]];
			}

			// んば
			if (tokenDest.match(/^[bpm]/) && previousToken === 'ん') {
				if (config['んば'] === 'nba') {
					// nope
				} else if (config['んば'] === 'mba') {
					dest = dest.slice(0, -1) + 'm';
				}
			}

			// んあ
			if (tokenDest.match(/^[aiueoy]/) && previousToken === 'ん') {
				if (config['んあ'] === 'na') {
					// nope
				} else if (config['んあ'] === 'n\'a') {
					tokenDest = '\'' + tokenDest;
				} else if (config['んあ'] === 'n-a') {
					tokenDest = '-' + tokenDest;
				}
			}

			if (config.punctuation && japanese.romanizePuncutuationTable[token]) {
				tokenDest = japanese.romanizePuncutuationTable[token];
			}

			dest += tokenDest;

			previousToken = token;
		}

		if (previousToken === 'っ') {
			dest += '\'';
		}

		return dest;
	};
};

},{"extend":2}],6:[function(require,module,exports){
(function(window) {
	var HAS_HASHCHANGE = (function() {
		var doc_mode = window.documentMode;
		return ('onhashchange' in window) &&
			(doc_mode === undefined || doc_mode > 7);
	})();

	L.Hash = function(map) {
		this.onHashChange = L.Util.bind(this.onHashChange, this);

		if (map) {
			this.init(map);
		}
	};

	L.Hash.parseHash = function(hash) {
		if(hash.indexOf('#') === 0) {
			hash = hash.substr(1);
		}
		var args = hash.split("/");
		if (args.length == 3) {
			var zoom = parseInt(args[0], 10),
			lat = parseFloat(args[1]),
			lon = parseFloat(args[2]);
			if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
				return false;
			} else {
				return {
					center: new L.LatLng(lat, lon),
					zoom: zoom
				};
			}
		} else {
			return false;
		}
	};

	L.Hash.formatHash = function(map) {
		var center = map.getCenter(),
		    zoom = map.getZoom(),
		    precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));

		return "#" + [zoom,
			center.lat.toFixed(precision),
			center.lng.toFixed(precision)
		].join("/");
	},

	L.Hash.prototype = {
		map: null,
		lastHash: null,

		parseHash: L.Hash.parseHash,
		formatHash: L.Hash.formatHash,

		init: function(map) {
			this.map = map;

			// reset the hash
			this.lastHash = null;
			this.onHashChange();

			if (!this.isListening) {
				this.startListening();
			}
		},

		removeFrom: function(map) {
			if (this.changeTimeout) {
				clearTimeout(this.changeTimeout);
			}

			if (this.isListening) {
				this.stopListening();
			}

			this.map = null;
		},

		onMapMove: function() {
			// bail if we're moving the map (updating from a hash),
			// or if the map is not yet loaded

			if (this.movingMap || !this.map._loaded) {
				return false;
			}

			var hash = this.formatHash(this.map);
			if (this.lastHash != hash) {
				location.replace(hash);
				this.lastHash = hash;
			}
		},

		movingMap: false,
		update: function() {
			var hash = location.hash;
			if (hash === this.lastHash) {
				return;
			}
			var parsed = this.parseHash(hash);
			if (parsed) {
				this.movingMap = true;

				this.map.setView(parsed.center, parsed.zoom);

				this.movingMap = false;
			} else {
				this.onMapMove(this.map);
			}
		},

		// defer hash change updates every 100ms
		changeDefer: 100,
		changeTimeout: null,
		onHashChange: function() {
			// throttle calls to update() so that they only happen every
			// `changeDefer` ms
			if (!this.changeTimeout) {
				var that = this;
				this.changeTimeout = setTimeout(function() {
					that.update();
					that.changeTimeout = null;
				}, this.changeDefer);
			}
		},

		isListening: false,
		hashChangeInterval: null,
		startListening: function() {
			this.map.on("moveend", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.addListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
				this.hashChangeInterval = setInterval(this.onHashChange, 50);
			}
			this.isListening = true;
		},

		stopListening: function() {
			this.map.off("moveend", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
			}
			this.isListening = false;
		}
	};
	L.hash = function(map) {
		return new L.Hash(map);
	};
	L.Map.prototype.addHash = function() {
		this._hash = L.hash(this);
	};
	L.Map.prototype.removeHash = function() {
		this._hash.removeFrom();
	};
})(window);

},{}],7:[function(require,module,exports){
(function() {

  L.Control.Elevation = L.Control.extend({
    options : {
      position : 'bottomleft'
    },
    initialize : function(options) {
      L.Util.setOptions(this, options);
    },
    onAdd : function(map) {
      this._container = L.DomUtil.create('div', 'leaflet-control-attribution');
      this._container.innerHTML = "LatLng(####,####)";
      map.on("mousemove", this.update, this);
      return this._container;
    },
    update : function(event) {
      this._container.innerHTML = event.latlng.toString();
    }
  });

  L.control.elevation = function(options) {
    return new L.Control.Elevation(options);
  };

})();
},{}],8:[function(require,module,exports){
(function() {

  L.Control.Layers.Search = L.Control.Layers.extend({
    onAdd : function(map) {
      location.search.replace("?", "").split("/").forEach(function(key) {
        for ( var a in this._layers) {
          var b = this._layers[a];
          if (b.name === key)
            b.layer.addTo(map);
        }
      }, this);
      map.on("layeradd layerremove", this._save, this);
      return L.Control.Layers.prototype.onAdd.call(this, map);
    },
    onRemove : function(map) {
      map.off("layeradd layerremove", this._save, this);
      L.Control.Layers.prototype.onRemove.call(this, map);
    },
    _save : function() {
      var x = [];
      for ( var a in this._layers) {
        var b = this._layers[a];
        if (this._map.hasLayer(b.layer))
          x.push(b.name);
      }
      if (x.length > 0)
        history.replaceState(null, "", "?" + x.join("/") + location.hash);
    }
  });

  L.control.layers.search = function(baseLayers, overlays, options) {
    return new L.Control.Layers.Search(baseLayers, overlays, options);
  };

})();
},{}],9:[function(require,module,exports){
(function() {

  var cache = {};
  var ajax = function(url) {
    if (!cache[url])
      cache[url] = new Promise(function(resolve, reject) {
        var x = new XMLHttpRequest();
        x.onreadystatechange = function() {
          if (x.readyState == 4)
            resolve(x.status == 200 ? x.responseText : null);
        };
        x.open("get", url, true);
        x.send();
      });
    return cache[url];
  };

  L.TileLayer.GeoJSON = L.LayerGroup.extend({
    options : {
      minZoom : 16,
      maxZoom : 16,
      zoom : 16
    },
    initialize : function(tmpl, options, geojson2layers) {
      L.Util.setOptions(this, options);
      this._tmpl = tmpl;
      this._geojson2layers = geojson2layers;
      L.LayerGroup.prototype.initialize.call(this);
    },
    onAdd : function(map) {
      L.LayerGroup.prototype.onAdd.call(this, map);
      this.update();
    },
    onRemove : function(map) {
      L.LayerGroup.prototype.onRemove.call(this, map);
    },
    getEvents : function() {
      return {
        "moveend" : this.update,
        "zoomend" : this.update
      };
    },

    update : function(event) {

      var map = this._map;
      var opt = this.options;
      var geojson2layers = this._geojson2layers;

      if (map.getZoom() > opt.maxZoom || map.getZoom() < opt.minZoom) {
        this.clearLayers();
        return;
      }

      var zoom = opt.zoom;
      var box = map.getBounds();
      var sw = map.project(box.getSouthWest(), zoom - 8).floor();
      var ne = map.project(box.getNorthEast(), zoom - 8).ceil();
      var coords = [];
      for (var y = ne.y - 1; y <= sw.y; y++) {
        for (var x = sw.x; x < ne.x; x++) {
          var coord = L.point(x, y);
          coord.z = zoom;
          coords.push(coord);
        }
      }

      var layers = {};
      for ( var key in this._layers) {
        var layer = this._layers[key];
        layers[layer.coords] = layer;
      }

      coords.forEach(function(c) {
        var key = c.toString();
        if (layers[key]) {
          delete layers[key];
          return;
        }

        var layer = L.layerGroup();
        this.addLayer(layer);
        layer.coords = key;

        var that = this;
        ajax(L.Util.template(that._tmpl, L.extend(c, opt))).then(function(txt) {
          var json = JSON.parse(txt);
          if (!json)
            return;
          geojson2layers(json).forEach(function(a) {
            layer.addLayer(a);
          });
        });

      }, this);

      for ( var key in layers) {
        this.removeLayer(layers[key]);
      }
    }
  });

  L.tileLayer.geoJson = function(tmpl, options, geojson2layers) {
    return new L.TileLayer.GeoJSON(tmpl, options, geojson2layers);
  };

})();
},{}],10:[function(require,module,exports){
require('./leaflet-control-elevation.js');
require('./leaflet-control-layers-search.js');
require('./leaflet-tilelayer-geojson.js');
var japanese = require('japanese');
require('leaflet-hash');

(function(window) {

  if (!location.search || location.search == "")
    history.replaceState(null, "", "?ortho" + location.hash);
  if (!location.hash || location.hash == "")
    history.replaceState(null, "", location.search + "#15/35.6707/139.7852");

  var tmpl = "http://cyberjapandata.gsi.go.jp/xyz/{id}/{z}/{x}/{y}.{extension}";
  var baseLayers = {};
  var overlays = {};

  baseLayers["ortho"] = L.tileLayer(tmpl, {
    id: "ort",
    extension: "jpg"
  });

  baseLayers["default"] = L.tileLayer(tmpl, {
    id: "std",
    extension: "png"
  });

  baseLayers["relief"] = L.tileLayer(tmpl, {
    minZoom: 5,
    maxNativeZoom: 15,
    maxZoom: 17,
    id: "relief",
    extension: "png"
  });

  overlays["river"] = L.tileLayer.geoJson(tmpl, {
    zoom: 16,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_rvrcl",
    extension: "geojson"
  }, function(json) {
    return [L.geoJson(json, {
      className: "geojson-rvrcl"
    }), L.geoJson(json, {
      className: "geojson-rvrcl-shadow",
      pane: "tilePane"
    })];
  });

  overlays["road"] = L.tileLayer.geoJson(tmpl, {
    zoom: 16,
    maxZoom: 20,
    minZoom: 16,
    id: "experimental_rdcl",
    extension: "geojson"
  }, function(json) {
    return [L.geoJson(json, {
      className: "geojson-rdcl"
    }), L.geoJson(json, {
      className: "geojson-rdcl-shadow",
      pane: "tilePane"
    })];
  });

  overlays["railway"] = L.tileLayer.geoJson(tmpl, {
    zoom: 16,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_railcl",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      if (b.properties.snglDbl == "駅部分") {
        a.push(L.geoJson(b, {
          className: "geojson-railcl-eki"
        }));
        a.push(L.geoJson(b, {
          className: "geojson-railcl-eki-shadow",
          pane: "tilePane"
        }));
      } else if (b.properties.type == "普通鉄道（ＪＲ）") {
        a.push(L.geoJson(b, {
          className: "geojson-railcl-jr"
        }));
        a.push(L.geoJson(b, {
          className: "geojson-railcl-jr-shadow",
          pane: "tilePane"
        }));
      } else {
        a.push(L.geoJson(b, {
          className: "geojson-railcl"
        }));
        a.push(L.geoJson(b, {
          className: "geojson-railcl-shadow",
          pane: "tilePane"
        }));
      }
    });
    return a;
  });

  overlays["anno-ja"] = L.tileLayer.geoJson(tmpl, {
    zoom: 15,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_anno",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      a.push(L.marker(L.GeoJSON.coordsToLatLng(b.geometry.coordinates), {
        icon: L.divIcon({
          className: "geojson-anno",
          html: b.properties.knj
        })
      }));
    });
    return a;
  });

  overlays["anno-kana"] = L.tileLayer.geoJson(tmpl, {
    zoom: 15,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_anno",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      a.push(L.marker(L.GeoJSON.coordsToLatLng(b.geometry.coordinates), {
        icon: L.divIcon({
          className: "geojson-anno",
          html: b.properties.kana
        })
      }));
    });
    return a;
  });

  overlays["anno-en"] = L.tileLayer.geoJson(tmpl, {
    zoom: 15,
    maxZoom: 20,
    minZoom: 14,
    id: "experimental_anno",
    extension: "geojson"
  }, function(json) {
    var a = [];
    json.features.forEach(function(b) {
      a.push(L.marker(L.GeoJSON.coordsToLatLng(b.geometry.coordinates), {
        icon: L.divIcon({
          className: "geojson-anno",
          html: japanese.romanize(b.properties.kana)
        })
      }));
    });
    return a;
  });

  var map = L.map("map", L.extend({
    maxZoom: 20,
    minZoom: 8
  }, L.Hash.parseHash(location.hash)));
  map.zoomControl.setPosition("bottomright");
  map.attributionControl.addAttribution("<a href='http://maps.gsi.go.jp/development/'>地理院タイル</a>");

  L.hash(map);
  L.control.layers.search(baseLayers, overlays).addTo(map);
  L.control.elevation().addTo(map);

})(window);
},{"./leaflet-control-elevation.js":7,"./leaflet-control-layers-search.js":8,"./leaflet-tilelayer-geojson.js":9,"japanese":1,"leaflet-hash":6}]},{},[10]);
