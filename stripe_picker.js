var ScarfStripePicker = function(evt) {
	this.version = '0.0.2';
	this.about = 'Scarf Stripe Picker version '+this.version
				+' copyright 2017 by Sean Gleeson seangleeson.com';
	var GU, E = this;
	this.GU = function() {
		var GU = this;
		this.attributes = function() {
			this.add = function(elmt, attr, val) {
				if (!GU.att.has(elmt, attr, val)) {
					GU.att.set(elmt, attr, GU.att.get(elmt, attr)+' '+val);
				}
			};
			this.get = function(elmt, attr) {
				return elmt.getAttribute(attr);
			};
			this.getall = function(elmt, attr) {
				return GU.att.get(elmt, attr).split(' ');
			};
			this.has = function(elmt, attr, val) {
				var cv = GU.att.get(elmt, attr);
				if (!cv) return false;
				return (cv.split(' ').indexOf(val) > -1);
			};
			this.rm = function(elmt, attr) {
				elmt.removeAttribute(attr);
			};
			this.set = function(elmt, attr, val) {
				if (val == undefined) val = '';
				elmt.setAttributeNS(null, attr, String(val));
			};
			this.setall = function(elmt, attr, vals) {
				GU.att.set(elmt, attr, vals.join(' '));
			};
		};
		this.classes = function() {
			this.add = function(elmt, c) {
				GU.att.add(elmt, 'class', c);
			};
			this.get = function(elmt) {
				return GU.att.get(elmt, 'class');
			};
			this.getall = function(elmt) {
				return GU.att.getall(elmt, 'class');
			};
			this.has = function(elmt, c) {
				return GU.att.has(elmt, 'class', c);
			};
			this.rm = function(elmt, c) {
				if (c == undefined) {
					GU.att.rm(elmt, 'class');
					return;
				}				
				var cs = GU.cl.getall(elmt);
				var i = cs.indexOf(c);
				if (i > -1) {
					cs.splice(i, 1);
					if (cs.length) {
						GU.cl.set(elmt, cs.join(' '));
					} else {
						GU.att.rm(elmt, 'class');
					}
				}
			};
			this.set = function(elmt, val) {
				GU.att.set(elmt, 'class', val);
			};
			this.setall = function(elmt, vals) {
				GU.att.setall(elmt, 'class', vals);
			};
		};
		this.cookies = function() {
			this.get = function(k) {
				var cookies = GU.ck.getall();
				if (cookies[k] == undefined) return false;
				return cookies[k];
			};
			this.getall = function() {
				var cookies, cks, i, ck, kv, k, v;
				cookies = {};
				cks = document.cookie.split(';');
				for(i = 0; i < cks.length; i++) {
					ck = cks[i];
					while (ck.charAt(0) == ' ') {
						ck = ck.substring(1);
					}
					kv = ck.split('=');
					k = decodeURIComponent(kv[0]);
					v = decodeURIComponent(kv[1]);
					cookies[k] = v;
				}
				return cookies;
			};
			this.set = function(k, v, expdays, domain, path) {
				var ckstr, d = new Date();
				if (expdays == undefined) expdays = 180;
				if (domain == undefined) domain = '';
				if (path == undefined) path = '/';
				k = encodeURIComponent(k);
				v = encodeURIComponent(v);
				d.setTime(d.getTime()+expdays*24*60*60*1000);
				ckstr = k+'='+v+';expires='+d.toUTCString();
				if (domain) {
					ckstr += ';domain='+encodeURIComponent(domain);
				}
				ckstr += ';path='+path;
				document.cookie = ckstr;
			};
		};
		this.matrices = function() {
			var mx = this;
			this.ed = function(elmt, edits) {
				var m = GU.mx.get(elmt);
				if (edits.a != undefined) m.a = parseFloat(edits.a);
				if (edits.b != undefined) m.b = parseFloat(edits.b);
				if (edits.c != undefined) m.c = parseFloat(edits.c);
				if (edits.d != undefined) m.d = parseFloat(edits.d);
				if (edits.e != undefined) m.e = parseFloat(edits.e);
				if (edits.f != undefined) m.f = parseFloat(edits.f);
				if (edits.tx != undefined) m.e = parseFloat(edits.tx);
				if (edits.ty != undefined) m.f = parseFloat(edits.ty);
				GU.mx.set(elmt, m);
			}
			this.get = function() {
				var s, a, t, m;
				if (arguments.length == 0) {
					return E.svg.createSVGMatrix();
				}
				if (arguments.length < 6) {
					a = arguments[0];
					if (a instanceof SVGMatrix) return a;
					if (a.transform != undefined) {
						if (a.transform.baseVal.length) {
							t = a.transform.baseVal.consolidate();
							return t.matrix;
						}
					}
					if (typeof a === 'string') {
						s = a.split(' ');
						if (s.length >= 6) {
							return (mx.get(s[0], s[1], s[2], s[3], s[4], s[5]));
						}
					}
					if (Array.isArray(a)) {
						if (a.length >= 6) {
							return (mx.get(a[0], a[1], a[2], a[3], a[4], a[5]));
						}
					}
				} else {
					m = E.svg.createSVGMatrix();
					m.a = parseFloat(arguments[0]);
					m.b = parseFloat(arguments[1]);
					m.c = parseFloat(arguments[2]);
					m.d = parseFloat(arguments[3]);
					m.e = parseFloat(arguments[4]);
					m.f = parseFloat(arguments[5]);
					return m;
				}
				return E.svg.createSVGMatrix();
			};
			this.set = function(elmt, m) {
				var t = E.svg.createSVGTransform();
				m = GU.mx.get(m);
				t.setMatrix(m);
				elmt.transform.baseVal.clear();
				elmt.transform.baseVal.appendItem(t);
			};
		};
		this.att = new this.attributes();
		this.ck = new this.cookies();
		this.cl = new this.classes();
		this.mx = new this.matrices();
	};
	this.Dial = function() {
		var D = this;
		this.indicateRow = function(r) {
			GU.mx.ed(D.scarf, {ty: 0-r*6});
		};
		this.onMouseDown = function(e) {
			e.preventDefault();
			D.beginswipeR = E.scarf.currentRow;
			D.beginswipeY = E.size.calcY(e)/6;
			D.hitarea.addEventListener('mousemove', D.pointerMove);
			D.hitarea.addEventListener('mouseout', D.pointerEnd);
			D.hitarea.addEventListener('mouseup', D.pointerEnd);
		};
		this.onTouchStart = function(e) {
			e.preventDefault();
			D.beginswipeR = E.scarf.currentRow;
			D.beginswipeY = E.size.calcY(e)/6;
			D.hitarea.addEventListener('touchmove', D.pointerMove);
			D.hitarea.addEventListener('touchcancel', D.pointerEnd);
			D.hitarea.addEventListener('touchend', D.pointerEnd);
		};
		this.onWheel = function(e) {
			e.preventDefault();
			E.scarf.plusRow(0-e.deltaY/2);
		};
		this.pointerEnd = function(e) {
			e.preventDefault();
			E.scarf.setRow(E.scarf.currentRow);
			D.hitarea.removeEventListener('mousemove', D.pointerMove);
			D.hitarea.removeEventListener('mouseout', D.pointerEnd);
			D.hitarea.removeEventListener('mouseup', D.pointerEnd);
			D.hitarea.removeEventListener('touchmove', D.pointerMove);
			D.hitarea.removeEventListener('touchcancel', D.pointerEnd);
			D.hitarea.removeEventListener('touchend', D.pointerEnd);
		};
		this.pointerMove = function(e) {
			e.preventDefault();
			var y = E.size.calcY(e)/6;
			var d = D.beginswipeY - y;
			var r = D.beginswipeR + d/2;
			E.scarf.setRow(r);
		};
		this.resize = function() {
			var areaheight = E.size.svgheight-426;
			var c = 226+areaheight/2;
			var y = 0-(areaheight-20)/12;
			var h = (areaheight-20)/6;
			GU.mx.ed(D.container, {ty: c});
			GU.att.set(D.hitarea, 'y', String(y));
			GU.att.set(D.hitarea, 'height', String(h));
		};
		this.beginswipeR = 0;
		this.beginswipeY = 0;
		this.container = E.svg.querySelector('.dial');
		this.scarf = this.container.querySelector('use');
		this.hitarea = this.container.querySelector('.hitarea');
		this.hitarea.addEventListener('touchstart', D.onTouchStart);
		this.hitarea.addEventListener('mousedown', D.onMouseDown);
		this.hitarea.addEventListener('wheel', D.onWheel);
	};
	this.Footer = function() {
		var F = this;
		this.resize = function() {
			GU.mx.ed(F.container, {ty: E.size.svgheight-200});
		};
		this.container = E.svg.querySelector('.footer');
		this.ridgesfield = this.container.querySelector('.ridges');
		this.rowsmsg = this.container.querySelector('.rows');
		this.submitbutton = this.container.querySelector('.button');
		this.hitarea = this.container.querySelector('.hitarea');
		this.hitarea.addEventListener('click', E.popup.show);
	};
	this.Header = function() {
		var H = this;
		this.container = E.svg.querySelector('.header');
	};
	this.Meter = function() {
		var M = this;
		this.indicateRow = function(r) {
			GU.mx.ed(M.pointer, {tx: r});
		};
		this.onMouseDown = function(e) {
			e.preventDefault();
			var calcX = E.size.calcX(e)*972/600;
			E.scarf.setRow(calcX-49);
			M.hitarea.addEventListener('mousemove', M.pointerMove);
			M.hitarea.addEventListener('mouseout', M.pointerEnd);
			M.hitarea.addEventListener('mouseup', M.pointerEnd);
		};
		this.onTouchStart = function(e) {
			e.preventDefault();
			var calcX = E.size.calcX(e)*972/600;
			E.scarf.setRow(calcX-49);
			M.hitarea.addEventListener('touchmove', M.pointerMove);
			M.hitarea.addEventListener('touchcancel', M.pointerEnd);
			M.hitarea.addEventListener('touchend', M.pointerEnd);
		};
		this.onWheel = function(e) {
			e.preventDefault();
			E.scarf.plusRow(0-2*e.deltaY);
		};
		this.pointerEnd = function(e) {
			e.preventDefault();
			var calcX = E.size.calcX(e)*972/600;
			E.scarf.setRow(calcX-49);
			M.hitarea.removeEventListener('touchmove', M.pointerMove);
			M.hitarea.removeEventListener('touchcancel', M.pointerEnd);
			M.hitarea.removeEventListener('touchend', M.pointerEnd);
			M.hitarea.removeEventListener('mousemove', M.pointerMove);
			M.hitarea.removeEventListener('mouseout', M.pointerEnd);
			M.hitarea.removeEventListener('mouseup', M.pointerEnd);
		};
		this.pointerMove = function(e) {
			e.preventDefault();
			var calcX = E.size.calcX(e)*972/600;
			E.scarf.setRow(calcX-49, true);
		};
		this.container = E.svg.querySelector('.meter');
		this.pointer = this.container.querySelector('.pointer');
		this.hitarea = this.container.querySelector('.hitarea');
		this.hitarea.addEventListener('touchstart', M.onTouchStart);
		this.hitarea.addEventListener('mousedown', M.onMouseDown);
		this.hitarea.addEventListener('wheel', M.onWheel);
	};
	this.Popup = function() {
		var P = this;
		this.depopulate = function() {
			var imgurl = 'https://www.seangleeson.com/apps/myscarf/blank.jpg';
			GU.att.set(P.link, 'href', imgurl);
			GU.att.set(P.image, 'src', imgurl);
		};
		this.populate = function() {
			var imgurl = 'https://www.seangleeson.com/apps/myscarf/img/who_scarf_';
			imgurl += String(E.scarf.currentRow)+'_rows.jpg';
			P.rowcount.innerHTML = String(E.scarf.currentRow);
			P.percent.innerHTML = String(Math.round(100*E.scarf.currentRow/874))+'%';
			GU.att.set(P.link, 'href', imgurl);
			GU.att.set(P.image, 'src', imgurl);
			GU.att.set(P.image, 'alt', String(E.scarf.currentRow)+' rows');
		};
		this.show = function(e) {
			P.populate();
			GU.cl.add(P.elmt, 'popped');
			GU.ck.set('whoscarfrow', E.scarf.currentRow);
		};
		this.hide = function(e) {
			GU.cl.rm(P.elmt, 'popped');
			P.depopulate();
		};
		this.elmt = E.svg.querySelector('.popup');
		this.closer = this.elmt.querySelector('.closer');
		this.rowcount = this.elmt.querySelector('b');
		this.percent = this.elmt.querySelectorAll('b')[1];
		this.link = this.elmt.querySelector('a');
		this.image = this.elmt.querySelector('img');
		this.closer.addEventListener('click', P.hide);
	};
	this.Scarf = function() {
		var S = this;
		this.plusRow = function(v, floating) {
			S.setRow(S.currentRow+v, floating);
		};
		this.setRow = function(r, floating) {
			var i, stripe, msg;
			if(!floating) r = Math.round(r);
			if (r < 0) r = 0;
			if (r > 874) r = 874;
			S.currentRow = r;
			E.meter.indicateRow(S.currentRow);
			E.dial.indicateRow(S.currentRow);
			i = 0;
			stripe = 0;
			while (r > S.striperows[i]) {
				r -= S.striperows[i];
				i++;
			}
			S.currentStripe = i;
			S.currentRidge = Math.floor(r/2);
			if (S.currentRow) {
				S.currentColor = S.colors[S.stripecolors[S.currentStripe]];
			} else {
				S.currentColor = 'white';
			}
			E.footer.ridgesfield.innerHTML = String(S.currentRidge);
			msg = 'You&#x2019;ve knit ';
			msg += String(Math.round(S.currentRow));
			msg += ' row'+(S.currentRow == 1 ? '' : 's')+(S.currentRow >= 874 ? '!' : '.');
			E.footer.rowsmsg.innerHTML = msg;
			GU.cl.set(E.footer.submitbutton, 'button '+S.currentColor);
		};
		this.currentRidge = 0;
		this.currentRow = 0;
		this.currentStripe = 0;
		this.currentColor = 'purple';
		this.colors = ['bronze','camel','gray','moss','purple','rust','yellow'];
		this.stripecolors = [4,1,0,6,5,4,2,3,6,1,5,0,4,3,6,2,5,1,4,3,2,6,5,
			4,0,1,2,5,6,3,4,1,0,2,5,4,1,6,3,5,2,6,0,4,1,2,5,6,1,4,0,5,4];
		this.striperows = [6,44,14,8,18,6,38,18,6,26,14,6,10,38,8,
			16,8,46,8,18,12,6,18,6,34,10,6,38,12,18,6,38,10,18,6,
			12,6,12,48,14,12,8,18,8,10,30,6,12,14,6,28,6,30];
	};
	this.Size = function(w, h) {
		var Z = this;
		this.calcX = function(e) {
			var x;
			if (e.changedTouches) e = e.changedTouches[0];
			if (Z.rendermargin) {
				return (e.screenX-window.screenX-Z.rendermargin)/Z.renderscale;
			}
			return (e.clientX)/Z.renderscale;
		};
		this.calcY = function(e) {
			var y;
			if (e.changedTouches) e = e.changedTouches[0];
			return (e.clientY)/Z.renderscale;
		};
		this.resize = function(e) {
			Z.windowwidth = window.innerWidth;
			Z.windowheight = window.innerHeight;
			Z.svgheight = Math.max(Z.masterheight, Math.round(Z.masterwidth*Z.windowheight/Z.windowwidth));
			Z.renderheight = Z.windowheight;
			Z.renderscale = Z.windowheight/Z.svgheight;
			Z.renderwidth = Z.svgwidth*Z.renderscale;
			if (Z.svgheight == 800) {
				Z.rendermargin = Math.round(50*(Z.windowwidth-Z.renderwidth))/100;
			} else {
				Z.rendermargin = 0;
			}
			GU.att.set(E.svg, 'viewBox', '0 0 '+String(Z.masterwidth)+' '+String(Z.svgheight));
			GU.att.set(E.bg, 'height', String(Z.svgheight));
			E.dial.resize();
			E.footer.resize();
		};
		this.masterwidth = w;
		this.masterheight = h;
		this.windowwidth = w;
		this.windowheight = h;
		this.svgwidth = w;
		this.svgheight = h;
		this.renderheight = h;
		this.renderscale = 1;
		this.renderwidth = w;
		this.rendermargin = 0;
	};
	GU = new this.GU();
	this.doc = window.document;
	this.svg = evt.currentTarget;
	this.ns = GU.att.get(this.svg, 'xmlns');
	this.hns = 'http://www.w3.org/1999/xhtml';
	this.bg = this.svg.querySelector('.bg');
	this.popup = new this.Popup();
	this.footer = new this.Footer();
	this.header = new this.Header();
	this.meter = new this.Meter();
	this.dial = new this.Dial();
	this.scarf = new this.Scarf();
	this.size = new this.Size(600, 800);
	this.onRow = Number(GU.ck.get('whoscarfrow'));
	this.scarf.setRow(this.onRow);
	this.size.resize();
	window.onresize = this.size.resize;
};