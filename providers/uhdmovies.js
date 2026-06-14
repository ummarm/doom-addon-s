'use strict';var _0x544e39=_0x44a0;function _0x44a0(_0x13c3d3,_0x41bbd3){_0x13c3d3=_0x13c3d3-0xcf;var _0x21b1ce=_0x21b1();var _0x44a0c0=_0x21b1ce[_0x13c3d3];if(_0x44a0['ETojlB']===undefined){var _0x3df154=function(_0x5a2519){var _0x35999f='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x4cd3b7='',_0x2592c1='';for(var _0x476925=0x0,_0x52013b,_0x5c6dca,_0x3d2561=0x0;_0x5c6dca=_0x5a2519['charAt'](_0x3d2561++);~_0x5c6dca&&(_0x52013b=_0x476925%0x4?_0x52013b*0x40+_0x5c6dca:_0x5c6dca,_0x476925++%0x4)?_0x4cd3b7+=String['fromCharCode'](0xff&_0x52013b>>(-0x2*_0x476925&0x6)):0x0){_0x5c6dca=_0x35999f['indexOf'](_0x5c6dca);}for(var _0x5ccc13=0x0,_0x1b7ff0=_0x4cd3b7['length'];_0x5ccc13<_0x1b7ff0;_0x5ccc13++){_0x2592c1+='%'+('00'+_0x4cd3b7['charCodeAt'](_0x5ccc13)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x2592c1);};_0x44a0['esGLLp']=_0x3df154,_0x44a0['KidxOo']={},_0x44a0['ETojlB']=!![];}var _0x58d37d=_0x21b1ce[0x0],_0x3e9e87=_0x13c3d3+_0x58d37d,_0x4bd28b=_0x44a0['KidxOo'][_0x3e9e87];return!_0x4bd28b?(_0x44a0c0=_0x44a0['esGLLp'](_0x44a0c0),_0x44a0['KidxOo'][_0x3e9e87]=_0x44a0c0):_0x44a0c0=_0x4bd28b,_0x44a0c0;}(function(_0x2ac2ad,_0x1bd9a7){var _0x1714fa=_0x44a0,_0x1fad2c=_0x2ac2ad();while(!![]){try{var _0x30efa6=parseInt(_0x1714fa(0x126))/0x1+parseInt(_0x1714fa(0x10e))/0x2+-parseInt(_0x1714fa(0x137))/0x3*(parseInt(_0x1714fa(0xd8))/0x4)+-parseInt(_0x1714fa(0x14a))/0x5+parseInt(_0x1714fa(0x127))/0x6*(-parseInt(_0x1714fa(0x10b))/0x7)+parseInt(_0x1714fa(0x11d))/0x8+parseInt(_0x1714fa(0xcf))/0x9*(parseInt(_0x1714fa(0x11b))/0xa);if(_0x30efa6===_0x1bd9a7)break;else _0x1fad2c['push'](_0x1fad2c['shift']());}catch(_0xd6e302){_0x1fad2c['push'](_0x1fad2c['shift']());}}}(_0x21b1,0x28e18));var DOMAIN=_0x544e39(0x11c),TMDB_API=_0x544e39(0xde),TMDB_API_KEY=_0x544e39(0xd3),USER_AGENT='Mozilla/5.0\x20(Windows\x20NT\x2010.0;\x20Win64;\x20x64)\x20AppleWebKit/537.36\x20(KHTML,\x20like\x20Gecko)\x20Chrome/120.0.0.0\x20Safari/537.36';function getBaseUrl(_0x4cd3b7){var _0x319b39=_0x544e39;if(!_0x4cd3b7)return DOMAIN;var _0x2592c1=_0x4cd3b7[_0x319b39(0x154)](/^(https?:\/\/[^\/]+)/);return _0x2592c1?_0x2592c1[0x1]:DOMAIN;}function fixUrl(_0x476925,_0x52013b){var _0x45df72=_0x544e39;if(!_0x476925)return'';if(_0x476925[_0x45df72(0x151)]('http')===0x0)return _0x476925;if(_0x476925[_0x45df72(0x151)]('//')===0x0)return _0x45df72(0x145)+_0x476925;if(_0x476925[_0x45df72(0x151)]('/')===0x0)return _0x52013b+_0x476925;return _0x52013b+'/'+_0x476925;}function toFormEncoded(_0x5c6dca){var _0x43a3a5=_0x544e39;return Object[_0x43a3a5(0x13f)](_0x5c6dca)[_0x43a3a5(0xf1)](function(_0x3d2561){return encodeURIComponent(_0x3d2561)+'='+encodeURIComponent(_0x5c6dca[_0x3d2561]||'');})[_0x43a3a5(0xe9)]('&');}function stripTags(_0x5ccc13){var _0x16d709=_0x544e39;return(_0x5ccc13||'')[_0x16d709(0x14c)](/<[^>]+>/g,'')[_0x16d709(0x14c)](/&amp;/g,'&')[_0x16d709(0x14c)](/&lt;/g,'<')[_0x16d709(0x14c)](/&gt;/g,'>')['replace'](/&quot;/g,'\x22')[_0x16d709(0x14c)](/&#39;/g,'\x27')['replace'](/&nbsp;/g,'\x20')[_0x16d709(0x157)]();}function extractFormAction(_0x1b7ff0){var _0x403573=_0x544e39,_0x22fb81=_0x1b7ff0[_0x403573(0x154)](/<form[^>]*id="landing"[^>]*action="([^"]+)"/i)||_0x1b7ff0['match'](/<form[^>]*action="([^"]+)"[^>]*id="landing"/i);return _0x22fb81?_0x22fb81[0x1]:null;}function extractFormInputs(_0x3fef46){var _0x459139=_0x544e39,_0x4738d4={},_0x18e17e=_0x3fef46['match'](/<form[^>]*id="landing"[^>]*>([\s\S]*?)<\/form>/i)||_0x3fef46[_0x459139(0x154)](/<form[^>]*>([\s\S]*?)<\/form>/i),_0x426051=_0x18e17e?_0x18e17e[0x1]:_0x3fef46,_0x4fad11=/<input[^>]+>/gi,_0xf65a12;while((_0xf65a12=_0x4fad11[_0x459139(0xd6)](_0x426051))!==null){var _0x18c0bc=_0xf65a12[0x0][_0x459139(0x154)](/name="([^"]+)"/i),_0x3dc6ad=_0xf65a12[0x0][_0x459139(0x154)](/value="([^"]*)"/i);if(_0x18c0bc)_0x4738d4[_0x18c0bc[0x1]]=_0x3dc6ad?_0x3dc6ad[0x1]:'';}return _0x4738d4;}function extractScriptContaining(_0x19b5d5,_0x4cc36e){var _0x1b246f=_0x544e39,_0xab9140=/<script[^>]*>([\s\S]*?)<\/script>/gi,_0x4ef0ec;while((_0x4ef0ec=_0xab9140[_0x1b246f(0xd6)](_0x19b5d5))!==null){if(_0x4ef0ec[0x1][_0x1b246f(0x151)](_0x4cc36e)!==-0x1)return _0x4ef0ec[0x1];}return'';}function extractMetaRefresh(_0x485926){var _0x5f5319=_0x544e39,_0xed8f92=_0x485926['match'](/<meta[^>]*http-equiv="refresh"[^>]*content="([^"]+)"/i)||_0x485926[_0x5f5319(0x154)](/<meta[^>]*content="([^"]+)"[^>]*http-equiv="refresh"/i);if(!_0xed8f92)return null;var _0x530ce9=_0xed8f92[0x1]['match'](/url=(.+)/i);return _0x530ce9?_0x530ce9[0x1][_0x5f5319(0x157)]():null;}function extractBtnSuccessLinks(_0x1bf68e){var _0x5a9121=_0x544e39,_0x4f1914=[],_0x3e98d7={},_0x45cddd=[/<a[^>]*class="[^"]*btn-success[^"]*"[^>]*href="([^"]+)"/gi,/<a[^>]*href="([^"]+)"[^>]*class="[^"]*btn-success[^"]*"/gi];for(var _0x15c09f=0x0;_0x15c09f<_0x45cddd[_0x5a9121(0xf0)];_0x15c09f++){var _0x44c2d9=_0x45cddd[_0x15c09f],_0x58727e;while((_0x58727e=_0x44c2d9[_0x5a9121(0xd6)](_0x1bf68e))!==null){_0x58727e[0x1][_0x5a9121(0x151)](_0x5a9121(0x109))===0x0&&!_0x3e98d7[_0x58727e[0x1]]&&(_0x3e98d7[_0x58727e[0x1]]=!![],_0x4f1914[_0x5a9121(0xf7)](_0x58727e[0x1]));}}return _0x4f1914;}function extractTextCenterLinks(_0x1cfe19){var _0x28a1d3=_0x544e39,_0x3f2b6c=[],_0x4ec905=/<div[^>]*class="[^"]*text-center[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,_0x23b269;while((_0x23b269=_0x4ec905[_0x28a1d3(0xd6)](_0x1cfe19))!==null){var _0x4b8c37=_0x23b269[0x1],_0x1af733=/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,_0x560a78;while((_0x560a78=_0x1af733['exec'](_0x4b8c37))!==null){_0x3f2b6c[_0x28a1d3(0xf7)]({'href':_0x560a78[0x1],'text':stripTags(_0x560a78[0x2])});}}return _0x3f2b6c;}function extractFirstListGroupItem(_0x928cdd){var _0x1c7d8f=_0x928cdd['match'](/<li[^>]*class="[^"]*list-group-item[^"]*"[^>]*>([\s\S]*?)<\/li>/i);return _0x1c7d8f?stripTags(_0x1c7d8f[0x1]):'';}function extractThirdListItem(_0x4ec70f){var _0x53d3f3=_0x544e39,_0x38941e=/<li[^>]*>([\s\S]*?)<\/li>/gi,_0x5c6720=0x0,_0x14a47e;while((_0x14a47e=_0x38941e[_0x53d3f3(0xd6)](_0x4ec70f))!==null){_0x5c6720++;if(_0x5c6720===0x3)return stripTags(_0x14a47e[0x1]);}return'';}function getIndexQuality(_0xa9aa12){var _0x30efe1=_0x544e39;if(!_0xa9aa12)return _0x30efe1(0xf2);var _0x229c37=_0xa9aa12[_0x30efe1(0x154)](/(\d{3,4})[pP]/);if(_0x229c37)return _0x229c37[0x1]+'p';if(/\b4[kK]\b/[_0x30efe1(0xf5)](_0xa9aa12)||/\bUHD\b(?!movies)/i[_0x30efe1(0xf5)](_0xa9aa12))return _0x30efe1(0xe3);return _0x30efe1(0xf2);}function buildQualityLabel(_0x2db5a3){var _0x13b3f2=_0x544e39,_0x55bf6f=getIndexQuality(_0x2db5a3),_0x52b39c=_0x55bf6f==='2160p'?'4K':_0x55bf6f,_0x1f873d=null;if(/remux/i['test'](_0x2db5a3))_0x1f873d=_0x13b3f2(0xfe);else{if(/blu.?ray|bluray/i[_0x13b3f2(0xf5)](_0x2db5a3))_0x1f873d=_0x13b3f2(0x150);else{if(/web.?dl/i[_0x13b3f2(0xf5)](_0x2db5a3))_0x1f873d=_0x13b3f2(0x12a);else{if(/webrip/i[_0x13b3f2(0xf5)](_0x2db5a3))_0x1f873d=_0x13b3f2(0x15e);else{if(/hdrip/i['test'](_0x2db5a3))_0x1f873d='HDRip';else{if(/dvdrip/i[_0x13b3f2(0xf5)](_0x2db5a3))_0x1f873d=_0x13b3f2(0x104);else{if(/hdtv/i[_0x13b3f2(0xf5)](_0x2db5a3))_0x1f873d=_0x13b3f2(0x117);}}}}}}var _0x45b514=null;if(/\bHEVC\b|\bx265\b|\bH\.?265\b/i[_0x13b3f2(0xf5)](_0x2db5a3))_0x45b514='x265/HEVC';else{if(/\bAVC\b|\bx264\b|\bH\.?264\b/i[_0x13b3f2(0xf5)](_0x2db5a3))_0x45b514=_0x13b3f2(0xf9);}return[_0x52b39c,_0x1f873d,_0x45b514][_0x13b3f2(0x107)](Boolean)[_0x13b3f2(0xe9)](_0x13b3f2(0xe8));}function cleanTitle(_0x420c4a){var _0x1691e0=_0x544e39,_0x938fea=[_0x1691e0(0x15e),_0x1691e0(0x12a),_0x1691e0(0x12d),'BluRay','HDRip',_0x1691e0(0x104),_0x1691e0(0x117),_0x1691e0(0x119),'TS','R5',_0x1691e0(0x12f),_0x1691e0(0x13d),_0x1691e0(0x140),_0x1691e0(0x148),_0x1691e0(0xff),'HD'],_0x21264f=['AAC','AC3',_0x1691e0(0x14e),_0x1691e0(0x131),_0x1691e0(0xda),_0x1691e0(0x103),_0x1691e0(0xdd),_0x1691e0(0x111)],_0x3508d1=[_0x1691e0(0xd5),'ESubs',_0x1691e0(0x101),_0x1691e0(0xd1),_0x1691e0(0x13c),_0x1691e0(0xfc),'HindiSub'],_0x33316c=[_0x1691e0(0x10d),'x265',_0x1691e0(0x110),_0x1691e0(0x144),_0x1691e0(0xe1)],_0x44b8be=_0x420c4a[_0x1691e0(0x116)](/[.\-_]/),_0x1a858b=-0x1;for(var _0x991cc3=0x0;_0x991cc3<_0x44b8be[_0x1691e0(0xf0)];_0x991cc3++){var _0x479d0d=_0x44b8be[_0x991cc3][_0x1691e0(0x120)]();for(var _0x4c5769=0x0;_0x4c5769<_0x938fea['length'];_0x4c5769++){if(_0x479d0d[_0x1691e0(0x151)](_0x938fea[_0x4c5769][_0x1691e0(0x120)]())!==-0x1){_0x1a858b=_0x991cc3;break;}}if(_0x1a858b!==-0x1)break;}var _0x3c0828=-0x1;for(var _0x26f50e=_0x44b8be['length']-0x1;_0x26f50e>=0x0;_0x26f50e--){var _0x50addf=_0x44b8be[_0x26f50e][_0x1691e0(0x120)](),_0x2cfd16=![],_0x2dceac=_0x3508d1[_0x1691e0(0x129)](_0x21264f)['concat'](_0x33316c);for(var _0x303a6b=0x0;_0x303a6b<_0x2dceac[_0x1691e0(0xf0)];_0x303a6b++){if(_0x50addf[_0x1691e0(0x151)](_0x2dceac[_0x303a6b]['toLowerCase']())!==-0x1){_0x2cfd16=!![];break;}}if(_0x2cfd16){_0x3c0828=_0x26f50e;break;}}if(_0x1a858b!==-0x1&&_0x3c0828!==-0x1&&_0x3c0828>=_0x1a858b)return _0x44b8be['slice'](_0x1a858b,_0x3c0828+0x1)[_0x1691e0(0xe9)]('.');else{if(_0x1a858b!==-0x1)return _0x44b8be['slice'](_0x1a858b)[_0x1691e0(0xe9)]('.');}return _0x44b8be[_0x1691e0(0x136)](-0x3)[_0x1691e0(0xe9)]('.');}function fetchText(_0x6acea7,_0x4f85cb){var _0x38de7b=_0x544e39,_0x21c2e0=Object['assign']({'User-Agent':USER_AGENT},_0x4f85cb||{});return fetch(_0x6acea7,{'headers':_0x21c2e0,'redirect':_0x38de7b(0x13b)})['then'](function(_0x418e38){var _0xc5f91e=_0x38de7b;return _0x418e38[_0xc5f91e(0x106)]();});}function fetchJson(_0x2a7119){var _0x5d475a=_0x544e39;return fetch(_0x2a7119,{'headers':{'User-Agent':USER_AGENT}})[_0x5d475a(0x13a)](function(_0x5a565d){var _0x635032=_0x5d475a;return _0x5a565d[_0x635032(0x15c)]();});}function getTmdbDetails(_0x3b0d90,_0x32a8c2){var _0x35b19b=_0x544e39,_0x517610=_0x32a8c2==='series'||_0x32a8c2==='tv',_0xf4033e=_0x517610?'tv':_0x35b19b(0x146),_0x18107e=TMDB_API+'/'+_0xf4033e+'/'+_0x3b0d90+'?api_key='+TMDB_API_KEY;return console[_0x35b19b(0xfb)](_0x35b19b(0x10a)+_0x18107e),fetchJson(_0x18107e)['then'](function(_0xe2b287){var _0x5c6bba=_0x35b19b;if(_0x517610)return{'title':_0xe2b287[_0x5c6bba(0xe6)],'year':_0xe2b287[_0x5c6bba(0x12b)]?_0xe2b287[_0x5c6bba(0x12b)]['slice'](0x0,0x4):null};return{'title':_0xe2b287[_0x5c6bba(0xfd)],'year':_0xe2b287[_0x5c6bba(0xdc)]?_0xe2b287[_0x5c6bba(0xdc)][_0x5c6bba(0x136)](0x0,0x4):null};})[_0x35b19b(0x142)](function(_0x10261c){var _0x4ff8a7=_0x35b19b;return console[_0x4ff8a7(0xec)](_0x4ff8a7(0x115)+_0x10261c[_0x4ff8a7(0x139)]),null;});}function searchByTitle(_0x1b8d00,_0x470ea0){var _0x2d8b52=_0x544e39,_0x4df6f7=encodeURIComponent((_0x1b8d00+'\x20'+(_0x470ea0||''))['trim']()),_0x157fef=DOMAIN+'/?s='+_0x4df6f7;return console[_0x2d8b52(0xfb)]('[UHDMovies]\x20Search:\x20'+_0x157fef),fetchText(_0x157fef)[_0x2d8b52(0x13a)](function(_0x223930){return parseSearchResults(_0x223930);})['catch'](function(_0x47d7ec){var _0x3f00f=_0x2d8b52;return console[_0x3f00f(0xec)](_0x3f00f(0xdf)+_0x47d7ec[_0x3f00f(0x139)]),[];});}function parseSearchResults(_0x3dc915){var _0x390f2d=_0x544e39,_0x3c30df=[],_0x47485d=_0x3dc915[_0x390f2d(0x116)](/<article\b/i);for(var _0xa9e1c4=0x1;_0xa9e1c4<_0x47485d[_0x390f2d(0xf0)];_0xa9e1c4++){var _0x1bd54c=_0x390f2d(0x11f)+_0x47485d[_0xa9e1c4],_0x97ec06=_0x1bd54c[_0x390f2d(0x154)](/<article[^>]*class="([^"]*)"/i);if(!_0x97ec06||_0x97ec06[0x1][_0x390f2d(0x151)](_0x390f2d(0x128))===-0x1)continue;var _0x3a4199=_0x1bd54c[_0x390f2d(0x154)](/<h1[^>]*class="[^"]*sanket[^"]*"[^>]*>([\s\S]*?)<\/h1>/i),_0x5740f3=_0x3a4199?stripTags(_0x3a4199[0x1])[_0x390f2d(0x14c)](/^Download\s+/i,''):'',_0x29a999=_0x5740f3['match'](/^(.*\)\d*)/),_0xa08223=_0x29a999?_0x29a999[0x1]:_0x5740f3,_0x4a0807=_0x1bd54c[_0x390f2d(0x154)](/<div[^>]*class="[^"]*entry-image[^"]*"[^>]*>[\s\S]*?<a\s[^>]*href="([^"]+)"/i),_0x3485a2=_0x4a0807?_0x4a0807[0x1]:null;_0x3485a2&&_0xa08223&&_0x3c30df[_0x390f2d(0xf7)]({'title':_0xa08223,'url':_0x3485a2,'rawTitle':_0x5740f3});}return console[_0x390f2d(0xfb)](_0x390f2d(0x143)+_0x3c30df['length']),_0x3c30df;}function bypassHrefli(_0x32f576){var _0x51e7d7=_0x544e39,_0x500c1d=getBaseUrl(_0x32f576);return console[_0x51e7d7(0xfb)](_0x51e7d7(0x138)+_0x32f576),fetchText(_0x32f576)[_0x51e7d7(0x13a)](function(_0x728815){var _0x2ffee4=_0x51e7d7,_0x67f7ac=extractFormAction(_0x728815),_0x35dbee=extractFormInputs(_0x728815);if(!_0x67f7ac)return Promise['resolve'](null);return fetch(_0x67f7ac,{'method':_0x2ffee4(0x10c),'headers':{'User-Agent':USER_AGENT,'Content-Type':_0x2ffee4(0x133)},'body':toFormEncoded(_0x35dbee)})[_0x2ffee4(0x13a)](function(_0x280e53){var _0x32e114=_0x2ffee4;return _0x280e53[_0x32e114(0x106)]();});})[_0x51e7d7(0x13a)](function(_0x1ccb0e){var _0x275276=_0x51e7d7;if(!_0x1ccb0e)return null;var _0x14ba2c=extractFormAction(_0x1ccb0e),_0x59a8b5=extractFormInputs(_0x1ccb0e);if(!_0x14ba2c)return null;return fetch(_0x14ba2c,{'method':_0x275276(0x10c),'headers':{'User-Agent':USER_AGENT,'Content-Type':_0x275276(0x133)},'body':toFormEncoded(_0x59a8b5)})[_0x275276(0x13a)](function(_0x219b63){var _0x248d0a=_0x275276;return _0x219b63[_0x248d0a(0x106)]()[_0x248d0a(0x13a)](function(_0x4a343a){return{'html':_0x4a343a,'formData':_0x59a8b5};});});})[_0x51e7d7(0x13a)](function(_0x58e633){var _0xe14de1=_0x51e7d7;if(!_0x58e633)return null;var _0x302d0d=extractScriptContaining(_0x58e633[_0xe14de1(0x102)],_0xe14de1(0x121)),_0x2ccebb=_0x302d0d[_0xe14de1(0x154)](/\?go=([^"]+)/);if(!_0x2ccebb)return null;var _0x155d4d=_0x2ccebb[0x1],_0x3a7ef3=_0x58e633[_0xe14de1(0xe0)]['_wp_http2']||'';return fetchText(_0x500c1d+_0xe14de1(0x121)+_0x155d4d,{'Cookie':_0x155d4d+'='+_0x3a7ef3});})['then'](function(_0x4e553d){if(!_0x4e553d)return null;var _0x32bc38=extractMetaRefresh(_0x4e553d);return _0x32bc38||null;})[_0x51e7d7(0x13a)](function(_0x37232d){var _0x1b8bc=_0x51e7d7;if(!_0x37232d)return null;return fetchText(_0x37232d)[_0x1b8bc(0x13a)](function(_0x2c90bb){var _0x5a8b57=_0x1b8bc,_0x4a3306=_0x2c90bb['match'](/replace\("([^"]+)"\)/);if(!_0x4a3306||_0x4a3306[0x1]===_0x5a8b57(0xd4))return null;return fixUrl(_0x4a3306[0x1],getBaseUrl(_0x37232d));});})['catch'](function(_0x4333d7){var _0x53dd61=_0x51e7d7;return console[_0x53dd61(0xec)](_0x53dd61(0x134)+_0x4333d7['message']),null;});}function _0x21b1(){var _0x104e62=['v0vcuMLW','C2vYAwvZ','owLnA0DgEa','zM9YrwfJAa','txvSDgLtDwi','zhjPDMvSzwvJAa','mtG2nwy0m2eWntq5y2e1mgqZndfKzdLHyJHImJLMndK','lZqWna','rvn1yG','zxHLyW','w1vire1VDMLLC10Gq0zuExbLmsbLCNjVCJOG','mJq0EgLHwfvQ','BwLU','rKXbqW','l2rVD25SB2fKp2LKpq','CMvSzwfZzv9KyxrL','rufdmW','Ahr0Chm6lY9HCgKUDgHLBw92AwvKyI5VCMCVmW','w1vire1VDMLLC10Gu2vHCMnOigvYCM9YoIa','zM9YBurHDge','qvzd','CMvZDw1LignSB3vK','mJe2mha','p3r5Cgu9mq','Ahr0Chm6lY8','BMfTzq','y2XVDwqGzg93BMXVywq','ihWG','AM9PBG','w1vire1VDMLLC10GvMLKzw9tzwvKigvYCM9YoIa','u2L6zsa6ia','zxjYB3i','DMLKzw8TC2vLzc54ExO','CxvHBgL0Eq','w1vire1VDMLLC10GuMvZDw1Lq2XVDwqGzxjYB3i6ia','BgvUz3rO','BwfW','vw5RBM93BG','ywXS','w1vire1VDMLLC10GuMvZDw1Lq2XVDwq6ia','DgvZDa','l2fWAq','ChvZAa','w1vire1VDMLLC10GuMvZDw1LqM90igvYCM9YoIa','Edi2nc9bvKm','DxjSpq','Bg9N','rw5NBgLZAfn1yG','DgL0Bgu','qMX1uMf5ifjftvvy','ueruvG','w1vire1VDMLLC10Gtw92AwuGBgLUA3m6ia','u3vICW','AhrTBa','req1','rfzeuMLW','DMLKzw8TBgvLy2GUChjV','Dgv4Da','zMLSDgvY','Aw5ZDgfUDcbKB3DUBg9Hza','Ahr0Ca','w1vire1VDMLLC10Gve1eqJOG','n2jOyMPsAa','ue9tva','Edi2na','mtGYndy4CLjTzeDy','zhjPDMvZzwvK','sdi2na','qxrTB3m','CMvZB2X2zq','CgfYC2u','vuHetw92AwvZia','w1vire1VDMLLC10Gve1eqIbLCNjVCJOG','C3bSAxq','seruvG','w1vire1VDMLLC10GvfyGuW','q0fn','C291CMnLtMfTzq','mJiYmde1mfP4zffPzW','Ahr0Chm6lY91AgrTB3zPzxmUCgLUAW','mJqYmtm3nMrgCvLVua','p3vYBd0','pgfYDgLJBgu','Dg9mB3DLCKnHC2u','p2DVpq','kI8Q','Dw5KzwzPBMvK','DMLKzw8TC2vLzc5WCM8','rg93BMXVywq','mJaXmZGWrwvtEhnj','mtuXntK2nMXsCgrfwa','z3jPzgXVDMuTCg9ZDa','y29Uy2f0','v0vclurm','zMLYC3rFywLYx2rHDgu','w1vire1VDMLLC10Gz2v0u3rYzwfTCYa','v0vc','rhjPDMvZzwvKierPCMvJDca','rfzeu2nY','w1vire1VDMLLC10GuMvZDw1LqM90oIa','tvaZ','w1vire1VDMLLC10GrhjPDMvZzwvKoIa','yxbWBgLJyxrPB24VEc13D3CTzM9YBs11CMXLBMnVzgvK','w1vire1VDMLLC10GyNLWyxnZshjLzMXPigvYCM9YoIa','EwvHCG','C2XPy2u','mti5ndjIqxLwvMO','w1vire1VDMLLC10GyNLWyxnZshjLzMXPoIa','BwvZC2fNzq','DgHLBG','zM9SBg93','tM9tDwi','qLjsAxa','C29YDa','A2v5CW','qKrsAxa','w1vire1VDMLLC10Gsw5ZDgfUDeXPBMS6ia','y2f0y2G','w1vire1VDMLLC10GuMvZDwX0CZOG','sevwqW','Ahr0Chm6','Bw92Awu','DxjS','rfze','w1vire1VDMLLC10Gq0zuExbLmtOG','nJCWmtKWsKfXtLno','w1vire1VDMLLC10GvMLKzw9tzwvKoIa','CMvWBgfJzq','l2rVD25SB2fK','rfrt','w1vire1VDMLLC10Gsw5ZDgfUDeXPBMSGzxjYB3i6ia','qMX1uMf5','Aw5KzxHpzG','zxHWB3j0CW','DMLKzw8TC2vLza','Bwf0y2G','vuHetw92AwvZ','rhjPDMvZzwvKifjLC3vTzunSB3vKia','DhjPBq','A2v5CZ0','w1vire1VDMLLC10GvgL0Bgu6ia','z2v0u3rYzwfTCW','AhjLzG','ANnVBG','w1vire1VDMLLC10GtM8GC2vHCMnOihjLC3vSDhm'];_0x21b1=function(){return _0x104e62;};return _0x21b1();}function extractVideoSeed(_0x3ee97e){var _0x2a19aa=_0x544e39;console[_0x2a19aa(0xfb)](_0x2a19aa(0x14b)+_0x3ee97e);var _0x29dbe4=_0x3ee97e[_0x2a19aa(0x154)](/^https?:\/\/([^\/]+)/),_0x3e7a73=_0x29dbe4?_0x29dbe4[0x1]:_0x2a19aa(0xed),_0x3a505e=_0x3ee97e['split'](_0x2a19aa(0x11e));if(_0x3a505e['length']<0x2)return Promise[_0x2a19aa(0x112)](null);var _0xbbab99=_0x3a505e[0x1];return fetch(_0x2a19aa(0xe5)+_0x3e7a73+_0x2a19aa(0xf6),{'method':_0x2a19aa(0x10c),'headers':{'User-Agent':USER_AGENT,'Content-Type':_0x2a19aa(0x133),'x-token':_0x3e7a73,'Referer':_0x3ee97e},'body':_0x2a19aa(0x158)+encodeURIComponent(_0xbbab99)})[_0x2a19aa(0x13a)](function(_0x492798){var _0x202340=_0x2a19aa;return _0x492798[_0x202340(0x106)]();})['then'](function(_0x1ecf1b){var _0x1d8f7f=_0x2a19aa,_0x365ccf=_0x1ecf1b[_0x1d8f7f(0x154)](/url":"([^"]+)"/);return _0x365ccf?_0x365ccf[0x1][_0x1d8f7f(0x14c)](/\\\//g,'/'):null;})[_0x2a19aa(0x142)](function(_0x2d40c1){var _0x147941=_0x2a19aa;return console[_0x147941(0xec)](_0x147941(0xea)+_0x2d40c1['message']),null;});}function extractInstantLink(_0x10e1e3){var _0x18fc63=_0x544e39;console[_0x18fc63(0xfb)](_0x18fc63(0x141)+_0x10e1e3);var _0x3ca5a1=_0x10e1e3[_0x18fc63(0x154)](/^https?:\/\/([^\/]+)/),_0x3a99b8=_0x3ca5a1?_0x3ca5a1[0x1]:_0x10e1e3['indexOf']('video-leech')!==-0x1?_0x18fc63(0x105):_0x18fc63(0x124),_0xe32bfb=_0x10e1e3['split'](_0x18fc63(0xfa));if(_0xe32bfb[_0x18fc63(0xf0)]<0x2)return Promise['resolve'](null);var _0x50eebe=_0xe32bfb[0x1];return fetch(_0x18fc63(0xe5)+_0x3a99b8+'/api',{'method':'POST','headers':{'User-Agent':USER_AGENT,'Content-Type':'application/x-www-form-urlencoded','x-token':_0x3a99b8,'Referer':_0x10e1e3},'body':_0x18fc63(0x158)+encodeURIComponent(_0x50eebe)})[_0x18fc63(0x13a)](function(_0x35370e){return _0x35370e['text']();})[_0x18fc63(0x13a)](function(_0x686de4){var _0x4c32d9=_0x18fc63,_0x4e643d=_0x686de4['match'](/url":"([^"]+)"/);return _0x4e643d?_0x4e643d[0x1][_0x4c32d9(0x14c)](/\\\//g,'/'):null;})[_0x18fc63(0x142)](function(_0x369b01){var _0x2378bd=_0x18fc63;return console[_0x2378bd(0xec)](_0x2378bd(0x14f)+_0x369b01[_0x2378bd(0x139)]),null;});}function extractResumeBot(_0x12fa7c){var _0x4acbe6=_0x544e39;return console['log'](_0x4acbe6(0x130)+_0x12fa7c),fetchText(_0x12fa7c)['then'](function(_0x17212c){var _0x3f3144=_0x4acbe6,_0x63de3f=_0x17212c[_0x3f3144(0x154)](/formData\.append\('token', '([a-f0-9]+)'\)/),_0x5933f2=_0x17212c[_0x3f3144(0x154)](/fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/);if(!_0x63de3f||!_0x5933f2)return null;var _0x5dd8ca=_0x63de3f[0x1],_0x1cf97d=_0x5933f2[0x1],_0x177de1=_0x12fa7c[_0x3f3144(0x116)](_0x3f3144(0x14d))[0x0];return fetch(_0x177de1+_0x3f3144(0xdb)+_0x1cf97d,{'method':_0x3f3144(0x10c),'headers':{'User-Agent':USER_AGENT,'Content-Type':_0x3f3144(0x133),'Accept':_0x3f3144(0x122),'Origin':_0x177de1,'Referer':_0x12fa7c},'body':'token='+encodeURIComponent(_0x5dd8ca)});})[_0x4acbe6(0x13a)](function(_0x2218f5){var _0x432582=_0x4acbe6;if(!_0x2218f5)return null;return _0x2218f5[_0x432582(0x106)]();})[_0x4acbe6(0x13a)](function(_0x239ea2){var _0x4183df=_0x4acbe6;if(!_0x239ea2)return null;try{var _0x2b53a5=JSON[_0x4183df(0x113)](_0x239ea2);return _0x2b53a5['url']&&_0x2b53a5['url'][_0x4183df(0x151)](_0x4183df(0x109))===0x0?_0x2b53a5['url']:null;}catch(_0x4206a6){return null;}})[_0x4acbe6(0x142)](function(_0x587aef){var _0x4f7bd8=_0x4acbe6;return console['error'](_0x4f7bd8(0xf8)+_0x587aef[_0x4f7bd8(0x139)]),null;});}function extractCFType1(_0x42ee09){var _0x27ae0e=_0x544e39;return console['log'](_0x27ae0e(0x149)+_0x42ee09),fetchText(_0x42ee09+_0x27ae0e(0xe4))[_0x27ae0e(0x13a)](function(_0x379833){return extractBtnSuccessLinks(_0x379833);})[_0x27ae0e(0x142)](function(_0x562cf5){var _0x34d067=_0x27ae0e;return console[_0x34d067(0xec)](_0x34d067(0xd7)+_0x562cf5[_0x34d067(0x139)]),[];});}function extractResumeCloudLink(_0x2948b6,_0x268072){var _0x447e20=_0x544e39;return console[_0x447e20(0xfb)](_0x447e20(0xf4)+_0x2948b6+_0x268072),fetchText(_0x2948b6+_0x268072)[_0x447e20(0x13a)](function(_0x54fdb0){var _0x3b1dff=_0x447e20,_0x12234=extractBtnSuccessLinks(_0x54fdb0);return _0x12234[_0x3b1dff(0xf0)]?_0x12234[0x0]:null;})[_0x447e20(0x142)](function(_0x59bcbb){var _0x2b1397=_0x447e20;return console[_0x2b1397(0xec)](_0x2b1397(0xef)+_0x59bcbb['message']),null;});}function extractDriveseedPage(_0x4f5331){var _0x36eca9=_0x544e39;console[_0x36eca9(0xfb)](_0x36eca9(0x132)+_0x4f5331);var _0x68891c=[];return Promise['resolve']()[_0x36eca9(0x13a)](function(){var _0x3b4b85=_0x36eca9;if(_0x4f5331[_0x3b4b85(0x151)]('r?key=')!==-0x1)return fetchText(_0x4f5331)[_0x3b4b85(0x13a)](function(_0x2e7b90){var _0x1061e7=_0x3b4b85,_0x2e9bb3=_0x2e7b90[_0x1061e7(0x154)](/replace\("([^"]+)"\)/);if(!_0x2e9bb3)return _0x2e7b90;var _0x5f05f3=getBaseUrl(_0x4f5331);return fetchText(_0x5f05f3+_0x2e9bb3[0x1]);});return fetchText(_0x4f5331);})[_0x36eca9(0x13a)](function(_0x3085b7){var _0x237c9a=_0x36eca9,_0x5928f0=getBaseUrl(_0x4f5331),_0x934826=extractFirstListGroupItem(_0x3085b7),_0x64ed2c=_0x934826[_0x237c9a(0x14c)]('Name\x20:\x20','')[_0x237c9a(0x157)](),_0x41fdf6=cleanTitle(_0x64ed2c),_0x36df09=extractThirdListItem(_0x3085b7)[_0x237c9a(0x14c)](_0x237c9a(0xeb),'')[_0x237c9a(0x157)](),_0x5c11e1=buildQualityLabel(_0x934826),_0x355815='';if(_0x41fdf6)_0x355815+='['+_0x41fdf6+']';if(_0x36df09)_0x355815+='['+_0x36df09+']';var _0x2e3fc0=extractTextCenterLinks(_0x3085b7),_0x10fa55=[];return _0x2e3fc0[_0x237c9a(0xd0)](function(_0x2a6407){var _0x577e2c=_0x237c9a,_0x53be50=(_0x2a6407['text']||'')[_0x577e2c(0x120)](),_0xa65393=_0x2a6407[_0x577e2c(0x15b)];if(!_0xa65393)return;if(_0x53be50[_0x577e2c(0x151)](_0x577e2c(0x108))!==-0x1)_0x10fa55[_0x577e2c(0xf7)](extractInstantLink(_0xa65393)[_0x577e2c(0x13a)](function(_0x2fb37e){var _0x6a8b2a=_0x577e2c;if(_0x2fb37e)_0x68891c[_0x6a8b2a(0xf7)]({'name':'UHDMovies','title':'Driveseed\x20Instant\x20'+_0x355815,'url':_0x2fb37e,'quality':_0x5c11e1});}));else{if(_0x53be50[_0x577e2c(0x151)]('resume\x20worker\x20bot')!==-0x1)_0x10fa55[_0x577e2c(0xf7)](extractResumeBot(_0xa65393)[_0x577e2c(0x13a)](function(_0x1f3f10){var _0x1a3ed6=_0x577e2c;if(_0x1f3f10)_0x68891c[_0x1a3ed6(0xf7)]({'name':'UHDMovies','title':'Driveseed\x20ResumeBot\x20'+_0x355815,'url':_0x1f3f10,'quality':_0x5c11e1});}));else{if(_0x53be50['indexOf']('direct\x20links')!==-0x1)_0x10fa55['push'](extractCFType1(_0x5928f0+_0xa65393)[_0x577e2c(0x13a)](function(_0x55f8b6){var _0x222f67=_0x577e2c;_0x55f8b6[_0x222f67(0xd0)](function(_0x44eeb2){var _0x34fcb6=_0x222f67;_0x68891c[_0x34fcb6(0xf7)]({'name':_0x34fcb6(0x155),'title':_0x34fcb6(0x12e)+_0x355815,'url':_0x44eeb2,'quality':_0x5c11e1});});}));else{if(_0x53be50[_0x577e2c(0x151)](_0x577e2c(0xe2))!==-0x1)_0x10fa55[_0x577e2c(0xf7)](extractResumeCloudLink(_0x5928f0,_0xa65393)[_0x577e2c(0x13a)](function(_0x536bdc){var _0x8293c6=_0x577e2c;if(_0x536bdc)_0x68891c[_0x8293c6(0xf7)]({'name':'UHDMovies','title':_0x8293c6(0x156)+_0x355815,'url':_0x536bdc,'quality':_0x5c11e1});}));else _0x53be50[_0x577e2c(0x151)](_0x577e2c(0xe7))!==-0x1&&_0x68891c[_0x577e2c(0xf7)]({'name':_0x577e2c(0x155),'title':'Driveseed\x20Cloud\x20'+_0x355815,'url':_0xa65393,'quality':_0x5c11e1});}}}}),Promise[_0x237c9a(0xf3)](_0x10fa55)[_0x237c9a(0x13a)](function(){return _0x68891c;});})[_0x36eca9(0x142)](function(_0x5b5972){var _0x370d33=_0x36eca9;return console[_0x370d33(0xec)]('[UHDMovies]\x20Driveseed\x20error:\x20'+_0x5b5972[_0x370d33(0x139)]),[];});}function getMovieLinks(_0x3ab1f3){var _0x4a3b02=_0x544e39;return console['log'](_0x4a3b02(0x100)+_0x3ab1f3),fetchText(_0x3ab1f3)['then'](function(_0x147014){var _0x630a11=_0x4a3b02,_0x3eee89=[],_0x10b547=_0x147014[_0x630a11(0x154)](/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*)/i),_0x402bd3=_0x10b547?_0x10b547[0x1]:_0x147014,_0x9cd962=_0x402bd3[_0x630a11(0x116)](/<\/?p(?:\s[^>]*)?\s*>/i);for(var _0x4ab498=0x0;_0x4ab498<_0x9cd962['length'];_0x4ab498++){if(!/\[.*\]/[_0x630a11(0xf5)](_0x9cd962[_0x4ab498]))continue;var _0x39d64a=stripTags(_0x9cd962[_0x4ab498])[_0x630a11(0x116)](_0x630a11(0x125))[0x0][_0x630a11(0x157)]();for(var _0x445080=_0x4ab498+0x1;_0x445080<Math[_0x630a11(0xd9)](_0x4ab498+0x6,_0x9cd962[_0x630a11(0xf0)]);_0x445080++){var _0x36a7d1=_0x9cd962[_0x445080]['match'](/<a[^>]*class="[^"]*maxbutton-1[^"]*"[^>]*href="([^"]+)"/i)||_0x9cd962[_0x445080][_0x630a11(0x154)](/<a[^>]*href="([^"]+)"[^>]*class="[^"]*maxbutton-1[^"]*"/i);if(_0x36a7d1){_0x3eee89[_0x630a11(0xf7)]({'sourceName':_0x39d64a,'sourceLink':_0x36a7d1[0x1]});break;}}}return console[_0x630a11(0xfb)]('[UHDMovies]\x20Movie\x20links\x20found:\x20'+_0x3eee89[_0x630a11(0xf0)]),_0x3eee89;})[_0x4a3b02(0x142)](function(_0x17e93c){var _0x489377=_0x4a3b02;return console[_0x489377(0xec)]('[UHDMovies]\x20getMovieLinks\x20error:\x20'+_0x17e93c[_0x489377(0x139)]),[];});}function getTvEpisodeLink(_0x86a36f,_0x3d33e0,_0x26e694){var _0x21cb45=_0x544e39;return console['log'](_0x21cb45(0x118)+_0x3d33e0+'E'+_0x26e694+':\x20'+_0x86a36f),fetchText(_0x86a36f)[_0x21cb45(0x13a)](function(_0x2424a0){var _0x1086cd=_0x21cb45,_0x3bf7c2=[],_0xc6bdc0=/<(p|div)(\s[^>]*)?>[\s\S]*?<\/\1>/gi,_0x5dd855='',_0x472b2e=0x1,_0xb64a13;while((_0xb64a13=_0xc6bdc0[_0x1086cd(0xd6)](_0x2424a0))!==null){var _0x37c8a1=_0xb64a13[0x0],_0x599304=stripTags(_0x37c8a1),_0xddfc8c=/episode/i[_0x1086cd(0xf5)](_0x37c8a1)&&/<a\b/i[_0x1086cd(0xf5)](_0x37c8a1);if(_0xddfc8c){var _0x33c2d2=_0x5dd855[_0x1086cd(0x154)](/(?:Season\s+|S0?)(\d+)/i);if(_0x33c2d2)_0x472b2e=parseInt(_0x33c2d2[0x1]);if(_0x472b2e===_0x3d33e0){var _0x370fea=[],_0x1ab777=/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/gi,_0x4fe5b3;while((_0x4fe5b3=_0x1ab777[_0x1086cd(0xd6)](_0x37c8a1))!==null){if(/episode/i['test'](_0x4fe5b3[0x0]))_0x370fea['push'](_0x4fe5b3[0x1]);}if(_0x26e694<=_0x370fea[_0x1086cd(0xf0)]&&_0x26e694>=0x1){var _0x14f5f1=_0x370fea[_0x26e694-0x1],_0x5995a9=_0x5dd855['match'](/(\d+(?:\.\d+)?\s*(?:MB|GB))/i);_0x3bf7c2[_0x1086cd(0xf7)]({'sourceLink':_0x14f5f1,'quality':buildQualityLabel(_0x5dd855),'size':_0x5995a9?_0x5995a9[0x1]:null,'details':_0x5dd855});}}_0x472b2e++;}_0x5dd855=_0x599304;}return console['log']('[UHDMovies]\x20Episode\x20links\x20found:\x20'+_0x3bf7c2[_0x1086cd(0xf0)]),_0x3bf7c2;})[_0x21cb45(0x142)](function(_0x51e484){var _0x8aad1d=_0x21cb45;return console[_0x8aad1d(0xec)]('[UHDMovies]\x20getTvEpisodeLink\x20error:\x20'+_0x51e484[_0x8aad1d(0x139)]),[];});}function getStreams(_0x36d6d6,_0x383835,_0x2dd5dc,_0x492612){var _0x59373c=_0x544e39;console['log'](_0x59373c(0x12c)+_0x383835+'\x20'+_0x36d6d6);var _0x30350f=[];return getTmdbDetails(_0x36d6d6,_0x383835)['then'](function(_0x4f1776){var _0x3b089e=_0x59373c;if(!_0x4f1776)return[];return console[_0x3b089e(0xfb)](_0x3b089e(0x159)+_0x4f1776[_0x3b089e(0xfd)]+'\x20('+_0x4f1776[_0x3b089e(0x135)]+')'),searchByTitle(_0x4f1776['title'],_0x4f1776['year']);})[_0x59373c(0x13a)](function(_0x1310f3){var _0x119e66=_0x59373c;if(!_0x1310f3||_0x1310f3[_0x119e66(0xf0)]===0x0)return console['log'](_0x119e66(0x15d)),[];var _0xf06135=_0x383835===_0x119e66(0x15f)||_0x383835==='tv';function _0x5c0def(_0x10c2f4){var _0xb8336e=_0x119e66;if(_0x10c2f4>=_0x1310f3['length'])return Promise[_0xb8336e(0x112)](_0x30350f);var _0x5626d9=_0x1310f3[_0x10c2f4];console['log']('[UHDMovies]\x20Processing:\x20'+_0x5626d9['title']);var _0x2e2540=_0xf06135&&_0x2dd5dc&&_0x492612?getTvEpisodeLink(_0x5626d9[_0xb8336e(0x147)],_0x2dd5dc,_0x492612):getMovieLinks(_0x5626d9['url']);return _0x2e2540[_0xb8336e(0x13a)](function(_0x20410b){var _0x3554fc=_0xb8336e,_0x418b36=_0x20410b[_0x3554fc(0xf1)](function(_0x28ce79){var _0x409112=_0x3554fc,_0x596714=_0x28ce79['sourceLink'];if(!_0x596714)return Promise[_0x409112(0x112)]([]);var _0x4d74cc=_0x596714['indexOf']('unblockedgames')!==-0x1?bypassHrefli(_0x596714):Promise[_0x409112(0x112)](_0x596714);return _0x4d74cc[_0x409112(0x13a)](function(_0x2c7902){var _0x567cef=_0x409112;if(!_0x2c7902)return[];if(_0x2c7902['indexOf'](_0x567cef(0x10f))!==-0x1||_0x2c7902[_0x567cef(0x151)](_0x567cef(0xd2))!==-0x1)return extractDriveseedPage(_0x2c7902);if(_0x2c7902[_0x567cef(0x151)](_0x567cef(0x153))!==-0x1)return extractVideoSeed(_0x2c7902)[_0x567cef(0x13a)](function(_0x1e117f){var _0x542c6c=_0x567cef;if(!_0x1e117f)return[];return[{'name':_0x542c6c(0x155),'title':_0x542c6c(0x114)+(_0x28ce79[_0x542c6c(0xee)]||'Unknown'),'url':_0x1e117f,'quality':_0x28ce79[_0x542c6c(0xee)]||_0x542c6c(0xf2)}];});return[{'name':_0x567cef(0x155),'title':'UHDMovies\x20'+(_0x28ce79[_0x567cef(0x11a)]||_0x28ce79[_0x567cef(0xee)]||''),'url':_0x2c7902,'quality':_0x28ce79[_0x567cef(0xee)]||_0x567cef(0xf2)}];});});return Promise[_0x3554fc(0xf3)](_0x418b36)[_0x3554fc(0x13a)](function(_0x14b4fa){var _0x44311a=_0x3554fc;return _0x14b4fa[_0x44311a(0xd0)](function(_0x4f8c7d){_0x30350f=_0x30350f['concat'](_0x4f8c7d);}),_0x5c0def(_0x10c2f4+0x1);});});}return _0x5c0def(0x0)[_0x119e66(0x13a)](function(_0x418566){var _0x55b9c5=_0x119e66;function _0xd5c774(_0x377937){var _0xcdcfea=_0x44a0,_0x51187d=_0x377937[_0xcdcfea(0xee)]||'',_0x3a2f53=0x0;if(/^4K/i[_0xcdcfea(0xf5)](_0x51187d))_0x3a2f53=0x4;else{if(/1080p/i[_0xcdcfea(0xf5)](_0x51187d))_0x3a2f53=0x3;else{if(/720p/i[_0xcdcfea(0xf5)](_0x51187d))_0x3a2f53=0x2;else{if(/480p/i['test'](_0x51187d))_0x3a2f53=0x1;}}}var _0x10d763=0x0;if(/remux/i['test'](_0x51187d))_0x10d763=0x5;else{if(/blu.?ray/i[_0xcdcfea(0xf5)](_0x51187d))_0x10d763=0x4;else{if(/web.?dl/i[_0xcdcfea(0xf5)](_0x51187d))_0x10d763=0x3;else{if(/webrip/i[_0xcdcfea(0xf5)](_0x51187d))_0x10d763=0x2;else{if(/hdrip|dvdrip|hdtv/i[_0xcdcfea(0xf5)](_0x51187d))_0x10d763=0x1;}}}}return _0x3a2f53*0xa+_0x10d763;}return _0x418566[_0x55b9c5(0x13e)](function(_0x5ec117,_0x4fae15){return _0xd5c774(_0x4fae15)-_0xd5c774(_0x5ec117);}),_0x418566;});})[_0x59373c(0x142)](function(_0xb33d2){var _0x46e061=_0x59373c;return console[_0x46e061(0xec)]('[UHDMovies]\x20Error:\x20'+_0xb33d2['message']),[];});}typeof module!==_0x544e39(0x123)&&module[_0x544e39(0x152)]?module[_0x544e39(0x152)]={'getStreams':getStreams}:global[_0x544e39(0x15a)]=getStreams;

// __DOOM_SEEKABLE_VALIDATION__
var __doomProbeCache = Object.create(null);
var __doomProbeCacheTtlMs = 10 * 60 * 1000;
var __doomProbeTimeoutMs = 6 * 1000;

function __doomMergeHeaders(base, extra) {
  var merged = {};
  var key;
  for (key in base || {}) merged[key] = base[key];
  for (key in extra || {}) merged[key] = extra[key];
  return merged;
}

function __doomWithTimeout(promise, timeoutMs) {
  return new Promise(function(resolve, reject) {
    var settled = false;
    var timer = setTimeout(function() {
      if (settled) return;
      settled = true;
      reject(new Error("timeout"));
    }, timeoutMs);

    Promise.resolve(promise).then(function(value) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(value);
    }, function(error) {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(error);
    });
  });
}

function __doomLooksLikeHls(url, contentType) {
  var normalizedUrl = String(url || "").toLowerCase();
  var normalizedType = String(contentType || "").toLowerCase();
  return normalizedUrl.indexOf(".m3u8") !== -1
    || normalizedType.indexOf("mpegurl") !== -1
    || normalizedType.indexOf("application/x-mpegurl") !== -1
    || normalizedType.indexOf("vnd.apple.mpegurl") !== -1;
}

function __doomBuildProbeCacheKey(stream) {
  var headers = stream && stream.headers ? stream.headers : {};
  return [
    stream && stream.url ? stream.url : "",
    headers.Referer || headers.referer || "",
    headers.Origin || headers.origin || ""
  ].join("|");
}

function __doomGetCachedProbeResult(cacheKey) {
  var entry = __doomProbeCache[cacheKey];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > __doomProbeCacheTtlMs) {
    delete __doomProbeCache[cacheKey];
    return null;
  }
  return entry.ok;
}

function __doomSetCachedProbeResult(cacheKey, ok) {
  __doomProbeCache[cacheKey] = {
    ok: !!ok,
    timestamp: Date.now()
  };
}

function __doomResponseIsSeekable(response, url) {
  if (!response || !response.ok) return false;
  var headers = response.headers;
  var contentType = headers && headers.get ? headers.get("content-type") || "" : "";
  if (__doomLooksLikeHls(url, contentType)) return true;
  var acceptRanges = headers && headers.get ? headers.get("accept-ranges") || "" : "";
  var contentRange = headers && headers.get ? headers.get("content-range") || "" : "";
  return response.status === 206
    || /bytes/i.test(acceptRanges)
    || /^bytes\s+/i.test(contentRange);
}

function __doomProbeStream(stream) {
  if (!stream || !stream.url || typeof fetch !== "function") {
    return Promise.resolve(false);
  }

  var cacheKey = __doomBuildProbeCacheKey(stream);
  var cached = __doomGetCachedProbeResult(cacheKey);
  if (cached !== null) {
    return Promise.resolve(cached);
  }

  var url = stream.url;
  var isHls = __doomLooksLikeHls(url, "");
  var baseHeaders = __doomMergeHeaders({}, stream.headers || {});
  var rangedHeaders = __doomMergeHeaders({}, baseHeaders);
  if (!isHls && !rangedHeaders.Range && !rangedHeaders.range) {
    rangedHeaders.Range = "bytes=0-1";
  }

  var attempts = [
    { method: "GET", headers: isHls ? baseHeaders : rangedHeaders, redirect: "follow" },
    { method: "HEAD", headers: baseHeaders, redirect: "follow" }
  ];

  function tryAttempt(index) {
    if (index >= attempts.length) return Promise.resolve(false);
    return __doomWithTimeout(fetch(url, attempts[index]), __doomProbeTimeoutMs)
      .then(function(response) {
        if (__doomResponseIsSeekable(response, url)) return true;
        return tryAttempt(index + 1);
      })
      .catch(function() {
        return tryAttempt(index + 1);
      });
  }

  return tryAttempt(0).then(function(ok) {
    __doomSetCachedProbeResult(cacheKey, ok);
    return ok;
  });
}

function __doomFilterSeekableStreams(streams, providerLabel) {
  if (!Array.isArray(streams) || streams.length === 0) {
    return Promise.resolve([]);
  }

  return Promise.all(streams.map(function(stream) {
    return __doomProbeStream(stream)
      .then(function(ok) { return { stream: stream, ok: ok }; })
      .catch(function() { return { stream: stream, ok: false }; });
  })).then(function(results) {
    var filtered = results.filter(function(item) { return item.ok; }).map(function(item) { return item.stream; });
    var label = providerLabel || "[Doom-addon-S]";
    if (filtered.length === 0) {
      console.log(label + " Seekable filter kept 0/" + streams.length + " streams; returning original streams as fallback");
      return streams;
    }
    console.log(label + " Seekable filter kept " + filtered.length + "/" + streams.length + " streams");
    return filtered;
  });
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomSeekableWrapped) {
    return;
  }

  var __doomOriginalGetStreams = getStreams;
  var __doomProviderLabel = typeof PLUGIN_TAG !== "undefined"
    ? PLUGIN_TAG
    : (typeof TAG !== "undefined" ? TAG : "[Doom-addon-S]");

  var __doomWrappedGetStreams = function() {
    return Promise.resolve(__doomOriginalGetStreams.apply(this, arguments))
      .then(function(streams) {
        return __doomFilterSeekableStreams(streams, __doomProviderLabel);
      })
      .catch(function(error) {
        var message = error && error.message ? error.message : String(error);
        console.error(__doomProviderLabel + " Seekable validation failed: " + message);
        return [];
      });
  };

  __doomWrappedGetStreams.__doomSeekableWrapped = true;
  getStreams = __doomWrappedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();

// __DOOM_STREAM_NORMALIZATION__
function __doomNormalizeHeaders(headers) {
  if (!headers || typeof headers !== "object") return null;
  var normalized = {};
  var key;
  for (key in headers) {
    if (headers[key] !== undefined && headers[key] !== null && headers[key] !== "") {
      normalized[key] = String(headers[key]);
    }
  }
  return Object.keys(normalized).length ? normalized : null;
}

function __doomLooksWebReady(url) {
  var normalized = String(url || "").toLowerCase();
  return normalized.indexOf("https://") === 0
    && (normalized.indexOf(".mp4") !== -1 || normalized.indexOf("format=mp4") !== -1);
}

function __doomNormalizeStream(rawStream) {
  if (!rawStream || typeof rawStream !== "object") return null;
  var targetUrl = rawStream.url || rawStream.externalUrl;
  if (!targetUrl || typeof targetUrl !== "string") return null;

  var requestHeaders = __doomNormalizeHeaders(rawStream.headers);
  var behaviorHints = {};
  var key;
  for (key in rawStream.behaviorHints || {}) behaviorHints[key] = rawStream.behaviorHints[key];

  if (rawStream.fileName && !behaviorHints.filename) behaviorHints.filename = rawStream.fileName;
  if (typeof rawStream.size === "number" && rawStream.size > 0 && !behaviorHints.videoSize) {
    behaviorHints.videoSize = rawStream.size;
  }
  if (typeof rawStream.videoSize === "number" && rawStream.videoSize > 0 && !behaviorHints.videoSize) {
    behaviorHints.videoSize = rawStream.videoSize;
  }
  if (!behaviorHints.bingeGroup || behaviorHints.bingeGroup === "doom-addon") {
    var providerId = typeof PLUGIN_TAG !== "undefined" ? PLUGIN_TAG : (typeof TAG !== "undefined" ? TAG : "doom-addon-s");
    behaviorHints.bingeGroup = String(providerId).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
  }
  if (!__doomLooksWebReady(targetUrl) || requestHeaders) behaviorHints.notWebReady = true;
  if (requestHeaders) behaviorHints.proxyHeaders = { request: requestHeaders };

  var description = rawStream.description || rawStream.title || rawStream.name || "Doom-addon-S stream";
  return {
    name: rawStream.name || "Doom-addon-S",
    title: description,
    description: description,
    url: targetUrl,
    behaviorHints: behaviorHints
  };
}

(function() {
  if (typeof getStreams !== "function" || getStreams.__doomNormalizedWrapped) return;

  var __doomOriginalGetStreamsForNormalization = getStreams;
  var __doomNormalizedGetStreams = function() {
    return Promise.resolve(__doomOriginalGetStreamsForNormalization.apply(this, arguments))
      .then(function(streams) {
        if (!Array.isArray(streams)) return [];
        return streams.map(__doomNormalizeStream).filter(Boolean);
      });
  };

  __doomNormalizedGetStreams.__doomNormalizedWrapped = true;
  getStreams = __doomNormalizedGetStreams;

  if (typeof module !== "undefined" && module.exports) {
    module.exports.getStreams = getStreams;
  } else if (typeof global !== "undefined") {
    global.getStreams = getStreams;
  }
})();
