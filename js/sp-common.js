/* ------------------------------------------------------ */
/* Updated: 2015/03 */
/* ------------------------------------------------------ */

// グロナビ
var gnav = {
	dur: 250,
	show: function(callback) {
		this.anim = true;
		$('#header').addClass('menu-show');
		$('#header .sp-menu-btn').addClass('cr');
		$('#header .sp-menu-bg').css({'visibility': 'visible', 'opacity': 0.8, '-webkit-transition': 'opacity '+this.dur+'ms linear'});
		$('#header .global-nav').css({'visibility': 'visible', '-webkit-transform': 'translate3d(-236px, 0, 0)', '-webkit-transition': '-webkit-transform '+this.dur+'ms ease-out'}).one('webkitTransitionEnd', function() {
			$('#header .sp-menu-bg').css({'-webkit-transition': ''});
			$(this).css({'right': 0, '-webkit-transform': 'translate3d(0, 0, 0)', '-webkit-transition': ''});
			gnav.disp = true;
			callback();
		});
	},
	hide: function(callback) {
		this.anim = true;
		$('#header .sp-menu-btn').removeClass('cr');
		$('#header .global-nav').css({'-webkit-transform': 'translate3d(236px, 0, 0)', '-webkit-transition': '-webkit-transform '+this.dur+'ms ease-out'});
		$('#header .sp-menu-bg').css({'opacity': 0, '-webkit-transition': 'opacity '+this.dur+'ms linear'}).one('webkitTransitionEnd', function() {
			$('#header .global-nav').css({'right': -236, 'visibility': 'hidden', '-webkit-transform': 'translate3d(0, 0, 0)', '-webkit-transition': ''}).scrollTop(0);
			$(this).css({'visibility': 'hidden', '-webkit-transition': ''});
			$('#header').removeClass('menu-show');
			gnav.disp = false;
			callback();
		});
	},
	start: function() {
		$('#header .sp-menu-btn a, #header .sp-menu-bg').click(function() {
			if (gnav.anim!==true) {
				if (gnav.disp!==true) { gnav.show(function() { gnav.anim = false; }); }
				else { gnav.hide(function() { gnav.anim = false; }); }
			}
			return false;
		});
	}
};

// ページのGoogle+
var pageGplus = {
	start: function() {
		var url = encodeURIComponent(location.href);
		$('[rel="page-gplus"]').each(function() { $(this).attr({'href': 'https://plus.google.com/share?url='+url, 'target': '_blank'}); });
	}
};

// ページのツイート
var pageTweet = {
	start: function() {
		var url = encodeURIComponent(location.href), title = encodeURIComponent(document.title);
		$('[rel="page-tweet"]').each(function() { $(this).attr({'href': 'http://twitter.com/share?url='+url+'&amp;text='+title, 'target': '_blank'}); });
	}
};

// ツイッターのフォロー
var twitterFollow = {
	start: function() {
		$('[data-twitter-follow]').each(function() { $(this).attr({'href': 'https://twitter.com/intent/follow?screen_name='+$(this).attr('data-twitter-follow'), 'target': '_blank'}); });
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
	run: function(callback) {
		this.anim = true;
		$('body').animate({scrollTop: 0}, this.scrDur, function() { callback(); });
	},
	start: function() {
		$('[rel="return-top"]').click(function() {
			var st = $('body').scrollTop();
			if (st!==0 && returnTop.anim!==true) {
				returnTop.run(function() {
					returnTop.anim = false;
					lazy.check();
				});
			}
			return false;
		});
		$(window).scroll(function() {
			var st = $('body').scrollTop();
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
	adjust: function() {
		var ww = $(window).width();
		$('.main-visual .mv-in').css({'left': ww*this.cr*-1});
		$('.main-visual .mv-set').each(function(i) { $(this).css({'left': ww*i}); });
	},
	timeCheck: function() {
		clearTimeout(this.timer);
		if (this.anim!==true && mainVisual.fl!==true) {
			this.timer = setTimeout(function() {
				mainVisual.count++;
				if (mainVisual.count>=mainVisual.time/100) {
					mainVisual.count = 0;
					mainVisual.slide(1, 0);
				} else {
					mainVisual.timeCheck();
				}
			}, 100);
		} else {
			this.count = 0;
		}
	},
	flick: function() {
		var ts = false, startX = 0, startY = 0, startScrollY = 0, diffX = 0, diffY = 0, sTime = 0, imgL = 0;
		return function(e) {
			if (mainVisual.anim!==true) {
				var touch = e.touches[0];
				if (e.type==='touchstart') {
					ts = true;
					startX = touch.pageX, startY = touch.pageY;
					diffX = 0, diffY = 0;
					startScrollY = document.body.scrollTop;
					sTime = (new Date()).getTime();
					imgL = eval($('.main-visual .mv-in').css('left').replace('px', ''));
				} else if (e.type==='touchmove') {
					if (ts) {
						diffX = touch.pageX-startX, diffY = touch.pageY-startY;
						if (Math.abs(diffX)>Math.abs(diffY)) {
							e.preventDefault();
							if (startScrollY===document.body.scrollTop) {
								$('.main-visual .mv-in').css({'left': imgL+diffX});
								if (mainVisual.fl!==true) {
									mainVisual.fl = true;
									var ww = $(window).width();
									if (mainVisual.cr===0) { $('.main-visual .mv-set:last').css({'left': ww*-1}); }
									else if (mainVisual.cr===mainVisual.mx) { $('.main-visual .mv-set:first').css({'left': ww*(mainVisual.mx+1)}); }
								}
							}
						}
					}
				} else if (e.type==='touchend') {
					if (ts) {
						ts = false;
						var t = (new Date()).getTime()-sTime;
						var ww = $(window).width();
						if (imgL!=eval($('.main-visual .mv-in').css('left').replace('px', ''))) {
							if (diffX>ww/2 || (diffX>20&&t<500)) { mainVisual.slide(-1, diffX); }
							else if (diffX<ww/2*-1 || (diffX<-20&&t<500)) { mainVisual.slide(1, diffX); }
							else { mainVisual.slide(0, diffX); }
						}
					}
				}
			}
		}
	},
	slide: function(next, diff) {
		this.anim = true;
		var ww = $(window).width();
		$('.main-visual .mv-pointer li.cr').removeClass('cr');
		if (this.cr+next===-1) {
			if (diff===0) { $('.main-visual .mv-set:last').css({'left': ww*-1}); }
			$('.main-visual .mv-pointer li:last').addClass('cr');
		} else if (this.cr+next===this.mx+1) {
			if (diff===0) { $('.main-visual .mv-set:first').css({'left': ww*(this.mx+1)}); }
			$('.main-visual .mv-pointer li:first').addClass('cr');
		} else {
			if (this.two && this.cr+next>=2) { $('.main-visual .mv-pointer li:eq('+(this.cr+next-2)+')').addClass('cr'); }
			else { $('.main-visual .mv-pointer li:eq('+(this.cr+next)+')').addClass('cr'); }
		}
		function run() {
			$('.main-visual .mv-in').css({'-webkit-transform': 'translate3d('+(ww*next*-1-diff)+'px, 0, 0)', '-webkit-transition': '-webkit-transform '+mainVisual.dur+'ms ease-out'}).one('webkitTransitionEnd', function() {
				setTimeout(function() {
					$('.main-visual .mv-in').css({'left': '+='+(ww*next*-1-diff)+'px', '-webkit-transform': 'translate3d(0, 0, 0)', '-webkit-transition': ''});
					$('.main-visual .mv-set').each(function(i) { $(this).css({'left': ww*i}); });
					if (mainVisual.cr+next===-1) {
						$('.main-visual .mv-in').css({'left': ww*mainVisual.mx*-1});
						mainVisual.cr = mainVisual.mx;
					} else if (mainVisual.cr+next===mainVisual.mx+1) {
						$('.main-visual .mv-in').css({'left': 0});
						mainVisual.cr = 0;
					} else {
						mainVisual.cr += next;
					}
					mainVisual.fl = false;
					mainVisual.anim = false;
					if (mainVisual.mx>=1) { mainVisual.timeCheck(); }
				}, 10);
			});
		}
		if (device.android()) { setTimeout(function() { run(); }, 100); } else { run(); }
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
		$('.main-visual .mv-set').each(function() { $(this).css({'background-image': 'url('+$(this).find('.bg img').attr('data-sp-mv-img')+')'}); });
		if (this.mx===1) {
			$('.main-visual .mv-in').append($('.main-visual .mv-in').html());
			this.two = true;
			this.mx = 3;
		}
		this.adjust();
		$(window).bind('orientationchange resize', function() { mainVisual.adjust(); });
		$(window).load(function() {
			$('.main-visual .mv-arrow.prev a').click(function() {
				if (mainVisual.anim!==true) { mainVisual.slide(-1, 0); }
				return false;
			});
			$('.main-visual .mv-arrow.next a').click(function() {
				if (mainVisual.anim!==true) { mainVisual.slide(1, 0); }
				return false;
			});
			$('.main-visual .mv-set .link').click(function() { if (mainVisual.anim) { return false; } });
			if (device.sp()) {
				var trap = $('.main-visual .mv-in')[0];
				var thTrap = mainVisual.flick();
				trap.addEventListener('touchstart', thTrap, false);
				trap.addEventListener('touchmove', thTrap, false);
				trap.addEventListener('touchend', thTrap, false);
			}
			if (mainVisual.mx>=1) { mainVisual.timeCheck(); }
		});
	}
};

// ニュースラインアップ
var newsLineup = {
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
					if (data.statuses.length-1!==-1) { $nli.find('.nli-block2 .body .txt p .txt-body').html(data.statuses[0].text); }
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
					$r_comment_block.find('.nli-block1 .img').css({'background-image': 'url('+tw_img+')'});
					// 次のアカウントの取得
					i++;
					if(i < tw_accounts.length){ setTopPageRidersComment(i); } else { callback(); }
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

// ローカルナビ
var localNav = {
	dur: 200,
	show: function($ln) {
		$ln.find('.local-nav-in').stop().slideDown(this.dur);
		$ln.find('.selected').addClass('on');
	},
	hide: function($ln) {
		$ln.find('.local-nav-in').stop().slideUp(this.dur);
		$ln.find('.selected').removeClass('on');
	},
	start: function() {
		$('.local-nav .selected a').click(function() {
			if (!$(this).parent().hasClass('on')) { localNav.show($(this).parents('.local-nav')); }
			else { localNav.hide($(this).parents('.local-nav')); }
			return false;
		});
	}
};

// ローカルドロップダウンナビ
var localDdNav = {
	dur: 200,
	start: function() {
		$('.local-dd-nav dl dt a').click(function() {
			var $dl = $(this).parent().parent(), $ldn = $(this).parents('.local-dd-nav');
			if (!$dl.hasClass('on')) {
				if ($ldn.find('dl.on').length-1!==-1) {
					if ($ldn.find('dl.on').children('dd').length-1!==-1) { $ldn.find('dl.on').children('dd').stop().slideUp(localDdNav.dur); }
					$ldn.find('dl.on').removeClass('on');
				}
				if ($dl.children('dd').length-1!==-1) { $dl.children('dd').stop().slideDown(localDdNav.dur); }
				$dl.addClass('on');
			} else {
				if ($dl.children('dd').length-1!==-1) { $dl.children('dd').stop().slideUp(localDdNav.dur); }
				$dl.removeClass('on');
			}
			return false;
		});
	}
};

// レース結果
var raceResult = {
	dur: 200,
	show: function($rw, callback) {
		this.anim = true;
		$rw.find('.rr-tab-in').stop().slideDown(this.dur);
		$rw.find('.rr-tab .selected').addClass('on');
		$rw.find('.rr-mask').css({'visibility': 'visible', 'opacity': 0.8, '-webkit-transition': 'opacity '+this.dur+'ms linear'}).one('webkitTransitionEnd', function() {
			$(this).css({'-webkit-transition': ''});
			callback();
		});
	},
	hide: function($rw, callback) {
		this.anim = true;
		$rw.find('.rr-tab-in').stop().slideUp(this.dur);
		$rw.find('.rr-tab .selected').removeClass('on');
		$rw.find('.rr-mask').css({'opacity': 0, '-webkit-transition': 'opacity '+this.dur+'ms linear'}).one('webkitTransitionEnd', function() {
			$(this).css({'visibility': 'hidden', '-webkit-transition': ''});
			callback();
		});
	},
	start: function() {
		$('.race-result .rr-tab .selected a').click(function() {
			if (raceResult.anim!==true) {
				if (!$(this).parent().hasClass('on')) { raceResult.show($(this).parents('.rr-wrap'), function() { raceResult.anim = false; }); }
				else { raceResult.hide($(this).parents('.rr-wrap'), function() { raceResult.anim = false; }); }
			}
			return false;
		});
		$('.race-result .rr-tab ul li a').click(function() {
			if (raceResult.anim!==true) {
				if (!$(this).parent().hasClass('cr')) {
					var $wrap = $(this).parents('.rr-wrap'), idx = $wrap.find('.rr-tab ul li').index($(this).parent());
					$wrap.find('.rr-tab ul .cr').removeClass('cr');
					$wrap.find('.rr-tab .selected a .cr').removeClass('cr');
					$wrap.find('.rr-body .cr').removeClass('cr');
					$(this).parent().addClass('cr');
					$wrap.find('.rr-tab .selected a span:eq('+idx+')').addClass('cr');
					$wrap.find('.rr-body .rr-set:eq('+idx+')').addClass('cr');
				}
				raceResult.hide($(this).parents('.rr-wrap'), function() { raceResult.anim = false; });
			}
			return false;
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
	detailShow: function($nls, callback) {
		this.anim = true;
		$nls.addClass('cr');
		$nls.find('.nls-detail').slideDown(this.detailDur, function() { callback(); });
	},
	detailHide: function($nls, callback) {
		this.anim = true;
		$nls.removeClass('cr');
		$nls.find('.nls-detail').slideUp(this.detailDur, function() { callback(); });
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
				if (mx2===0 || mx2===1) { $nls.find('.comment').addClass('lt3'); }
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
					$(this).find('.nls-block3 .btn a').attr({'href': 'http://twitter.com/share?hashtags='+hash, 'target': '_blank'});
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
							$('body').animate({scrollTop: t}, newsList.hashDur, function() {
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
					var id = $(this).attr('data-nls-filter'), $nl = $(this).parents('.news-list'), navIdx = $nl.find('.local-nav-in li').index($(this).parent());
					$nl.find('.local-nav-in li.cr').removeClass('cr');
					$nl.find('.local-nav .selected a .cr').removeClass('cr');
					$(this).parent().addClass('cr');
					$nl.find('.local-nav .selected a span:eq('+navIdx+')').addClass('cr');
					localNav.hide($nl.find('.local-nav'));
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
			$('.news-list-set .nls-trap').click(function() {
				var $nls = $(this).parent(), $nl = $nls.parent(), idx = $nl.children('.news-list-set:visible').index($nls);
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
					var st = $('body').scrollTop(), t = Math.round($nl.offset().top), fvh = $nls.find('.nls-fv').outerHeight();
					for (var i=0; i<=idx-1; i++) { t += $nl.children('.news-list-set:visible:eq('+i+')').children('.nls-fv').outerHeight()+1; }
					t += fvh-38;
					t -= $('#header .header-in').outerHeight();
					if (t!==st) {
						$('body').animate({scrollTop: t}, newsList.detailDur, function() {
							newsList.anim = false;
							lazy.check();
						});
					} else {
						lazy.check();
					}
				}
				return false;
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
	detailShow: function($sls, callback) {
		this.anim = true;
		$sls.addClass('cr');
		$sls.find('.sls-detail').slideDown(this.detailDur, function() { callback(); });
	},
	detailHide: function($sls, callback) {
		this.anim = true;
		$sls.removeClass('cr');
		$sls.find('.sls-detail').slideUp(this.detailDur, function() { callback(); });
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
						$('body').animate({scrollTop: t}, schedList.hashDur, function() {
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
					var id = $(this).attr('data-sls-filter'), $sl = $(this).parents('.sched-list'), navIdx = $sl.find('.local-nav-in li').index($(this).parent());
					$sl.find('.local-nav-in li.cr').removeClass('cr');
					$sl.find('.local-nav .selected a .cr').removeClass('cr');
					$(this).parent().addClass('cr');
					$sl.find('.local-nav .selected a span:eq('+navIdx+')').addClass('cr');
					localNav.hide($sl.find('.local-nav'));
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
			$('.sched-list-set .sls-trap').click(function() {
				var $sls = $(this).parent(), $sl = $sls.parent(), idx = $sl.children('.sched-list-set:visible').index($sls);
				if (schedList.anim!==true) {
					if ($('.sched-list-set.cr').length-1!==-1) { schedList.detailHide($('.sched-list-set.cr'), function() { schedList.anim = false; }); }
					schedList.detailShow($sls, function() {
						schedList.anim = false;
						lazy.check();
					});
					var st = $('body').scrollTop(), t = Math.round($sl.offset().top);
					for (var i=0; i<=idx-1; i++) { t += $sl.children('.sched-list-set:visible:eq('+i+')').children('.sls-fv').outerHeight()+1; }
					t -= $('#header .header-in').outerHeight();
					if (t!==st) {
						$('body').animate({scrollTop: t}, schedList.detailDur, function() {
							schedList.anim = false;
							lazy.check();
						});
					} else {
						lazy.check();
					}
				}
				return false;
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
//					console.log(data);
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
						while (cls_id.indexOf(cls_id2+'-'+cls_id_num)!==-1) { cls_id_num++;  }
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
//					console.log(data[data.length-1].id);
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
					for (var i=0; i<=data.length-1; i++) { $('.riders-section .riders-body .col2-2 .twitter .set:eq('+i+') .txt p').text(data[i].text); }
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
		$.ajax({
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

// 画像後読み
var lazy = {
	dur: 400,
	show: function(el) {
		$(el).attr({'src': $(el).attr('data-lazy'), 'data-lazy-loaded': 'true'});
		$(el).hide().fadeIn(this.dur);
	},
	check: function() {
		var st = $('body').scrollTop(), wh = window.innerHeight;
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
				setTimeout(function() {
					var st = $('body').scrollTop(), wh = window.innerHeight, imih = $('#img-modal .img-modal-in').height(), t = ((wh-imih)/2<50) ? st+50 : st+(wh-imih)/2;
					$('#img-modal .img-modal-overlay').css({'visibility': 'visible', 'opacity': 0.8, '-webkit-transition': 'opacity '+imgModal.fadeDur+'ms linear'});
					$('#img-modal .img-modal-in').css({'top': t, 'visibility': 'visible', 'opacity': 1, '-webkit-transition': 'opacity '+imgModal.fadeDur+'ms linear'}).one('webkitTransitionEnd', function() {
						imgModal.anim = false;
						$('#img-modal .img-modal-overlay, #img-modal .imi-close a').click(function() {
							setTimeout(function() {
								$('#img-modal .img-modal-in').css({'opacity': 0, '-webkit-transition': 'opacity '+imgModal.fadeDur+'ms linear'});
								$('#img-modal .img-modal-overlay').css({'opacity': 0, '-webkit-transition': 'opacity '+imgModal.fadeDur+'ms linear'}).one('webkitTransitionEnd', function() { $('#img-modal').remove(); });
							}, 10);
							return false;
						});
					});
				}, 10);
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
	if (device.iphone()) {
		cls.push('iphone');
		for (var i=0; i<=50; i++) { if (device.iphone(i.toString())) { cls.push('iphone-'+i); break; } }
	} else if (device.android()) {
		cls.push('android');
		for (var i=0; i<=50; i++) { if (device.android(i.toString())) { cls.push('android-'+i); break; } }
	}
	$('body').addClass(cls.join(' '));

	if ($('#header .global-nav').length-1!==-1) { gnav.start(); }
	if ($('[rel="page-gplus"]').length-1!==-1) { pageGplus.start(); }
	if ($('[rel="page-tweet"]').length-1!==-1) { pageTweet.start(); }
	if ($('[data-twitter-follow]').length-1!==-1) { twitterFollow.start(); }
	if ($('[data-page-fb="true"]').length-1!==-1) { pageFb.start(); }
	if ($('[rel="return-top"]').length-1!==-1) { returnTop.start(); }
	if ($('.main-visual').length-1!==-1) { mainVisual.start(); }
	if ($('.news-lineup').length-1!==-1) { newsLineup.start(); }
	if ($('.race-result').length-1!==-1) { raceResult.start(); }
	if ($('.local-nav').length-1!==-1) { localNav.start(); }
	if ($('.local-dd-nav').length-1!==-1) { localDdNav.start(); }
	if ($('.news-list').length-1!==-1) { newsList.start(); }
	if ($('.sched-list').length-1!==-1) { schedList.start(); }
	if ($('.comment-list').length-1!==-1) { commentList.start(); }
	if ($('.riders-section .riders-body .col2-2 .twitter').length-1!==-1) { ridersTweet.start(); }
	if ($('.gallery-list').length-1!==-1) { glryList.start(); }
	if ($('[data-lazy]').length-1!==-1) { lazy.start(); }
	if ($('[data-img-modal]').length-1!==-1) { imgModal.start(); }
});





/* ------------------------------------------------------ */
/* End */
/* ------------------------------------------------------ */
