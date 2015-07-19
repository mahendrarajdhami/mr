/* ------------------------------------------------------ */
/* Updated: 2015/03 */
/* ------------------------------------------------------ */

// デバイス
var device = {
	ua: navigator.userAgent,
	win: function(ver) { if (this.ua.indexOf('Windows')!==-1) { if (ver===undefined) { return true; } else { if ((ver==='8'&&this.ua.indexOf('NT 6.2')!==-1) || (ver==='7'&&this.ua.indexOf('NT 6.1')!==-1) || (ver==='vista'&&this.ua.indexOf('NT 6.0')!==-1) || (ver==='xp'&&this.ua.indexOf('NT 5.1')!==-1)) { return true; } else { return false; } } } else { return false; } },
	mac: function() { if (this.ua.indexOf('Macintosh')!==-1) { return true; } else { return false; } },
	pc: function() { if (this.win() || this.mac()) { return true; } else { return false; } },
	ipad: function(ver) { if (this.ua.indexOf('iPad')!==-1) { if (ver===undefined) { return true; } else { var ver_2 = ver.split('.').join('_'); if (this.ua.indexOf('OS '+ver_2)!==-1) { return true; } else { return false; } } } else { return false; } },
	andtb: function(ver) { if (this.ua.indexOf('Android')!==-1 && this.ua.indexOf('Mobile')===-1) { if (ver===undefined) { return true; } else { if (this.ua.indexOf('Android '+ver)!==-1) { return true; } else { return false; } } } else { return false; } },
	tb: function() { if (this.ipad() || this.andtb()) { return true; } else { return false; } },
	iphone: function(ver) { if (this.ua.indexOf('iPhone')!==-1) { if (ver===undefined) { return true; } else { var ver_2 = ver.split('.').join('_'); if (this.ua.indexOf('iPhone OS '+ver_2)!==-1) { return true; } else { return false; } } } else { return false; } },
	android: function(ver) { if (this.ua.indexOf('Android')!==-1 && this.ua.indexOf('Mobile')!==-1) { if (ver===undefined) { return true; } else { if (this.ua.indexOf('Android '+ver)!==-1) { return true; } else { return false; } } } else { return false; } },
	sp: function() { if (this.iphone() || this.android()) { return true; } else { return false; } }
};

// ブラウザ
var browser = {
	ua: navigator.userAgent,
	ie: function(ver) { if (this.ua.indexOf('MSIE')!==-1) { if (ver===undefined) { return true; } else { if (this.ua.indexOf('MSIE '+ver)!==-1) { return true; } else { return false; } } } else if (this.ua.indexOf('Trident')!==-1) { if (ver===undefined) { return true; } else { if (this.ua.indexOf('rv:'+ver)!==-1) { return true; } else { return false; } } } else { return false; } },
	ff: function() { if (this.ua.indexOf('Firefox')!==-1) { return true; } else { return false; } },
	safari: function() { if (this.ua.indexOf('Safari')!==-1 && this.ua.indexOf('Chrome')===-1) { return true; } else { return false; } },
	chrome: function() { if (this.ua.indexOf('Safari')!==-1 && this.ua.indexOf('Chrome')!==-1) { return true; } else { return false; } }
};

// メタ、CSS、JS
if (device.sp()) {
	document.write(
		'<meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">'+
		'<link rel="stylesheet" href="css/sp-common.css" media="all">'+
		'<script src="js/sp-common.js"></script>'
	);
} else {
	document.write(
		'<meta name="viewport" content="width=984">'+
		'<link rel="stylesheet" href="css/pc-common.css" media="all">'+
		'<script src="js/pc-common.js"></script>'
	);
}





/* ------------------------------------------------------ */
/* End */
/* ------------------------------------------------------ */
