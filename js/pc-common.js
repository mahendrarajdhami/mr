/* ------------------------------------------------------ */
/* Updated: 2015/03 */
/* ------------------------------------------------------ */

// HTML5
var html5 = ['section', 'article', 'hgroup', 'header', 'footer', 'nav', 'aside', 'figure', 'mark', 'time', 'ruby', 'rt', 'rp'];
if (browser.ie('6') || browser.ie('7') || browser.ie('8')) { for (var i=0; i<=html5.length-1; i++) { document.createElement(html5[i]); } }

// イージング
$.extend($.easing, {
	yriEoc: function (x, t, b, c, d) { return c*((t=t/d-1)*t*t+1)+b; }
});

// グロナビ
var gnav = {
	dur: 200,
	start: function() {
		$('#header .global-nav dl dt a').mouseover(function() {
			var $dl = $(this).parent().parent();
			$dl.addClass('on');
			if ($dl.children('dd').length-1!==-1) {
				$dl.children('dd').stop().slideDown(gnav.dur, 'yriEoc');
			}
		});
		$('#header .global-nav dl').bind('mouseleave', function() {
			$(this).removeClass('on');
			if ($(this).children('dd').length-1!==-1) {
				$(this).children('dd').stop().slideUp(gnav.dur, 'yriEoc');
			}
		});
	}
};

// 画像ロード
var imgLoad = {
	run: function(el) {
		var img = new Image(), src = $(el).css('background-image');
		if (src!=='none') { img.src = src.slice(src.indexOf('(')+1, src.indexOf(')')).replace(/"/g, '').replace(/\.(gif|jpg|png)/g,'-'+$(el).attr('data-load')+'.$1'); }
	},
	start: function() {
		$(window).load(function() { $('[data-load]').each(function() { imgLoad.run(this); }); });
	}
};

// ページのGoogle+
var pageGplus = {
	start: function() {
		var url = encodeURIComponent(location.href);
		$('[rel="page-gplus"]').each(function() { $(this).attr({'href': 'https://plus.google.com/share?url='+url}); });
		$('[rel="page-gplus"]').click(function() {
			var left = (screen.width-600)/2, top = (screen.height-470)/2;
			window.open(this.href, 'gpluswindow', 'width=600, height=470, left='+left+', top='+top+', menubar=0, toolbar=0, location=1, status=0, resizable=1, scrollbars=1, personalbar=0');
			return false;
		});
	}
};

// ページのツイート
var pageTweet = {
	start: function() {
		var url = encodeURIComponent(location.href), title = encodeURIComponent(document.title);
		$('[rel="page-tweet"]').each(function() { $(this).attr({'href': 'http://twitter.com/share?url='+url+'&amp;text='+title}); });
		$('[rel="page-tweet"]').click(function() {
			var left = (screen.width-550)/2, top = (screen.height-420)/2;
			window.open(this.href, 'tweetwindow', 'width=550, height=420, left='+left+', top='+top+', menubar=0, toolbar=0, location=1, status=0, resizable=1, scrollbars=1, personalbar=0');
			return false;
		});
	}
};

// ツイッターのフォロー
var twitterFollow = {
	start: function() {
		$('[data-twitter-follow]').each(function() { $(this).attr({'href': 'https://twitter.com/intent/follow?screen_name='+$(this).attr('data-twitter-follow')}); });
		$('[data-twitter-follow]').click(function() {
			var left = (screen.width-550)/2, top = (screen.height-520)/2;
			window.open(this.href, 'followwindow', 'width=550, height=520, left='+left+', top='+top+', menubar=0, toolbar=0, location=1, status=0, resizable=1, scrollbars=1, personalbar=0');
			return false;
		});
	}
};

// ページのFacebook
var pageFb = {
	start: function() {
		$('[data-page-fb="true"]').html('<div class="fb-like" data-href="'+location.href+'" data-width="120" data-layout="button" data-action="like" data-show-faces="false" data-share="true"></div><script>_ga.trackFacebook();</script>');
	}
};

// ページトップへ
var returnTop = {
	fadeDur: 200,
	scrDur: 500,
	scr: function() { if (browser.ie() || browser.ff()) { return 'html'; } else { return 'body'; } },
	run: function(callback) {
		this.anim = true;
		$(this.scr()).animate({scrollTop: 0}, this.scrDur, 'yriEoc', function() { callback(); });
	},
	start: function() {
		$('[rel="return-top"]').click(function() {
			var st = $(returnTop.scr()).scrollTop();
			if (st!==0 && returnTop.anim!==true) {
				returnTop.run(function() {
					returnTop.anim = false;
					lazy.check();
				});
			}
			return false;
		});
		$(window).scroll(function() {
			var st = $(returnTop.scr()).scrollTop();
			if (st<=0 && returnTop.disp===true) {
				returnTop.disp = false;
				$('#return-top').stop().fadeOut(returnTop.fadeDur);
			} else if (st>0 && returnTop.disp!==true) {
				returnTop.disp = true;
				$('#return-top').stop().fadeIn(returnTop.fadeDur);
			}
		});
	}
};

// メインビジュアル
var mainVisual = {
	time: 4000,
	dur: 500,
	linkSet: function(n) {
		$('.main-visual .mv-link').attr({'href': $('.main-visual .mv-set:eq('+n+') .link').attr('href'), 'target': $('.main-visual .mv-set:eq('+n+') .link').attr('target')});
	},
	adjust: function() {
		var ww = $(window).width(), pw = (ww<1090) ? 1090 : ww;
		$('.main-visual .mv-in').css({'left': pw*this.cr*-1});
		$('.main-visual .mv-set').each(function(i) { $(this).css({'left': pw*i}); });
		if (ww<1366) { var h = 680, w = 1366; }
		else { var w = ww, h = ww*680/1366; }
		var l = (ww-w)/2, t = (680-h)/2;
		if (ww<1090) { l = -138; }
		$('.main-visual .mv-set .bg img').width(w).height(h).css({'left': l, 'top': t});
	},
	timeCheck: function() {
		clearTimeout(this.timer);
		if (this.anim!==true) {
			this.timer = setTimeout(function() {
				mainVisual.count++;
				if (mainVisual.count>=mainVisual.time/100) {
					mainVisual.count = 0;
					mainVisual.slide(1);
				} else {
					mainVisual.timeCheck();
				}
			}, 100);
		} else {
			this.count = 0;
		}
	},
	slide: function(next) {
		this.anim = true;
		var ww = $(window).width(), pw = (ww<1090) ? 1090 : ww;
		$('.main-visual .mv-pointer li.cr').removeClass('cr');
		if (this.cr+next===-1) {
			$('.main-visual .mv-set:last').css({'left': pw*-1});
			$('.main-visual .mv-pointer li:last').addClass('cr');
			mainVisual.linkSet(this.mx);
		} else if (this.cr+next===this.mx+1) {
			$('.main-visual .mv-set:first').css({'left': pw*(this.mx+1)});
			$('.main-visual .mv-pointer li:first').addClass('cr');
			mainVisual.linkSet(0);
		} else {
			if (this.two && this.cr+next>=2) { $('.main-visual .mv-pointer li:eq('+(this.cr+next-2)+')').addClass('cr'); }
			else { $('.main-visual .mv-pointer li:eq('+(this.cr+next)+')').addClass('cr'); }
			mainVisual.linkSet(this.cr+next);
		}
		$('.main-visual .mv-in').animate({'left': '+='+pw*next*-1+'px'}, this.dur, 'yriEoc', function() {
			$('.main-visual .mv-set').each(function(i) { $(this).css({'left': pw*i}); });
			if (mainVisual.cr+next===-1) {
				$('.main-visual .mv-in').css({'left': pw*mainVisual.mx*-1});
				mainVisual.cr = mainVisual.mx;
			} else if (mainVisual.cr+next===mainVisual.mx+1) {
				$('.main-visual .mv-in').css({'left': 0});
				mainVisual.cr = 0;
			} else {
				mainVisual.cr += next;
			}
			mainVisual.anim = false;
			if (mainVisual.mx>=1) { mainVisual.timeCheck(); }
		});
	},
	start: function() {
		this.mx = $('.main-visual .mv-set').length-1, this.cr = 0, this.count = 0;
		var pointer = '<li class="cr"><a href="javascript:void(0);"></a></li>';
		for (var i=1; i<=this.mx; i++) { pointer += '<li><a href="javascript:void(0);"></a></li>'; }
		if (this.mx>=1) {
			$('.main-visual').append(
				'<ul class="mv-pointer">'+pointer+'</ul>'+
				'<div class="mv-arrow prev"><a href="javascript:void(0);"><span class="bg"></span><span class="icon"></span></a></div>'+
				'<div class="mv-arrow next"><a href="javascript:void(0);"><span class="bg"></span><span class="icon"></span></a></div>'
			);
		}
		$('.main-visual .mv-set .bg img').each(function() { $(this).attr({'src': $(this).attr('data-pc-mv-img')}); });
		if (this.mx===1) {
			$('.main-visual .mv-in').append($('.main-visual .mv-in').html());
			this.two = true;
			this.mx = 3;
		}
		this.linkSet(0);
		this.adjust();
		$(window).resize(function() { mainVisual.adjust(); });
		$(window).load(function() {
			$('.main-visual .mv-arrow.prev a').click(function() {
				if (mainVisual.anim!==true) { mainVisual.slide(-1); }
				return false;
			});
			$('.main-visual .mv-arrow.next a').click(function() {
				if (mainVisual.anim!==true) { mainVisual.slide(1); }
				return false;
			});
			$('.main-visual ul.mv-pointer li a').click(function() {
				var idx = $('.main-visual ul.mv-pointer li').index($(this).parent());
				if (idx!==mainVisual.cr) { mainVisual.slide(idx-mainVisual.cr); }
				return false;
			});
			if (mainVisual.mx>=1) { mainVisual.timeCheck(); }
		});
	}
};

// ニュースラインアップ
var newsLineup = {
	imgAdjust: function($el, areaw, areah) {
		var imgw = $el.width(), imgh = $el.height();
		if (imgh/imgw>areah/areaw) { var w = areaw, h = imgh*areaw/imgw; } else { var h = areah, w = imgw*areah/imgh; }
		var l = (areaw-w)/2, t = (areah-h)/2;
		$el.width(w).height(h).css({'left': l, 'top': t});
	},
	txtAdjust: function($el) {
		var $p = $el.find('.nli-block2 .body .txt p');
		if ($p.height()>70) {
			$el.addClass('mark-show');
			while ($p.height()>70) { $p.find('.txt-body').text($p.find('.txt-body').text().slice(0, -1)); }
		}
	},
	tweetShow: function(callback) {
		var i = 0, mx = $('.news-lineup-item:not(.comment)').length-1;
		function run(i) {
			var $nli = $('.news-lineup-item:not(.comment):eq('+i+')'), ctgr = $nli.attr('data-nli-category'), id = $nli.attr('data-nli-id');
			$.ajax({
				data: {
					q: 'from:YamahaRacing_Id #yri_'+ctgr+'_'+id
				},  
				dataType: 'JSON',
				timeout: 30000,
				url: '/system_sns/getTweetByRestSearch.php',
				success: function(data){
					if (data.statuses.length-1!==-1) {
						$nli.find('.nli-block2 .body .txt p .txt-body').html(data.statuses[0].text);
						newsLineup.txtAdjust($nli);
					}
					i++;
					if(i<=mx) { run(i); } else { callback(); }
				}
			});
		}
		run(i);
	},
	comment: function(callback) {
		var $r_comments = $('.news-lineup-col3').eq(0), // ライダースコメント枠のフィルタリング
			tw_accounts = ['sigitpd063','imanuelpratna','99galanghendra'],
			i = 0;
		function setTopPageRidersComment(i){
			var $r_comment_block = $r_comments.find('.news-lineup-item').eq(i),
			tw_screen = tw_accounts[i],
			tw_img = "/images/img-yamaha-01.jpg"; // デフォルトの画像を設定しておく
			$.ajax({
				data: {
					screen_name: tw_accounts[i], 
					count: 1
				},  
				dataType: 'JSON',
				timeout: 30000,
				url: '/system_sns/getTweetByRest.php',
				success: function(data){
					var tw_txt = data[0].text;
					tw_txt = $('<div />').html(tw_txt).text(); // html encode
					tw_txt = '<span class="name">' + tw_screen + '&nbsp;/</span><span class="txt-body">' + tw_txt + '</span><span class="mark">...</span>';
					if(typeof data[0].entities.media == "object" && data[0].entities.media[0].type == "photo"){
						tw_img = data[0].entities.media[0].media_url;
					}
					$r_comment_block.find('.nli-block2 .txt p').html(tw_txt);
					newsLineup.txtAdjust($r_comment_block);
					$r_comment_block.find('.nli-block1 .img img').load(function() {
						newsLineup.imgAdjust($(this), 340, 290);
						// 次のアカウントの取得
						i++;
						if(i < tw_accounts.length){ setTopPageRidersComment(i); } else { callback(); }
					});
					$r_comment_block.find('.nli-block1 .img img').attr({'src':tw_img});
				}// 結果受信後の処理
			});
		}
		setTopPageRidersComment(i);
	},
	start: function() {
		this.comment(function() {
			newsLineup.tweetShow(function() {});
		});
	}
};

// レース結果
var raceResult = {
	start: function() {
		$('.race-result .rr-tab ul li a').click(function() {
			if (!$(this).parent().hasClass('cr')) {
				var $wrap = $(this).parents('.rr-wrap'), idx = $wrap.find('.rr-tab ul li').index($(this).parent());
				$wrap.find('.rr-tab ul .cr').removeClass('cr');
				$wrap.find('.rr-body .cr').removeClass('cr');
				$(this).parent().addClass('cr');
				$wrap.find('.rr-body .rr-set:eq('+idx+')').addClass('cr');
			}
			return false;
		});
	}
};

// ローカルドロップダウンナビ
var localDdNav = {
	dur: 200,
	start: function() {
		$('.local-dd-nav dl dt a').mouseover(function() {
			var $dl = $(this).parent().parent();
			$dl.addClass('on');
			if ($dl.children('dd').length-1!==-1) {
				$dl.children('dd').stop().slideDown(localDdNav.dur, 'yriEoc');
			}
		});
		$('.local-dd-nav dl').bind('mouseleave', function() {
			$(this).removeClass('on');
			if ($(this).children('dd').length-1!==-1) {
				$(this).children('dd').stop().slideUp(localDdNav.dur, 'yriEoc');
			}
		});
	}
};

// ニュースリスト
var newsList = {
	defNum: 5,
	moreNum: 5,
	commentMx: 20,
	hashDur: 500,
	filterDur: 300,
	detailDur: 400,
	scr: function() { if (browser.ie() || browser.ff()) { return 'html'; } else { return 'body'; } },
	detailShow: function($nls, callback) {
		this.anim = true;
		$nls.addClass('cr');
		$nls.find('.nls-detail').slideDown(this.detailDur, 'yriEoc', function() { callback(); });
	},
	detailHide: function($nls, callback) {
		this.anim = true;
		$nls.removeClass('cr');
		$nls.find('.nls-detail').slideUp(this.detailDur, 'yriEoc', function() { callback(); });
	},
	tweetShow: function($nls) {
		var ctgr = $nls.attr('data-nls-category'), id = $nls.attr('data-nls-id');
		$.ajax({
			data: {
				q: 'from:YamahaRacing_Id #yri_'+ctgr+'_'+id
			},  
			dataType: 'JSON',
			timeout: 30000,
			url: '/system_sns/getTweetByRestSearch.php',
			success: function(data){
				if (data.statuses.length-1!==-1) { $nls.find('.nls-block2 table td .txt p .txt-body').text(data.statuses[0].text); }
			}
		});
	},
	commentShow: function($nls, callback) {
		var ctgr = $nls.attr('data-nls-category'), id = $nls.attr('data-nls-id');
		$.ajax({
			data: {
				q: '#yri_'+ctgr+'_'+id
			},  
			dataType: 'JSON',
			timeout: 30000,
			url: '/system_sns/getTweetByRestSearch.php',
			success: function(data) {
				var mx1 = data.statuses.length-1, mx2 = -1, html = '';
				for (var i=0; i<=mx1; i++) {
					if (data.statuses[i].user.screen_name!=='YamahaRacing_Id') {
						mx2++;
						if (mx2===newsList.commentMx) {
							mx1 = i;
							break;
						}
					}
				}
				if (mx2===-1) {
					$nls.find('.nls-block4 .comment').addClass('no-comment').html('<div class="comment-in"><div class="no-comment-set"><div class="no-comment-set-bg"></div><p>There are no comments yet.</p></div></div>');
				} else {
					for (var i=0; i<=mx1; i++) {
						if (data.statuses[i].user.screen_name!=='YamahaRacing_Id') {
							html += 
								'<div class="comment-set">'+
									'<div class="head">'+
										'<div class="thumb">'+
											'<p><img src="'+data.statuses[i].user.profile_image_url+'" alt=""></p>'+
											'<div class="mask"></div>'+
										'</div>'+
										'<p class="name"><a href="https://twitter.com/'+data.statuses[i].user.screen_name+'" target="_blank">@'+data.statuses[i].user.screen_name+'</a></p>'+
									'</div>'+
									'<div class="body">'+
										'<p>'+data.statuses[i].text+'</p>'+
									'</div>'+
								'</div>';
						}
					}
					$nls.find('.nls-block4 .comment').html('<div class="custom-scroll"><div class="custom-scroll-in"><div class="custom-scroll-in2"><div class="comment-in">'+html+'</div></div></div></div>');
				}
				$nls.attr({'data-nls-opened': 'true'});
				if (mx2<=1) { $nls.find('.custom-scroll').addClass('not-cs'); }
				if (mx2===0 || mx2===1) { $nls.find('.comment').addClass('lt3'); }
				cscroll.run($nls.not('.not-cs').find('.custom-scroll'));
				callback();
			}
		});
	},
	start: function() {
		this.defNum--;
		this.moreNum--;
		this.commentMx--;
		$(window).load(function() {
			var hashId = location.hash;
			$('.news-list-set').hide().css({'visibility': 'visible'}).attr({'data-nls-seen': 'false'});
			$('.news-list').each(function() {
				$(this).find('.news-list-set').each(function() {
					var ctgr = $(this).attr('data-nls-category'), id = $(this).attr('data-nls-id'), hash = encodeURIComponent('yri_'+ctgr+'_'+id);
					$(this).find('.nls-block3 .btn a').attr({'href': 'http://twitter.com/share?hashtags='+hash});
				});
				$(this).find('.news-list-set .nls-block3 .btn a').click(function() {
					var left = (screen.width-550)/2, top = (screen.height-420)/2;
					window.open(this.href, 'tweetwindow', 'width=550, height=420, left='+left+', top='+top+', menubar=0, toolbar=0, location=1, status=0, resizable=1, scrollbars=1, personalbar=0');
					return false;
				});
				$(this).find('.news-list-set:lt('+(newsList.defNum+1)+')').each(function() { newsList.tweetShow($(this)); });
				$(this).find('.news-list-set:lt('+(newsList.defNum+1)+')').show().attr({'data-nls-seen': 'true'});
				var $hash = $(this).find('.news-list-set[data-nls-id="'+hashId.slice(6)+'"]');
				if (hashId.indexOf('#news-')===0 && $hash.length-1!==-1) {
					hashId = $(this).find('.news-list-set').index($hash);
					$(this).find('.news-list-set:lt('+(hashId+1)+')[data-nls-seen!="true"]').each(function() { newsList.tweetShow($(this)); });
					$(this).find('.news-list-set:lt('+(hashId+1)+')').show().attr({'data-nls-seen': 'true'});
					$hash.addClass('cr');
					$hash.find('.nls-detail').show();
					newsList.commentShow($hash, function() {
						setTimeout(function() {
							newsList.anim = true;
							var ot = Math.round($hash.offset().top), t = ot-$('#header .header-in').outerHeight();
							$(newsList.scr()).animate({scrollTop: t}, newsList.hashDur, 'yriEoc', function() {
								newsList.anim = false;
								lazy.check();
							});
						}, 500);
					});
				}
				if ($(this).find('.news-list-set:hidden').length-1===-1) { $(this).find('.cmn-more-wrap').hide(); }
			});
			$('.news-list .local-nav-in a').click(function() {
				if (!$(this).parent().hasClass('cr') && newsList.anim!==true) {
					newsList.anim = true;
					var id = $(this).attr('data-nls-filter'), $nl = $(this).parents('.news-list');
					$nl.find('.local-nav-in li.cr').removeClass('cr');
					$(this).parent().addClass('cr');
					$nl.find('.news-list-in').fadeOut(newsList.filterDur, function() {
						$nl.find('.news-list-set.cr .nls-detail').hide();
						$nl.find('.news-list-set.cr').removeClass('cr');
						$nl.find('.news-list-set').hide();
						if (id==='all') {
							var idx = $nl.find('.news-list-set').index($nl.find('.news-list-set[data-nls-seen="true"]:last'));
							$nl.find('.news-list-set:lt('+(idx+1)+')[data-nls-seen!="true"]').each(function() { newsList.tweetShow($(this)); });
							$nl.find('.news-list-set:lt('+(idx+1)+')').show().attr({'data-nls-seen': 'true'});
							if ($nl.find('.news-list-set[data-nls-seen="false"]').length-1===-1) { $nl.find('.cmn-more-wrap').hide(); }
							else { $nl.find('.cmn-more-wrap').show(); }
						} else {
							$nl.find('.news-list-set[data-nls-category="'+id+'"]:lt('+(newsList.defNum+1)+')[data-nls-seen!="true"]').each(function() { newsList.tweetShow($(this)); });
							$nl.find('.news-list-set[data-nls-category="'+id+'"]:lt('+(newsList.defNum+1)+')').show().attr({'data-nls-seen': 'true'});
							$nl.find('.news-list-set[data-nls-category="'+id+'"][data-nls-seen="true"]').show();
							if ($nl.find('.news-list-set[data-nls-category="'+id+'"][data-nls-seen="false"]').length-1===-1) { $nl.find('.cmn-more-wrap').hide(); }
							else { $nl.find('.cmn-more-wrap').show(); }
						}
						$(this).fadeIn(newsList.filterDur, function() {
							newsList.anim = false;
							lazy.check();
						});
					});
				}
				return false;
			});
			$('.news-list-set .nls-trap').bind('mouseover mouseout click', function(e) {
				var $nls = $(this).parent(), $nl = $nls.parent(), idx = $nl.children('.news-list-set:visible').index($nls);
				if (e.type==='mouseover') {
					$nls.addClass('on');
				} else if (e.type==='mouseout') {
					$nls.removeClass('on');
				} else if (e.type==='click') {
					if (newsList.anim!==true) {
						if ($('.news-list-set.cr').length-1!==-1) { newsList.detailHide($('.news-list-set.cr'), function() { newsList.anim = false; }); }
						newsList.detailShow($nls, function() {
							if ($nls.attr('data-nls-opened')!=='true') {
								newsList.commentShow($nls, function() {
									newsList.anim = false;
									lazy.check();
								});
							} else {
								newsList.anim = false;
							}
						});
						var st = $(newsList.scr()).scrollTop(), t = Math.round($nl.offset().top)+1;
						for (var i=0; i<=idx-1; i++) { t += $nl.children('.news-list-set:visible:eq('+i+')').children('.nls-fv').outerHeight()+1; }
						t -= $('#header .header-in').outerHeight();
						if (t!==st) {
							$(newsList.scr()).animate({scrollTop: t}, newsList.detailDur, 'yriEoc', function() {
								newsList.anim = false;
								lazy.check();
							});
						} else {
							lazy.check();
						}
					}
					return false;
				}
			});
			$('.news-list .cmn-more').click(function() {
				var $nl = $(this).parents('.news-list'), id = $nl.find('.local-nav-in li.cr a').attr('data-nls-filter');
				if (id==='all') {
					$nl.find('.news-list-set[data-nls-seen="false"]:lt('+(newsList.moreNum+1)+')').each(function() { newsList.tweetShow($(this)); });
					$nl.find('.news-list-set[data-nls-seen="false"]:lt('+(newsList.moreNum+1)+')').show().attr({'data-nls-seen': 'true'});
					if ($nl.find('.news-list-set[data-nls-seen="false"]').length-1===-1) { $nl.find('.cmn-more-wrap').hide(); }
				} else {
					$nl.find('.news-list-set[data-nls-category="'+id+'"][data-nls-seen="false"]:lt('+(newsList.moreNum+1)+')').each(function() { newsList.tweetShow($(this)); });
					$nl.find('.news-list-set[data-nls-category="'+id+'"][data-nls-seen="false"]:lt('+(newsList.moreNum+1)+')').show().attr({'data-nls-seen': 'true'});
					if ($nl.find('.news-list-set[data-nls-category="'+id+'"][data-nls-seen="false"]').length-1===-1) { $nl.find('.cmn-more-wrap').hide(); }
				}
				lazy.check();
				return false;
			});
		});
	}
};

// スケジュールリスト
var schedList = {
	defNum: 5,
	moreNum: 5,
	hashDur: 500,
	filterDur: 300,
	detailDur: 400,
	scr: function() { if (browser.ie() || browser.ff()) { return 'html'; } else { return 'body'; } },
	detailShow: function($sls, callback) {
		this.anim = true;
		$sls.addClass('cr');
		$sls.find('.sls-detail').slideDown(this.detailDur, 'yriEoc', function() { callback(); });
	},
	detailHide: function($sls, callback) {
		this.anim = true;
		$sls.removeClass('cr');
		$sls.find('.sls-detail').slideUp(this.detailDur, 'yriEoc', function() { callback(); });
	},
	start: function() {
		this.defNum--;
		this.moreNum--;
		$(window).load(function() {
			var hashId = location.hash;
			$('.sched-list-set').hide().css({'visibility': 'visible'}).attr({'data-sls-seen': 'false'});
			$('.sched-list').each(function() {
				$(this).find('.sched-list-set:lt('+(schedList.defNum+1)+')').show().attr({'data-sls-seen': 'true'});
				var $hash = $(this).find('.sched-list-set[data-sls-id="'+hashId.slice(10)+'"]');
				if (hashId.indexOf('#schedule-')===0 && $hash.length-1!==-1) {
					hashId = $(this).find('.sched-list-set').index($hash);
					$(this).find('.sched-list-set:lt('+(hashId+1)+')').show().attr({'data-sls-seen': 'true'});
					$hash.addClass('cr');
					$hash.find('.sls-detail').show();
					setTimeout(function() {
						schedList.anim = true;
						var ot = Math.round($hash.offset().top), t = ot-$('#header .header-in').outerHeight();
						$(schedList.scr()).animate({scrollTop: t}, schedList.hashDur, 'yriEoc', function() {
							schedList.anim = false;
							lazy.check();
						});
					}, 500);
				}
				if ($(this).find('.sched-list-set:hidden').length-1===-1) { $(this).find('.cmn-more-wrap').hide(); }
			});
			$('.sched-list .local-nav-in a').click(function() {
				if (!$(this).parent().hasClass('cr') && schedList.anim!==true) {
					schedList.anim = true;
					var id = $(this).attr('data-sls-filter'), $sl = $(this).parents('.sched-list');
					$sl.find('.local-nav-in li.cr').removeClass('cr');
					$(this).parent().addClass('cr');
					$sl.find('.sched-list-in').fadeOut(schedList.filterDur, function() {
						$sl.find('.sched-list-set.cr .sls-detail').hide();
						$sl.find('.sched-list-set.cr').removeClass('cr');
						$sl.find('.sched-list-set').hide();
						if (id==='all') {
							var idx = $sl.find('.sched-list-set').index($sl.find('.sched-list-set[data-sls-seen="true"]:last'));
							$sl.find('.sched-list-set:lt('+(idx+1)+')').show().attr({'data-sls-seen': 'true'});
							if ($sl.find('.sched-list-set[data-sls-seen="false"]').length-1===-1) { $sl.find('.cmn-more-wrap').hide(); }
							else { $sl.find('.cmn-more-wrap').show(); }
						} else {
							$sl.find('.sched-list-set[data-sls-category="'+id+'"]:lt('+(schedList.defNum+1)+')').show().attr({'data-sls-seen': 'true'});
							$sl.find('.sched-list-set[data-sls-category="'+id+'"][data-sls-seen="true"]').show();
							if ($sl.find('.sched-list-set[data-sls-category="'+id+'"][data-sls-seen="false"]').length-1===-1) { $sl.find('.cmn-more-wrap').hide(); }
							else { $sl.find('.cmn-more-wrap').show(); }
						}
						$(this).fadeIn(schedList.filterDur, function() {
							schedList.anim = false;
							lazy.check();
						});
					});
				}
				return false;
			});
			$('.sched-list-set .sls-trap').bind('mouseover mouseout click', function(e) {
				var $sls = $(this).parent(), $sl = $sls.parent(), idx = $sl.children('.sched-list-set:visible').index($sls);
				if (e.type==='mouseover') {
					$sls.addClass('on');
				} else if (e.type==='mouseout') {
					$sls.removeClass('on');
				} else if (e.type==='click') {
					if (schedList.anim!==true) {
						if ($('.sched-list-set.cr').length-1!==-1) { schedList.detailHide($('.sched-list-set.cr'), function() { schedList.anim = false; }); }
						schedList.detailShow($sls, function() {
							schedList.anim = false;
							lazy.check();
						});
						var st = $(schedList.scr()).scrollTop(), t = Math.round($sl.offset().top)+1;
						for (var i=0; i<=idx-1; i++) { t += $sl.children('.sched-list-set:visible:eq('+i+')').children('.sls-fv').outerHeight()+1; }
						t -= $('#header .header-in').outerHeight();
						if (t!==st) {
							$(schedList.scr()).animate({scrollTop: t}, schedList.detailDur, 'yriEoc', function() {
								schedList.anim = false;
								lazy.check();
							});
						} else {
							lazy.check();
						}
					}
					return false;
				}
			});
			$('.sched-list .cmn-more').click(function() {
				var $sl = $(this).parents('.sched-list'), id = $sl.find('.local-nav-in li.cr a').attr('data-sls-filter');
				if (id==='all') {
					$sl.find('.sched-list-set[data-sls-seen="false"]:lt('+(schedList.moreNum+1)+')').show().attr({'data-sls-seen': 'true'});
					if ($sl.find('.sched-list-set[data-sls-seen="false"]').length-1===-1) { $sl.find('.cmn-more-wrap').hide(); }
				} else {
					$sl.find('.sched-list-set[data-sls-category="'+id+'"][data-sls-seen="false"]:lt('+(schedList.moreNum+1)+')').show().attr({'data-sls-seen': 'true'});
					if ($sl.find('.sched-list-set[data-sls-category="'+id+'"][data-sls-seen="false"]').length-1===-1) { $sl.find('.cmn-more-wrap').hide(); }
				}
				lazy.check();
				return false;
			});
		});
	}
};

// コメントリスト
var commentList = {
	hashDur: 500,
	scr: function() { if (browser.ie() || browser.ff()) { return 'html'; } else { return 'body'; } },
	start: function() {
		var months = {
			'Jan': "Januari",
			'Feb': "Februari",
			'Mar': "Maret",
			'Apr': "April",
			'May': "Mei",
			'Jun': "Juni",
			'Jul': "Juli",
			'Aug': "Agustus",
			'Sep': "September",
			'Oct': "Oktober",
			'Nov': "November",
			'Dec': "Desember"};
		var months2 = {
			'Jan': "01",
			'Feb': "02",
			'Mar': "03",
			'Apr': "04",
			'May': "05",
			'Jun': "06",
			'Jul': "07",
			'Aug': "08",
			'Sep': "09",
			'Oct': "10",
			'Nov': "11",
			'Dec': "12"};
		var tw_account = this.twid,
			get_count = 5, // limit 200
			tw_id = 0;
		function setCommentPageRidersComment(tw_id) {
			$.ajax({
				data: {
					screen_name: tw_account,
					max_id: tw_id,
					count: get_count + 1 // pagenation用に一つ余分に取得
				},  
				dataType: 'JSON',
				timeout: 30000,
				url: '/system_sns/getTweetByRest.php',
				success: function(data){
					var list = "", cls_id = new Array();
					for(var i = 0; i < data.length - 1; i++){
						var tw_txt = data[i].text;
						var dt = data[i].created_at.split(' ');
						var dt_day = dt[2];
						var dt_year = dt[5];
						var dt_year2 = dt_year.slice(-2);
						var dt_month = months[dt[1]];
						var dt_month2 = months2[dt[1]];
						var cls_id2 = dt_day+dt_month2+dt_year2;
						var cls_id_num = 1;
						while (cls_id.join('').indexOf(cls_id2+'_'+cls_id_num)!==-1) { cls_id_num++; }
						cls_id2 += '_'+cls_id_num;
						cls_id.push(cls_id2);
						tw_txt = $('<div />').html(tw_txt).text(); // html encode
						if(typeof data[i].entities.media == "object" && data[i].entities.media[0].type == "photo"){
							list += ['<div class="comment-list-set" data-cls-id="'+cls_id2+'" data-cls-seen="true">',
								'<div class="cls-fv">',
									'<div class="cls-block1">',
										'<p class="date">'+dt_day+', '+dt_month+' '+dt_year+'</p>',
										'<div class="txt"><p><span class="name"><a href="https://twitter.com/', tw_account, '" target="_blank">@', tw_account ,'</a>&nbsp;/</span>',
										data[i].text,
										'</p></div>',
										'<p class="img"><img src="/images/spacer.gif" alt="" data-lazy="', data[i].entities.media[0].media_url ,'"></p>',
									'</div>',
								'</div>',
							'</div>'].join('');
						} else {
							list += ['<div class="comment-list-set" data-cls-id="'+cls_id2+'" data-cls-seen="true">',
								'<div class="cls-fv">',
									'<div class="cls-block1">',
										'<p class="date">'+dt_day+', '+dt_month+' '+dt_year+'</p>',
										'<div class="txt"><p><span class="name"><a href="https://twitter.com/', tw_account, '" target="_blank">@', tw_account ,'</a>&nbsp;/</span>',
										data[i].text,
										'</p></div>',
									'</div>',
								'</div>',
							'</div>'].join('');
						}
					}
					$('.comment-list-in').append(list);
					// ページ送り設定
					$('.comment-list .cmn-more').attr({'data-nextid': data[data.length-1].id});
					lazy.check();
				}
			});
		}
		$(window).load(function() {
			setCommentPageRidersComment(tw_id);
			$('.comment-list .cmn-more').click(function(){
				setCommentPageRidersComment($(this).attr('data-nextid'));
				return false;
			});
		});
	}
};

// ライダーのツイート
var ridersTweet = {
	start: function() {
		var tw_account = this.twid, get_count = 2;
		function setRidersPageRidersComment() {
			$.ajax({
				data: {
					screen_name: tw_account,
					count: get_count
				},  
				dataType: 'JSON',
				timeout: 30000,
				url: '/system_sns/getTweetByRest.php',
				success: function(data){
					for (var i=0; i<=data.length-1; i++) { $('.riders-section .riders-body .col2-2 .twitter .set:eq('+i+') .txt p').html(data[i].text); }
				}
			});
		}
		setRidersPageRidersComment();
	}
};

// ギャラリーリスト
var glryList = {
	run: function() {
		this.anim = true;
		$.ajax({,
			url: "/system_sns/getInstagram.php", 
			data: {
				"next_max_id": glryList.id // 後述のajaxで取得したjson内にnext_max_idがあった場合、その値を送ることで次ページのデータが取得できます。
			},
			dataType: "json",
			error: function(jqXHR, textStatus, errorThrown) {
//				console.log('error');
			},
			success: function(data, textStatus, jqXHR) {
//				console.log(data); // こちらで取得データ全件表示 デバッグ用
				glryList.count++;
				var html = '', mx = data.data.length-1;
				if ($('.gallery-list[data-gl-title="true"]').length-1!==-1) {
					$.each(data.data, function(i,item){
						if (i<=mx-1) {
							if (i===1 || i===2 || i===4 || i===6 || i===7 || i===9) { html += '<div class="gls-in">'; }
							html += '<div class="gls-img gls-img-'+(i+2)+'"><a href="javascript:void(0);" data-img-modal="'+item.images.standard_resolution.url+'" data-shine-trigger="gls'+(glryList.count+1)+'-'+(i+2)+'"><img src="'+item.images.standard_resolution.url+'" alt=""><span class="shine" data-shine="gls'+(glryList.count+1)+'-'+(i+2)+'"></span></a></div>';
							if (i===0 || i===1 || i===3 || i===5 || i===6 || i===8 || i===9 || i===mx-1) { html += '</div>'; }
//							console.log(item.images.standard_resolution.url); // ひとまず低解像度の画像のURLを取得しています
//							console.log(item.link); //リンクを取得
						}
					});
					$('.gallery-list .gallery-list-in').append('<div class="gallery-list-set num'+(mx+1)+'"><div class="gls-in"><a href="/gallery/" class="gls-img gls-img-1 gls-title" data-shine-trigger="gls1-1"><span class="line1">YAMAHA</span><span class="line2">INSTAGRAM</span><span class="line3">PHOTO</span><span class="line4">GALLERY</span><span class="shine" data-shine="gls1-1"></span></a>'+html+'</div>');
				} else {
					$.each(data.data, function(i,item){
						if (i===0 || i===2 || i===3 || i===5 || i===7 || i===8 || i===10) { html += '<div class="gls-in">'; }
						html += '<div class="gls-img gls-img-'+(i+1)+'"><a href="javascript:void(0);" data-img-modal="'+item.images.standard_resolution.url+'" data-shine-trigger="gls'+(glryList.count+1)+'-'+(i+1)+'"><img src="'+item.images.standard_resolution.url+'" alt=""><span class="shine" data-shine="gls'+(glryList.count+1)+'-'+(i+1)+'"></span></a></div>';
						if (i===1 || i===2 || i===4 || i===6 || i===7 || i===9 || i===10 || i===mx) { html += '</div>'; }
//						console.log(item.images.standard_resolution.url); // ひとまず低解像度の画像のURLを取得しています
//						console.log(item.link); //リンクを取得
					});
					$('.gallery-list .gallery-list-in').append('<div class="gallery-list-set num'+(mx+1)+'">'+html+'</div>');
				}
				shine.run($('.gallery-list .gallery-list-set:last'));
				imgModal.run($('.gallery-list .gallery-list-set:last'));
				if(typeof data.pagination.next_max_id != "undefined"){
					glryList.id = data.pagination.next_max_id;
					// "data.pagination.next_max_id" があれば次のページもあります。もしあればajaxする際に、dataでnext_max_idの値として送れば次ページのjsonが取得できます。
				} else {
					$('.gallery-list .cmn-more-wrap').hide();
				}
				glryList.anim = false;
			}
		});
	},
	start: function() {
		this.count = -1, this.id = '';
		glryList.run();
		$('.gallery-list .cmn-more').click(function() {
			if (glryList.anim!==true) { glryList.run(); }
			return false;
		});
	}
};

// カスタムスクロール
var cscroll = {
	dragY: new Array(),
	mouse: function(e) { var obj = new Object(); if (e) { obj.x = e.pageX; obj.y = e.pageY; } else { obj.x = event.x+document.body.scrollLeft; obj.y = event.y+document.body.scrollTop; } return obj; },
	mouseIn: function(e, $el) { if (($el.offset().left<this.mouse(e).x && this.mouse(e).x<$el.offset().left+$el.outerWidth()) && ($el.offset().top<this.mouse(e).y && this.mouse(e).y<$el.offset().top+$el.outerHeight())) { return true; } else { return false; } },
	cntl: function($cs) {
		var inh = $cs.find('.custom-scroll-in').height(), lerh = $cs.find('.custom-scroller').height(), in2h = $cs.find('.custom-scroll-in2').outerHeight(), st = $cs.find('.custom-scroll-in').scrollTop();
		if (in2h>inh) {
			$cs.find('.custom-scrollbar-m').height(Math.round((inh*lerh)/in2h-10));
			$cs.find('.custom-scrollbar').css({'top': Math.round((st*lerh)/in2h)});
			$cs.find('.custom-scroller').css({'visibility': 'visible'});
		} else {
			$cs.find('.custom-scroller').css({'visibility': 'hidden'});
		}
	},
	run: function($cs) {
		$cs.append('<div class="custom-scroller"><div class="custom-scrollbar"><div class="custom-scrollbar-t"></div><div class="custom-scrollbar-m"></div><div class="custom-scrollbar-b"></div></div></div>');
		var w = $cs.parent().width(), h = $cs.parent().height();
		$cs.width(w).height(h);
		$cs.find('.custom-scroll-in').width(w+20).height(h);
		$cs.find('.custom-scroll-in2').width(w-20);
		$cs.find('.custom-scroller').height(h-10);
		this.cntl($cs);
		$cs.find('.custom-scroll-in').scroll(function() { cscroll.cntl($cs); });
		$cs.find('.custom-scroller').mousedown(function(e) {
			var $cs = $(this).parent(), st = $cs.find('.custom-scroll-in').scrollTop(), bt = $cs.find('.custom-scrollbar').offset().top;
			if (cscroll.mouseIn(e, $cs.find('.custom-scrollbar'))) {
				cscroll.drag = true;
				$cs.attr({'data-cs-drag': 'true'});
				cscroll.dragY[0] = e.pageY;
				e.preventDefault();
			} else {
				$cs.find('.custom-scroll-in').scrollTop((cscroll.mouse(e).y<bt) ? st-100 : st+100);
			}
		});
		$('body').bind('mousemove mouseup mouseleave', function(e) {
			if (cscroll.drag===true) {
				var $cs = $('.custom-scroll[data-cs-drag="true"]');
				if (e.type==='mousemove') {
					var inh = $cs.find('.custom-scroll-in').height(), in2h = $cs.find('.custom-scroll-in2').outerHeight(), st = $cs.find('.custom-scroll-in').scrollTop();
					cscroll.dragY[1] = cscroll.dragY[0];
					cscroll.dragY[0] = e.pageY;
					$cs.find('.custom-scroll-in').scrollTop(st+(cscroll.dragY[0]-cscroll.dragY[1])*in2h/inh);
				} else if (e.type==='mouseup' || e.type==='mouseleave') {
					$cs.attr({'data-cs-drag': 'false'});
					cscroll.drag = false;
				}
			}
		});
	},
	start: function() {
		$('.custom-scroll:not(.not-cs)').each(function() { cscroll.run($(this)); });
	}
};

// 画像後読み
var lazy = {
	dur: 400,
	scr: function() { if (browser.ie() || browser.ff()) { return 'html'; } else { return 'body'; } },
	wh: function() { if (browser.ie()) { return document.documentElement.clientHeight; } else { return window.innerHeight; } },
	show: function(el) {
		$(el).attr({'src': $(el).attr('data-lazy'), 'data-lazy-loaded': 'true'});
		if (!browser.ie('6') && !browser.ie('7') && !browser.ie('8')) { $(el).hide().fadeIn(this.dur); }
	},
	check: function() {
		var st = $(this.scr()).scrollTop(), wh = this.wh();
		if (returnTop.anim!==true && newsList.anim!==true && schedList.anim!==true && commentList.anim!==true) {
			$('[data-lazy][data-lazy-loaded!="true"]:visible').each(function() {
				var ot = $(this).offset().top, h = $(this).height();
				if (ot<st+wh && st<ot+h) { lazy.show(this); }
			});
		}
	},
	start: function() {
		$('[data-lazy]').attr({'data-lazy-loaded': 'false'});
		$(window).load(function() {
			lazy.check();
			$(window).scroll(function() { lazy.check(); });
		});
	}
};

// ハイライト
var shine = {
	run: function($parent) {
		var $el = ($parent===undefined) ? $('[data-shine-trigger]') : $parent.find('[data-shine-trigger]');
		$el.mouseover(function() {
			var id = $(this).attr('data-shine-trigger');
			$('[data-shine="'+id+'"]').stop().fadeTo(150, 0.3, function() { $(this).fadeTo(150, 0); });
		});
	},
	start: function() {
		this.run();
	}
};

// 画像のモーダル
var imgModal = {
	fadeDur: 300,
	run: function($parent) {
		var $el = ($parent===undefined) ? $('[data-img-modal]') : $parent.find('[data-img-modal]');
		$el.click(function() {
			if (imgModal.anim!==true) {
				imgModal.anim = true;
				$('body').append(
					'<div id="img-modal">'+
						'<div class="img-modal-overlay"></div>'+
						'<div class="img-modal-in">'+
							'<p class="imi-close"><a href="javascript:void(0);" title="CLOSE"></a></p>'+
							'<p class="imi-img"><img src="'+$(this).attr('data-img-modal')+'" alt=""></p>'+
						'</div>'+
					'</div>'
				);
				$('#img-modal .img-modal-overlay').fadeIn(imgModal.fadeDur);
				$('#img-modal .img-modal-in').fadeIn(imgModal.fadeDur, function() {
					imgModal.anim = false;
					$('#img-modal .img-modal-overlay, #img-modal .imi-close a').click(function() {
						$('#img-modal .img-modal-in').fadeOut(imgModal.fadeDur);
						$('#img-modal .img-modal-overlay').fadeOut(imgModal.fadeDur, function() { $('#img-modal').remove(); });
						return false;
					});
				});
			}
			return false;
		});
	},
	start: function() {
		this.run();
	}
};

$(function() {
	// ボディのクラス名
	var cls = new Array();
	if (device.tb()) {
		cls.push('tb');
		if (device.ipad()) {
			cls.push('ipad');
			for (var i=0; i<=50; i++) { if (device.ipad(i.toString())) { cls.push('ipad-'+i); break; } }
		} else if (device.andtb()) {
			cls.push('andtb');
		}
	} else {
		cls.push('mac');
		if (device.win()) {
			cls.push('win');
			if (device.win('8')) { cls.push('win-8'); } else if (device.win('7')) { cls.push('win-7'); } else if (device.win('vista')) { cls.push('win-vista'); } else if (device.win('xp')) { cls.push('win-xp'); }
		} else if (device.mac()) {
			cls.push('mac');
		}
	}
	if (browser.ie()) { cls.push('ie'); for (var i=6; i<=50; i++) { if (browser.ie(i.toString())) { cls.push('ie-'+i); break; } } }
	else if (browser.ff()) { cls.push('ff'); }
	else if (browser.safari()) { cls.push('safari'); }
	else if (browser.chrome()) { cls.push('chrome'); }
	$('body').addClass(cls.join(' '));

	if ($('#header .global-nav').length-1!==-1) { gnav.start(); }
	if ($('[data-load]').length-1!==-1) { imgLoad.start(); }
	if ($('[rel="page-gplus"]').length-1!==-1) { pageGplus.start(); }
	if ($('[rel="page-tweet"]').length-1!==-1) { pageTweet.start(); }
	if ($('[data-twitter-follow]').length-1!==-1) { twitterFollow.start(); }
	if ($('[data-page-fb="true"]').length-1!==-1) { pageFb.start(); }
	if ($('[rel="return-top"]').length-1!==-1) { returnTop.start(); }
	if ($('.main-visual').length-1!==-1) { mainVisual.start(); }
	if ($('.news-lineup').length-1!==-1) { newsLineup.start(); }
	if ($('.race-result').length-1!==-1) { raceResult.start(); }
	if ($('.local-dd-nav').length-1!==-1) { localDdNav.start(); }
	if ($('.news-list').length-1!==-1) { newsList.start(); }
	if ($('.sched-list').length-1!==-1) { schedList.start(); }
	if ($('.comment-list').length-1!==-1) { commentList.start(); }
	if ($('.riders-section .riders-body .col2-2 .twitter').length-1!==-1) { ridersTweet.start(); }
	if ($('.gallery-list').length-1!==-1) { glryList.start(); }
	if ($('.custom-scroll').length-1!==-1) { cscroll.start(); }
	if ($('[data-lazy]').length-1!==-1) { lazy.start(); }
	if ($('[data-shine-trigger]').length-1!==-1) { shine.start(); }
	if ($('[data-img-modal]').length-1!==-1) { imgModal.start(); }
});





/* ------------------------------------------------------ */
/* End */
/* ------------------------------------------------------ */
