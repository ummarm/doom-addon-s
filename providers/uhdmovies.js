'use strict';var _0x1d606f=_0x39ce;(function(_0x27b21a,_0x467c3c){var _0x509220={_0x153ffc:0x1e9,_0x103092:0x217},_0x269592=_0x39ce,_0x9fdaef=_0x27b21a();while(!![]){try{var _0x24b798=parseInt(_0x269592(_0x509220._0x153ffc))/0x1*(-parseInt(_0x269592(0x229))/0x2)+parseInt(_0x269592(_0x509220._0x103092))/0x3*(parseInt(_0x269592(0x20b))/0x4)+-parseInt(_0x269592(0x21e))/0x5+parseInt(_0x269592(0x221))/0x6+parseInt(_0x269592(0x21f))/0x7+-parseInt(_0x269592(0x211))/0x8*(-parseInt(_0x269592(0x214))/0x9)+-parseInt(_0x269592(0x1d8))/0xa;if(_0x24b798===_0x467c3c)break;else _0x9fdaef['push'](_0x9fdaef['shift']());}catch(_0x4a4566){_0x9fdaef['push'](_0x9fdaef['shift']());}}}(_0x15bb,0x1bdb4));var DOMAIN='https://uhdmovies.pink',TMDB_API=_0x1d606f(0x203),TMDB_API_KEY='1865f43a0549ca50d341dd9ab8b29f49',USER_AGENT=_0x1d606f(0x206);function getBaseUrl(_0x1b5947){var _0x40f2d5={_0x1eef8f:0x220},_0x508271=_0x1d606f;if(!_0x1b5947)return DOMAIN;var _0x3a9820=_0x1b5947[_0x508271(_0x40f2d5._0x1eef8f)](/^(https?:\/\/[^\/]+)/);return _0x3a9820?_0x3a9820[0x1]:DOMAIN;}function fixUrl(_0x21c719,_0x20e962){var _0x2404ae={_0x5bc839:0x209,_0x1ee145:0x228,_0x372bdf:0x209},_0x4b74c1=_0x1d606f;if(!_0x21c719)return'';if(_0x21c719[_0x4b74c1(_0x2404ae._0x5bc839)](_0x4b74c1(0x22e))===0x0)return _0x21c719;if(_0x21c719[_0x4b74c1(0x209)]('//')===0x0)return _0x4b74c1(_0x2404ae._0x1ee145)+_0x21c719;if(_0x21c719[_0x4b74c1(_0x2404ae._0x372bdf)]('/')===0x0)return _0x20e962+_0x21c719;return _0x20e962+'/'+_0x21c719;}function toFormEncoded(_0x3b0a95){var _0x595e6f=_0x1d606f;return Object[_0x595e6f(0x20d)](_0x3b0a95)['map'](function(_0x2158ed){return encodeURIComponent(_0x2158ed)+'='+encodeURIComponent(_0x3b0a95[_0x2158ed]||'');})[_0x595e6f(0x21b)]('&');}function stripTags(_0x2abdd5){var _0x335588={_0x74d456:0x210,_0x369605:0x1f8},_0xa681e8=_0x1d606f;return(_0x2abdd5||'')[_0xa681e8(0x210)](/<[^>]+>/g,'')['replace'](/&amp;/g,'&')['replace'](/&lt;/g,'<')[_0xa681e8(_0x335588._0x74d456)](/&gt;/g,'>')[_0xa681e8(0x210)](/&quot;/g,'\x22')['replace'](/&#39;/g,'\x27')['replace'](/&nbsp;/g,'\x20')[_0xa681e8(_0x335588._0x369605)]();}function extractFormAction(_0x214ce4){var _0x3fb33c={_0x1d6700:0x220},_0x5356a4=_0x1d606f,_0x3b86c6=_0x214ce4['match'](/<form[^>]*id="landing"[^>]*action="([^"]+)"/i)||_0x214ce4[_0x5356a4(_0x3fb33c._0x1d6700)](/<form[^>]*action="([^"]+)"[^>]*id="landing"/i);return _0x3b86c6?_0x3b86c6[0x1]:null;}function extractFormInputs(_0x241cea){var _0x465d68={_0x5bc3dd:0x220},_0x4facdb=_0x1d606f,_0x382954={},_0x375764=_0x241cea['match'](/<form[^>]*id="landing"[^>]*>([\s\S]*?)<\/form>/i)||_0x241cea[_0x4facdb(0x220)](/<form[^>]*>([\s\S]*?)<\/form>/i),_0x49f108=_0x375764?_0x375764[0x1]:_0x241cea,_0x182072=/<input[^>]+>/gi,_0x1ae28c;while((_0x1ae28c=_0x182072['exec'](_0x49f108))!==null){var _0x2c7a59=_0x1ae28c[0x0][_0x4facdb(_0x465d68._0x5bc3dd)](/name="([^"]+)"/i),_0x51d7e2=_0x1ae28c[0x0]['match'](/value="([^"]*)"/i);if(_0x2c7a59)_0x382954[_0x2c7a59[0x1]]=_0x51d7e2?_0x51d7e2[0x1]:'';}return _0x382954;}function extractScriptContaining(_0x4d706f,_0x54cd9e){var _0x40125f={_0x2ea4d6:0x1cd},_0x3959aa=_0x1d606f,_0x42a537=/<script[^>]*>([\s\S]*?)<\/script>/gi,_0x522c7d;while((_0x522c7d=_0x42a537[_0x3959aa(_0x40125f._0x2ea4d6)](_0x4d706f))!==null){if(_0x522c7d[0x1]['indexOf'](_0x54cd9e)!==-0x1)return _0x522c7d[0x1];}return'';}function extractMetaRefresh(_0x112988){var _0x136448={_0x45387a:0x1f8},_0x5d7864=_0x1d606f,_0x115d78=_0x112988[_0x5d7864(0x220)](/<meta[^>]*http-equiv="refresh"[^>]*content="([^"]+)"/i)||_0x112988['match'](/<meta[^>]*content="([^"]+)"[^>]*http-equiv="refresh"/i);if(!_0x115d78)return null;var _0xdfb20f=_0x115d78[0x1]['match'](/url=(.+)/i);return _0xdfb20f?_0xdfb20f[0x1][_0x5d7864(_0x136448._0x45387a)]():null;}function extractBtnSuccessLinks(_0x46fec0){var _0x197b5f=_0x1d606f,_0xfb91b4=[],_0x56560f={},_0x12ae4f=[/<a[^>]*class="[^"]*btn-success[^"]*"[^>]*href="([^"]+)"/gi,/<a[^>]*href="([^"]+)"[^>]*class="[^"]*btn-success[^"]*"/gi];for(var _0x54232a=0x0;_0x54232a<_0x12ae4f['length'];_0x54232a++){var _0x5687c4=_0x12ae4f[_0x54232a],_0x2e8119;while((_0x2e8119=_0x5687c4['exec'](_0x46fec0))!==null){_0x2e8119[0x1]['indexOf']('http')===0x0&&!_0x56560f[_0x2e8119[0x1]]&&(_0x56560f[_0x2e8119[0x1]]=!![],_0xfb91b4[_0x197b5f(0x1d6)](_0x2e8119[0x1]));}}return _0xfb91b4;}function extractTextCenterLinks(_0x52542c){var _0x356d98=[],_0x5ba6e4=/<div[^>]*class="[^"]*text-center[^"]*"[^>]*>([\s\S]*?)<\/div>/gi,_0x59ce6b;while((_0x59ce6b=_0x5ba6e4['exec'](_0x52542c))!==null){var _0x5085d5=_0x59ce6b[0x1],_0x336544=/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi,_0x5bacdf;while((_0x5bacdf=_0x336544['exec'](_0x5085d5))!==null){_0x356d98['push']({'href':_0x5bacdf[0x1],'text':stripTags(_0x5bacdf[0x2])});}}return _0x356d98;}function extractFirstListGroupItem(_0xf505ee){var _0x4a08c5=_0x1d606f,_0x4a8f77=_0xf505ee[_0x4a08c5(0x220)](/<li[^>]*class="[^"]*list-group-item[^"]*"[^>]*>([\s\S]*?)<\/li>/i);return _0x4a8f77?stripTags(_0x4a8f77[0x1]):'';}function extractSizeFromHtml(_0x6a3ff0){var _0x27a4ec={_0x12d6a3:0x209,_0x6fe7f:0x21c,_0x4b0b4e:0x210},_0x4c2134=_0x1d606f,_0x38b2c5=/<li[^>]*>([\s\S]*?)<\/li>/gi,_0x566e31;while((_0x566e31=_0x38b2c5[_0x4c2134(0x1cd)](_0x6a3ff0))!==null){var _0x23d1ef=stripTags(_0x566e31[0x1]);if(_0x23d1ef[_0x4c2134(_0x27a4ec._0x12d6a3)](_0x4c2134(_0x27a4ec._0x6fe7f))!==-0x1||_0x23d1ef[_0x4c2134(0x209)](_0x4c2134(0x1e6))!==-0x1)return _0x23d1ef[_0x4c2134(_0x27a4ec._0x4b0b4e)](/Size\s*:\s*/i,'')['trim']();}return'';}function getIndexQuality(_0xf78d4b){var _0x40de89={_0x89570e:0x1f2,_0xe3bea5:0x20f},_0x54f563=_0x1d606f;if(!_0xf78d4b)return _0x54f563(_0x40de89._0x89570e);var _0x5677a7=_0xf78d4b['match'](/(\d{3,4})[pP]/);if(_0x5677a7)return _0x5677a7[0x1]+'p';if(/\b4[kK]\b/[_0x54f563(_0x40de89._0xe3bea5)](_0xf78d4b)||/\bUHD\b(?!movies)/i['test'](_0xf78d4b))return _0x54f563(0x1e8);return _0x54f563(_0x40de89._0x89570e);}function buildQualityLabel(_0x91cde4){var _0x1a1ff0={_0x282ee3:0x20f,_0x25864c:0x1ee,_0x54a40e:0x216,_0x124144:0x21b},_0x3d20a1=_0x1d606f,_0x17a21d=getIndexQuality(_0x91cde4),_0x3f19e4=_0x17a21d==='2160p'?'4K':_0x17a21d,_0x12ef68=null;if(/remux/i[_0x3d20a1(_0x1a1ff0._0x282ee3)](_0x91cde4))_0x12ef68='BluRay\x20REMUX';else{if(/blu.?ray|bluray/i['test'](_0x91cde4))_0x12ef68=_0x3d20a1(0x1e3);else{if(/web.?dl/i[_0x3d20a1(0x20f)](_0x91cde4))_0x12ef68=_0x3d20a1(_0x1a1ff0._0x25864c);else{if(/webrip/i[_0x3d20a1(_0x1a1ff0._0x282ee3)](_0x91cde4))_0x12ef68='WEBRip';else{if(/hdrip/i[_0x3d20a1(_0x1a1ff0._0x282ee3)](_0x91cde4))_0x12ef68=_0x3d20a1(_0x1a1ff0._0x54a40e);else{if(/dvdrip/i[_0x3d20a1(0x20f)](_0x91cde4))_0x12ef68=_0x3d20a1(0x1ec);else{if(/hdtv/i[_0x3d20a1(0x20f)](_0x91cde4))_0x12ef68='HDTV';}}}}}}var _0x494c0e=null;if(/\bHEVC\b|\bx265\b|\bH\.?265\b/i[_0x3d20a1(0x20f)](_0x91cde4))_0x494c0e='x265/HEVC';else{if(/\bAVC\b|\bx264\b|\bH\.?264\b/i['test'](_0x91cde4))_0x494c0e='x264/AVC';}return[_0x3f19e4,_0x12ef68,_0x494c0e]['filter'](Boolean)[_0x3d20a1(_0x1a1ff0._0x124144)]('\x20|\x20');}function fetchText(_0x4056aa,_0x335fa9){var _0x55b786={_0x295235:0x202,_0x592c87:0x1e2},_0x2ae54a={_0x4651e9:0x1ea},_0x77651c=_0x1d606f,_0x3b4647=Object['assign']({'User-Agent':USER_AGENT},_0x335fa9||{});return fetch(_0x4056aa,{'headers':_0x3b4647,'redirect':_0x77651c(_0x55b786._0x295235)})[_0x77651c(_0x55b786._0x592c87)](function(_0x46aa7e){var _0x2cda7d=_0x77651c;return _0x46aa7e[_0x2cda7d(_0x2ae54a._0x4651e9)]();});}function fetchJson(_0x9631c4){var _0x4e4507=_0x1d606f;return fetch(_0x9631c4,{'headers':{'User-Agent':USER_AGENT}})[_0x4e4507(0x1e2)](function(_0x224131){return _0x224131['json']();});}function getTmdbDetails(_0x17a656,_0x5cfeb8){var _0x4e0aa7={_0x5c6026:0x1fb,_0x228788:0x1ce},_0x290086={_0x159bf4:0x22b},_0x9336f8=_0x1d606f,_0x296a0b=_0x5cfeb8==='series'||_0x5cfeb8==='tv',_0x1e29d8=_0x296a0b?'tv':_0x9336f8(0x204),_0x5db167=TMDB_API+'/'+_0x1e29d8+'/'+_0x17a656+'?api_key='+TMDB_API_KEY;return console[_0x9336f8(0x205)](_0x9336f8(_0x4e0aa7._0x5c6026)+_0x5db167),fetchJson(_0x5db167)[_0x9336f8(0x1e2)](function(_0x3119f5){var _0x40c6ab=_0x9336f8;if(_0x296a0b)return{'title':_0x3119f5[_0x40c6ab(0x219)],'year':_0x3119f5[_0x40c6ab(_0x290086._0x159bf4)]?_0x3119f5[_0x40c6ab(0x22b)][_0x40c6ab(0x1d2)](0x0,0x4):null};return{'title':_0x3119f5['title'],'year':_0x3119f5[_0x40c6ab(0x1d4)]?_0x3119f5['release_date'][_0x40c6ab(0x1d2)](0x0,0x4):null};})[_0x9336f8(_0x4e0aa7._0x228788)](function(_0x3d249a){var _0x4e5ef8=_0x9336f8;return console[_0x4e5ef8(0x1d1)]('[UHDMovies]\x20TMDB\x20error:\x20'+_0x3d249a['message']),null;});}function _0x39ce(_0xd9144b,_0x2f3d0c){_0xd9144b=_0xd9144b-0x1cc;var _0x15bb4c=_0x15bb();var _0x39ce00=_0x15bb4c[_0xd9144b];if(_0x39ce['FPmauG']===undefined){var _0x4f239e=function(_0x175193){var _0x4f323e='abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=';var _0x1b5947='',_0x3a9820='';for(var _0x21c719=0x0,_0x20e962,_0x3b0a95,_0x2158ed=0x0;_0x3b0a95=_0x175193['charAt'](_0x2158ed++);~_0x3b0a95&&(_0x20e962=_0x21c719%0x4?_0x20e962*0x40+_0x3b0a95:_0x3b0a95,_0x21c719++%0x4)?_0x1b5947+=String['fromCharCode'](0xff&_0x20e962>>(-0x2*_0x21c719&0x6)):0x0){_0x3b0a95=_0x4f323e['indexOf'](_0x3b0a95);}for(var _0x2abdd5=0x0,_0x214ce4=_0x1b5947['length'];_0x2abdd5<_0x214ce4;_0x2abdd5++){_0x3a9820+='%'+('00'+_0x1b5947['charCodeAt'](_0x2abdd5)['toString'](0x10))['slice'](-0x2);}return decodeURIComponent(_0x3a9820);};_0x39ce['sHWHCK']=_0x4f239e,_0x39ce['dFJnnz']={},_0x39ce['FPmauG']=!![];}var _0x2bc3c4=_0x15bb4c[0x0],_0x4ae163=_0xd9144b+_0x2bc3c4,_0x5b810d=_0x39ce['dFJnnz'][_0x4ae163];return!_0x5b810d?(_0x39ce00=_0x39ce['sHWHCK'](_0x39ce00),_0x39ce['dFJnnz'][_0x4ae163]=_0x39ce00):_0x39ce00=_0x5b810d,_0x39ce00;}function searchByTitle(_0x581ba6,_0x1b7398){var _0x332a54={_0x5ba3f2:0x1f8,_0x1a5fde:0x1e2,_0x4df6a1:0x1ce},_0x23b275={_0x4eeca9:0x1d1,_0x69c88e:0x1ff},_0x33bae1=_0x1d606f,_0x43d229=_0x581ba6['replace'](/:/g,'')['replace'](/\s+/g,'\x20')['trim'](),_0x24ab49=encodeURIComponent((_0x43d229+'\x20'+(_0x1b7398||''))[_0x33bae1(_0x332a54._0x5ba3f2)]()),_0x4d7514=DOMAIN+'/?s='+_0x24ab49;return console[_0x33bae1(0x205)]('[UHDMovies]\x20Search:\x20'+_0x4d7514),fetchText(_0x4d7514)[_0x33bae1(_0x332a54._0x1a5fde)](function(_0x89a8ea){return parseSearchResults(_0x89a8ea);})[_0x33bae1(_0x332a54._0x4df6a1)](function(_0x2db6d8){var _0x2f5f6e=_0x33bae1;return console[_0x2f5f6e(_0x23b275._0x4eeca9)]('[UHDMovies]\x20Search\x20error:\x20'+_0x2db6d8[_0x2f5f6e(_0x23b275._0x69c88e)]),[];});}function parseSearchResults(_0x999f42){var _0x53263f={_0x129f4f:0x1e5,_0x577c5b:0x209,_0x586a23:0x220,_0x19a07d:0x1d6,_0x2ba94e:0x205,_0x448f86:0x1cf},_0x1da4d8=_0x1d606f,_0x4ef215=[],_0x9415ce=_0x999f42[_0x1da4d8(0x22c)](/<article\b/i);for(var _0x572fd6=0x1;_0x572fd6<_0x9415ce['length'];_0x572fd6++){var _0xb7cc28=_0x1da4d8(_0x53263f._0x129f4f)+_0x9415ce[_0x572fd6],_0x330854=_0xb7cc28['match'](/<article[^>]*class="([^"]*)"/i);if(!_0x330854||_0x330854[0x1][_0x1da4d8(_0x53263f._0x577c5b)]('gridlove-post')===-0x1)continue;var _0x2eb599=_0xb7cc28[_0x1da4d8(_0x53263f._0x586a23)](/<h1[^>]*class="[^"]*sanket[^"]*"[^>]*>([\s\S]*?)<\/h1>/i),_0x58016d=_0x2eb599?stripTags(_0x2eb599[0x1])['replace'](/^Download\s+/i,''):'',_0x4f8f51=_0x58016d['match'](/^(.*\)\d*)/),_0x3a27bf=_0x4f8f51?_0x4f8f51[0x1]:_0x58016d,_0x349ec8=_0xb7cc28['match'](/<div[^>]*class="[^"]*entry-image[^"]*"[^>]*>[\s\S]*?<a\s[^>]*href="([^"]+)"/i),_0x117ed6=_0x349ec8?_0x349ec8[0x1]:null;_0x117ed6&&_0x3a27bf&&_0x4ef215[_0x1da4d8(_0x53263f._0x19a07d)]({'title':_0x3a27bf,'url':_0x117ed6,'rawTitle':_0x58016d});}return console[_0x1da4d8(_0x53263f._0x2ba94e)](_0x1da4d8(_0x53263f._0x448f86)+_0x4ef215['length']),_0x4ef215;}function bypassHrefli(_0x3554e8){var _0xbc8adf={_0x59b74a:0x1fa,_0x1f6970:0x1e2},_0x1d4da8={_0x29441c:0x1e2},_0x1d5535={_0xe0af26:0x22f,_0xaad14f:0x220},_0x1d4a8a={_0x4f7aee:0x1da},_0x44c30e={_0x3f32cc:0x1ea},_0x4e3c81=_0x1d606f,_0x36f650=getBaseUrl(_0x3554e8);return console[_0x4e3c81(0x205)](_0x4e3c81(_0xbc8adf._0x59b74a)+_0x3554e8),fetchText(_0x3554e8)['then'](function(_0x4e8bc4){var _0x185761=_0x4e3c81,_0x54b79c=extractFormAction(_0x4e8bc4),_0x458cef=extractFormInputs(_0x4e8bc4);if(!_0x54b79c)return Promise['resolve'](null);return fetch(_0x54b79c,{'method':_0x185761(_0x1d4a8a._0x4f7aee),'headers':{'User-Agent':USER_AGENT,'Content-Type':_0x185761(0x1f0)},'body':toFormEncoded(_0x458cef)})['then'](function(_0x917fec){var _0x4ada66=_0x185761;return _0x917fec[_0x4ada66(_0x44c30e._0x3f32cc)]();});})['then'](function(_0x303608){var _0x440a12=_0x4e3c81;if(!_0x303608)return null;var _0x134cf4=extractFormAction(_0x303608),_0x5140d5=extractFormInputs(_0x303608);if(!_0x134cf4)return null;return fetch(_0x134cf4,{'method':'POST','headers':{'User-Agent':USER_AGENT,'Content-Type':_0x440a12(0x1f0)},'body':toFormEncoded(_0x5140d5)})['then'](function(_0x2bea5f){var _0x785ae5=_0x440a12;return _0x2bea5f['text']()[_0x785ae5(0x1e2)](function(_0x979c16){return{'html':_0x979c16,'formData':_0x5140d5};});});})['then'](function(_0x5b781a){var _0xa1d34f=_0x4e3c81;if(!_0x5b781a)return null;var _0x4f7bd6=extractScriptContaining(_0x5b781a['html'],_0xa1d34f(_0x1d5535._0xe0af26)),_0x47fd99=_0x4f7bd6[_0xa1d34f(_0x1d5535._0xaad14f)](/\?go=([^"]+)/);if(!_0x47fd99)return null;var _0x1821d1=_0x47fd99[0x1],_0x2a5568=_0x5b781a['formData']['_wp_http2']||'';return fetchText(_0x36f650+'?go='+_0x1821d1,{'Cookie':_0x1821d1+'='+_0x2a5568});})[_0x4e3c81(0x1e2)](function(_0x1da9df){if(!_0x1da9df)return null;var _0x4b9701=extractMetaRefresh(_0x1da9df);return _0x4b9701||null;})[_0x4e3c81(_0xbc8adf._0x1f6970)](function(_0x2d78a3){var _0x9cdb92=_0x4e3c81;if(!_0x2d78a3)return null;return fetchText(_0x2d78a3)[_0x9cdb92(_0x1d4da8._0x29441c)](function(_0x54b6a5){var _0x349a8e=_0x9cdb92,_0x1c6a57=_0x54b6a5[_0x349a8e(0x220)](/replace\("([^"]+)"\)/);if(!_0x1c6a57||_0x1c6a57[0x1]==='/404')return null;return fixUrl(_0x1c6a57[0x1],getBaseUrl(_0x2d78a3));});})[_0x4e3c81(0x1ce)](function(_0x3e5cea){var _0xe94ee7=_0x4e3c81;return console['error'](_0xe94ee7(0x1d5)+_0x3e5cea[_0xe94ee7(0x1ff)]),null;});}function extractVideoSeed(_0x13b403){var _0x5fee14={_0x1f0ba2:0x227,_0x3a0f70:0x1ce},_0x5857ba={_0x380937:0x1ed},_0x4ef849={_0x36cca9:0x1ea},_0x493286=_0x1d606f;console['log'](_0x493286(0x1f5)+_0x13b403);var _0x4645e6=_0x13b403['match'](/^https?:\/\/([^\/]+)/),_0x38f764=_0x4645e6?_0x4645e6[0x1]:'video-seed.xyz',_0x4e084b=_0x13b403[_0x493286(0x22c)](_0x493286(0x1f6));if(_0x4e084b['length']<0x2)return Promise[_0x493286(0x1d9)](null);var _0x203894=_0x4e084b[0x1];return fetch(_0x493286(0x218)+_0x38f764+_0x493286(_0x5fee14._0x1f0ba2),{'method':_0x493286(0x1da),'headers':{'User-Agent':USER_AGENT,'Content-Type':'application/x-www-form-urlencoded','x-token':_0x38f764,'Referer':_0x13b403},'body':'keys='+encodeURIComponent(_0x203894)})['then'](function(_0x19f8f4){var _0x5070f9=_0x493286;return _0x19f8f4[_0x5070f9(_0x4ef849._0x36cca9)]();})['then'](function(_0x3d9ebd){var _0x5d0c22=_0x3d9ebd['match'](/url":"([^"]+)"/);return _0x5d0c22?_0x5d0c22[0x1]['replace'](/\\\//g,'/'):null;})[_0x493286(_0x5fee14._0x3a0f70)](function(_0x490baa){var _0x226f7b=_0x493286;return console['error'](_0x226f7b(_0x5857ba._0x380937)+_0x490baa['message']),null;});}function extractInstantLink(_0x2b304c){var _0x83d714={_0x4f44f2:0x1de,_0x506ee1:0x1e2,_0x26baaf:0x1ce,_0x448211:0x218,_0x23d637:0x227,_0x370721:0x1e2},_0x533a9b={_0x5928f4:0x1ff},_0x4a5ca0={_0x27a8c9:0x220},_0x3c8778={_0x334340:0x1d1,_0x263388:0x1f4},_0x29501d={_0xc21916:0x1dc},_0x1b0485=_0x1d606f;console['log'](_0x1b0485(0x22a)+_0x2b304c);if(_0x2b304c['indexOf']('video-gen.xyz')!==-0x1)return fetch(_0x2b304c,{'method':'GET','headers':{'User-Agent':USER_AGENT},'redirect':_0x1b0485(_0x83d714._0x4f44f2)})[_0x1b0485(_0x83d714._0x506ee1)](function(_0x5e52a0){var _0x433e03=_0x1b0485,_0x4595b6=_0x5e52a0[_0x433e03(0x225)]['get'](_0x433e03(_0x29501d._0xc21916));if(!_0x4595b6)return null;var _0x5e1dc3=_0x4595b6['split'](_0x433e03(0x1f6));if(_0x5e1dc3[_0x433e03(0x1fc)]>=0x2)return decodeURIComponent(_0x5e1dc3[0x1]);return _0x4595b6;})[_0x1b0485(_0x83d714._0x26baaf)](function(_0xc09020){var _0x221025=_0x1b0485;return console[_0x221025(_0x3c8778._0x334340)](_0x221025(_0x3c8778._0x263388)+_0xc09020['message']),null;});var _0x169431=_0x2b304c['match'](/^https?:\/\/([^\/]+)/),_0x4bc118=_0x169431?_0x169431[0x1]:_0x2b304c['indexOf'](_0x1b0485(0x1ef))!==-0x1?'video-leech.pro':'video-seed.pro',_0x3dd082=_0x2b304c['split']('url=');if(_0x3dd082['length']<0x2)return Promise['resolve'](null);var _0x12c8fe=_0x3dd082[0x1];return fetch(_0x1b0485(_0x83d714._0x448211)+_0x4bc118+_0x1b0485(_0x83d714._0x23d637),{'method':'POST','headers':{'User-Agent':USER_AGENT,'Content-Type':'application/x-www-form-urlencoded','x-token':_0x4bc118,'Referer':_0x2b304c},'body':_0x1b0485(0x1d7)+encodeURIComponent(_0x12c8fe)})[_0x1b0485(_0x83d714._0x370721)](function(_0xa9fb34){return _0xa9fb34['text']();})[_0x1b0485(0x1e2)](function(_0x408240){var _0x4ae087=_0x1b0485,_0x366145=_0x408240[_0x4ae087(_0x4a5ca0._0x27a8c9)](/url":"([^"]+)"/);return _0x366145?_0x366145[0x1]['replace'](/\\\//g,'/'):null;})['catch'](function(_0x3d9fa2){var _0x19c56f=_0x1b0485;return console['error']('[UHDMovies]\x20InstantLink\x20error:\x20'+_0x3d9fa2[_0x19c56f(_0x533a9b._0x5928f4)]),null;});}function extractResumeBot(_0x41cb47){var _0x1581b1={_0x93ac9d:0x1f3,_0x1cc808:0x223,_0x67748b:0x209},_0x48a25e={_0x48fd3e:0x1ea},_0x46e75d={_0x2244f8:0x220,_0x3c5c3c:0x220,_0x2c1047:0x1df},_0x2a1a2c=_0x1d606f;return console['log']('[UHDMovies]\x20ResumeBot:\x20'+_0x41cb47),fetchText(_0x41cb47)[_0x2a1a2c(0x1e2)](function(_0x2c31a8){var _0x4126ad=_0x2a1a2c,_0x15ff9a=_0x2c31a8[_0x4126ad(_0x46e75d._0x2244f8)](/formData\.append\('token', '([a-f0-9]+)'\)/),_0x2152b3=_0x2c31a8[_0x4126ad(_0x46e75d._0x3c5c3c)](/fetch\('\/download\?id=([a-zA-Z0-9\/+]+)'/);if(!_0x15ff9a||!_0x2152b3)return null;var _0x311c9b=_0x15ff9a[0x1],_0xe377f2=_0x2152b3[0x1],_0x5a4684=_0x41cb47[_0x4126ad(0x22c)]('/download')[0x0];return fetch(_0x5a4684+_0x4126ad(0x1fe)+_0xe377f2,{'method':_0x4126ad(0x1da),'headers':{'User-Agent':USER_AGENT,'Content-Type':'application/x-www-form-urlencoded','Accept':'*/*','Origin':_0x5a4684,'Referer':_0x41cb47},'body':_0x4126ad(_0x46e75d._0x2c1047)+encodeURIComponent(_0x311c9b)});})['then'](function(_0x409abe){var _0x2def95=_0x2a1a2c;if(!_0x409abe)return null;return _0x409abe[_0x2def95(_0x48a25e._0x48fd3e)]();})['then'](function(_0x498217){var _0x11f74d=_0x2a1a2c;if(!_0x498217)return null;try{var _0x1b05e4=JSON[_0x11f74d(_0x1581b1._0x93ac9d)](_0x498217);return _0x1b05e4[_0x11f74d(0x223)]&&_0x1b05e4[_0x11f74d(_0x1581b1._0x1cc808)][_0x11f74d(_0x1581b1._0x67748b)]('http')===0x0?_0x1b05e4['url']:null;}catch(_0x1e5d3d){return null;}})['catch'](function(_0xdf4ae4){var _0x2a49df=_0x2a1a2c;return console['error']('[UHDMovies]\x20ResumeBot\x20error:\x20'+_0xdf4ae4[_0x2a49df(0x1ff)]),null;});}function extractCFType1(_0x5272ab){var _0x4c4582={_0x10ecfe:0x20e},_0x147584={_0xeb1b15:0x1d1},_0x3d0e52=_0x1d606f;return console['log'](_0x3d0e52(_0x4c4582._0x10ecfe)+_0x5272ab),fetchText(_0x5272ab+_0x3d0e52(0x21a))['then'](function(_0x62e86f){return extractBtnSuccessLinks(_0x62e86f);})[_0x3d0e52(0x1ce)](function(_0x132bf5){var _0x217958=_0x3d0e52;return console[_0x217958(_0x147584._0xeb1b15)](_0x217958(0x1d0)+_0x132bf5[_0x217958(0x1ff)]),[];});}function _0x15bb(){var _0x59fe2a=['l2rVD25SB2fKp2LKpq','BwvZC2fNzq','w1vire1VDMLLC10GrhjPDMvZzwvKigvYCM9YoIa','w1vire1VDMLLC10GrhjPDMvZzwvKoIa','zM9SBg93','Ahr0Chm6lY9HCgKUDgHLBw92AwvKyI5VCMCVmW','Bw92Awu','Bg9N','tw96AwXSys81lJaGkfDPBMrVD3mGtLqGmtaUmdSGv2LUnJq7ihG2ncKGqxbWBgvxzwjlAxqVntm3lJm2icHlsfrntcWGBgLRzsbhzwnRBYKGq2HYB21LlZeYmc4WlJaUmcbtywzHCMKVntm3lJm2','C2vYAwvZ','zM9YrwfJAa','Aw5KzxHpzG','ywn0Aw9UpwnSB3vKjMTLEt0','nfvODNjRvG','y2XVDwqGzg93BMXVywq','A2v5CW','w1vire1VDMLLC10Gq0zuExbLmtOG','DgvZDa','CMvWBgfJzq','mJmYoezJyuD1tq','w1vire1VDMLLC10GtM8GC2vHCMnOihjLC3vSDhm','tMfTzsa6ia','mtm0mvH0y25cqq','Aw5ZDgfUDcbKB3DUBg9Hza','sersAxa','ntu2ndi4EuLfquzL','Ahr0Chm6lY8','BMfTzq','p3r5Cgu9mq','AM9PBG','u2L6zsa6','zgLYzwn0igXPBMTZ','mtm1mdu1rMjdu3Do','nZC4ntK2C2fYA3H5','Bwf0y2G','mteWmtq4z1jnteTU','y29Uy2f0','DxjS','DMLKzw8TC2vLza','AgvHzgvYCW','w1vire1VDMLLC10Gz2v0u3rYzwfTCYa','l2fWAq','Ahr0Chm6','ndGYotjnr0TjAwG','w1vire1VDMLLC10Gsw5ZDgfUDeXPBMS6ia','zMLYC3rFywLYx2rHDgu','C3bSAxq','DgL0Bgu','Ahr0Ca','p2DVpq','vuHetw92AwvZ','4PQHifnLzwTHyMXLihWG','zxHLyW','y2f0y2G','w1vire1VDMLLC10GuMvZDwX0CZOG','w1vire1VDMLLC10Gq0zuExbLmsbLCNjVCJOG','zxjYB3i','C2XPy2u','C29YDa','CMvSzwfZzv9KyxrL','w1vire1VDMLLC10GyNLWyxnZshjLzMXPigvYCM9YoIa','ChvZAa','A2v5CZ0','mtiWnZi2mefcD3fUuG','CMvZB2X2zq','ue9tva','C2vLA2fIBgu','Bg9JyxrPB24','jMfJDgLVBL90B2TLBJ0','BwfUDwfS','Dg9Rzw49','Dg9mB3DLCKnHC2u','CxvHBgL0Eq','DgHLBG','qMX1uMf5','w1vire1VDMLLC10Gz2v0tw92AwvmAw5RCYbLCNjVCJOG','pgfYDgLJBgu','u2L6ztO','ywXS','mJe2mha','neHWsgruBG','Dgv4Da','zxHWB3j0CW','rfzeuMLW','w1vire1VDMLLC10GvMLKzw9tzwvKigvYCM9YoIa','v0vclurm','DMLKzw8TBgvLy2G','yxbWBgLJyxrPB24VEc13D3CTzM9YBs11CMXLBMnVzgvK','z2v0u3rYzwfTCW','vw5RBM93BG','CgfYC2u','w1vire1VDMLLC10Gsw5ZDgfUDeXPBMSGy2rUigvYCM9YoIa','w1vire1VDMLLC10GvMLKzw9tzwvKoIa','p3vYBd0','EwvHCG','DhjPBq','w1vire1VDMLLC10Gz2v0vhzfCgLZB2rLtgLUAYbLCNjVCJOG','w1vire1VDMLLC10GyNLWyxnZshjLzMXPoIa','w1vire1VDMLLC10Gve1eqJOG','BgvUz3rO','zhjPDMvZzwvK'];_0x15bb=function(){return _0x59fe2a;};return _0x15bb();}function extractResumeCloudLink(_0x3cc681,_0x4a88d4){var _0x64d9cb={_0x2ceaf1:0x205,_0x55b9ac:0x1ce},_0x2623f6={_0x3866f2:0x20a,_0x229886:0x1e2},_0x1d8ed9=_0x1d606f;console[_0x1d8ed9(_0x64d9cb._0x2ceaf1)]('[UHDMovies]\x20ResumeCloud:\x20'+_0x3cc681+_0x4a88d4);var _0x2c1723=_0x3cc681+_0x4a88d4;return fetchText(_0x2c1723)['then'](function(_0x66c6a8){var _0xccd4a1={_0x5a5524:0x223,_0x550298:0x223},_0x2847cc=_0x1d8ed9,_0x3720a6=extractBtnSuccessLinks(_0x66c6a8);if(_0x3720a6[_0x2847cc(0x1fc)])return _0x3720a6[0x0];var _0x22c615=_0x66c6a8['match'](/formData\.append\(["']key["'],\s*["']([a-f0-9]+)["']\)/);if(!_0x22c615)return null;var _0x5d500f=_0x22c615[0x1],_0x57ddc2=_0x2847cc(_0x2623f6._0x3866f2)+encodeURIComponent(_0x5d500f)+_0x2847cc(0x1dd);return fetch(_0x2c1723,{'method':'POST','headers':{'User-Agent':USER_AGENT,'Content-Type':'application/x-www-form-urlencoded','x-token':_0x3cc681['replace'](/^https?:\/\//,''),'Referer':_0x2c1723},'body':_0x57ddc2})[_0x2847cc(_0x2623f6._0x229886)](function(_0x235cf1){return _0x235cf1['json']();})['then'](function(_0x43c223){var _0x1bf4f1=_0x2847cc;if(_0x43c223&&(_0x43c223[_0x1bf4f1(_0xccd4a1._0x5a5524)]||_0x43c223['visit_url']))return _0x43c223[_0x1bf4f1(_0xccd4a1._0x550298)]||_0x43c223['visit_url'];return null;})['catch'](function(){return null;});})[_0x1d8ed9(_0x64d9cb._0x55b9ac)](function(_0x526687){var _0x2738b3=_0x1d8ed9;return console[_0x2738b3(0x1d1)]('[UHDMovies]\x20ResumeCloud\x20error:\x20'+_0x526687[_0x2738b3(0x1ff)]),null;});}function extractDriveseedPage(_0x3e4067){var _0x4fdcd4={_0x277018:0x205,_0x2080c9:0x1ce},_0x358130={_0x31b096:0x200},_0x8728a6={_0x3f217f:0x1f8,_0x177dca:0x1e7},_0x45ad9c={_0x3b625d:0x1e2},_0x1aad11=_0x1d606f;console[_0x1aad11(_0x4fdcd4._0x277018)](_0x1aad11(0x201)+_0x3e4067);var _0x2f6e93=[];return Promise['resolve']()[_0x1aad11(0x1e2)](function(){var _0x1e12d0=_0x1aad11;if(_0x3e4067[_0x1e12d0(0x209)]('r?key=')!==-0x1)return fetchText(_0x3e4067)[_0x1e12d0(_0x45ad9c._0x3b625d)](function(_0x6df8a2){var _0x4e43d1=_0x6df8a2['match'](/replace\("([^"]+)"\)/);if(!_0x4e43d1)return _0x6df8a2;var _0x1d9bb5=getBaseUrl(_0x3e4067);return fetchText(_0x1d9bb5+_0x4e43d1[0x1]);});return fetchText(_0x3e4067);})[_0x1aad11(0x1e2)](function(_0x1ca9ce){var _0x2205b5={_0x275e97:0x1ea,_0x1ff2b0:0x1e0,_0x2166f4:0x215,_0x36082f:0x209,_0x38a939:0x209,_0x47065c:0x20c,_0x22367a:0x230},_0x4233ac={_0xa149d7:0x208},_0x3253a8=_0x1aad11,_0x1bc19b=getBaseUrl(_0x3e4067),_0x116e68=extractFirstListGroupItem(_0x1ca9ce),_0x1ceeef=_0x116e68['replace'](_0x3253a8(0x213),'')[_0x3253a8(_0x8728a6._0x3f217f)](),_0x319cd2=extractSizeFromHtml(_0x1ca9ce),_0x274562=buildQualityLabel(_0x116e68),_0x5a5f98=_0x1ceeef['replace'](/\.[a-z0-9]+$/i,'')[_0x3253a8(0x1f8)](),_0x5d2eae=_0x319cd2?'\x20['+_0x319cd2+']':'',_0x5c506d=extractTextCenterLinks(_0x1ca9ce),_0x514719=[];return _0x5c506d['forEach'](function(_0x327d6f){var _0x5d0d57={_0x2816a5:0x1d6,_0x540c70:0x1cc},_0x59cbee={_0x44df84:0x1d6,_0x4efd15:0x1cc},_0x1a496a={_0x4a6411:0x230},_0x4f864d=_0x3253a8,_0x3cb43c=(_0x327d6f[_0x4f864d(_0x2205b5._0x275e97)]||'')[_0x4f864d(_0x2205b5._0x1ff2b0)](),_0x3127e5=_0x327d6f['href'];if(!_0x3127e5)return;if(_0x3cb43c[_0x4f864d(0x209)](_0x4f864d(_0x2205b5._0x2166f4))!==-0x1)_0x514719[_0x4f864d(0x1d6)](extractInstantLink(_0x3127e5)[_0x4f864d(0x1e2)](function(_0x45cd51){var _0x332242=_0x4f864d;if(_0x45cd51)_0x2f6e93['push']({'name':_0x332242(_0x1a496a._0x4a6411),'title':_0x274562+_0x5d2eae+'\x0a'+_0x5a5f98,'url':_0x45cd51,'quality':_0x274562,'seekable':![]});}));else{if(_0x3cb43c[_0x4f864d(_0x2205b5._0x36082f)]('resume\x20worker\x20bot')!==-0x1)_0x514719['push'](extractResumeBot(_0x3127e5)['then'](function(_0x984e6a){var _0x39c13c=_0x4f864d;if(_0x984e6a)_0x2f6e93[_0x39c13c(_0x59cbee._0x44df84)]({'name':_0x39c13c(0x230),'title':_0x39c13c(_0x59cbee._0x4efd15)+_0x274562+_0x5d2eae+'\x0a'+_0x5a5f98,'url':_0x984e6a,'quality':_0x274562,'seekable':!![]});}));else{if(_0x3cb43c[_0x4f864d(_0x2205b5._0x38a939)](_0x4f864d(0x21d))!==-0x1)_0x514719['push'](extractCFType1(_0x1bc19b+_0x3127e5)['then'](function(_0x1abde9){var _0x547232={_0x4d6649:0x230},_0x2423ba=_0x4f864d;_0x1abde9[_0x2423ba(_0x4233ac._0xa149d7)](function(_0x36c958){var _0x185401=_0x2423ba;_0x2f6e93['push']({'name':_0x185401(_0x547232._0x4d6649),'title':_0x274562+_0x5d2eae+'\x0a'+_0x5a5f98,'url':_0x36c958,'quality':_0x274562,'seekable':![]});});}));else{if(_0x3cb43c[_0x4f864d(0x209)]('resume\x20cloud')!==-0x1)_0x514719['push'](extractResumeCloudLink(_0x1bc19b,_0x3127e5)['then'](function(_0xeda6b9){var _0x1fe3d5=_0x4f864d;if(_0xeda6b9)_0x2f6e93[_0x1fe3d5(_0x5d0d57._0x2816a5)]({'name':'UHDMovies','title':_0x1fe3d5(_0x5d0d57._0x540c70)+_0x274562+_0x5d2eae+'\x0a'+_0x5a5f98,'url':_0xeda6b9,'quality':_0x274562,'seekable':!![]});}));else _0x3cb43c['indexOf'](_0x4f864d(_0x2205b5._0x47065c))!==-0x1&&_0x2f6e93['push']({'name':_0x4f864d(_0x2205b5._0x22367a),'title':_0x274562+_0x5d2eae+'\x0a'+_0x5a5f98,'url':_0x3127e5,'quality':_0x274562,'seekable':![]});}}}}),Promise[_0x3253a8(_0x8728a6._0x177dca)](_0x514719)['then'](function(){return _0x2f6e93;});})[_0x1aad11(_0x4fdcd4._0x2080c9)](function(_0x6dd1fa){var _0x1f3923=_0x1aad11;return console['error'](_0x1f3923(_0x358130._0x31b096)+_0x6dd1fa[_0x1f3923(0x1ff)]),[];});}function getMovieLinks(_0x2aff15){var _0xa40473={_0x8418d:0x1d1},_0x3c51c6={_0x1fade4:0x220,_0x2d37e7:0x22c,_0x397e4e:0x1fc};return console['log']('[UHDMovies]\x20Movie\x20links:\x20'+_0x2aff15),fetchText(_0x2aff15)['then'](function(_0x5e1285){var _0x6ccbe5=_0x39ce,_0x3e0f91=[],_0xac6c46=_0x5e1285[_0x6ccbe5(_0x3c51c6._0x1fade4)](/<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*)/i),_0x4760af=_0xac6c46?_0xac6c46[0x1]:_0x5e1285,_0x36c6f3=_0x4760af[_0x6ccbe5(_0x3c51c6._0x2d37e7)](/<\/?p(?:\s[^>]*)?\s*>/i);for(var _0x459eb2=0x0;_0x459eb2<_0x36c6f3[_0x6ccbe5(_0x3c51c6._0x397e4e)];_0x459eb2++){if(!/\[.*\]/[_0x6ccbe5(0x20f)](_0x36c6f3[_0x459eb2]))continue;var _0x3744bd=stripTags(_0x36c6f3[_0x459eb2])[_0x6ccbe5(0x22c)]('Download')[0x0]['trim']();for(var _0x5cfbaa=_0x459eb2+0x1;_0x5cfbaa<Math['min'](_0x459eb2+0x6,_0x36c6f3[_0x6ccbe5(0x1fc)]);_0x5cfbaa++){var _0x2cf225=_0x36c6f3[_0x5cfbaa]['match'](/<a[^>]*class="[^"]*maxbutton-1[^"]*"[^>]*href="([^"]+)"/i)||_0x36c6f3[_0x5cfbaa][_0x6ccbe5(_0x3c51c6._0x1fade4)](/<a[^>]*href="([^"]+)"[^>]*class="[^"]*maxbutton-1[^"]*"/i);if(_0x2cf225){_0x3e0f91['push']({'sourceName':_0x3744bd,'sourceLink':_0x2cf225[0x1]});break;}}}return console['log']('[UHDMovies]\x20Movie\x20links\x20found:\x20'+_0x3e0f91['length']),_0x3e0f91;})['catch'](function(_0x54c56a){var _0xb7a482=_0x39ce;return console[_0xb7a482(_0xa40473._0x8418d)](_0xb7a482(0x1e4)+_0x54c56a['message']),[];});}function getTvEpisodeLink(_0x900760,_0x2d7fe7,_0x4ce93){var _0x156934={_0x50465e:0x1d1,_0x210b8b:0x1f9},_0x5de5bf={_0x1f682a:0x20f,_0x528dd1:0x220,_0x512bd:0x1fc,_0x55a034:0x220},_0x18a895=_0x1d606f;return console[_0x18a895(0x205)]('[UHDMovies]\x20TV\x20S'+_0x2d7fe7+'E'+_0x4ce93+':\x20'+_0x900760),fetchText(_0x900760)['then'](function(_0x120da2){var _0x22996b=_0x18a895,_0xe8459b=[],_0xe78e6=/<(p|div)(\s[^>]*)?>[\s\S]*?<\/\1>/gi,_0x17df15='',_0x5a4756=0x1,_0x17d044;while((_0x17d044=_0xe78e6['exec'](_0x120da2))!==null){var _0x3d1566=_0x17d044[0x0],_0x7b5428=stripTags(_0x3d1566),_0x27a07a=/episode/i[_0x22996b(_0x5de5bf._0x1f682a)](_0x3d1566)&&/<a\b/i[_0x22996b(0x20f)](_0x3d1566);if(_0x27a07a){var _0x266587=_0x17df15[_0x22996b(_0x5de5bf._0x528dd1)](/(?:Season\s+|S0?)(\d+)/i);if(_0x266587)_0x5a4756=parseInt(_0x266587[0x1]);if(_0x5a4756===_0x2d7fe7){var _0x384dcc=[],_0x33ebc4=/<a\b[^>]*href="([^"]+)"[^>]*>[\s\S]*?<\/a>/gi,_0x23b3f5;while((_0x23b3f5=_0x33ebc4['exec'](_0x3d1566))!==null){if(/episode/i['test'](_0x23b3f5[0x0]))_0x384dcc['push'](_0x23b3f5[0x1]);}if(_0x4ce93<=_0x384dcc[_0x22996b(_0x5de5bf._0x512bd)]&&_0x4ce93>=0x1){var _0x56caa6=_0x384dcc[_0x4ce93-0x1],_0x20711c=_0x17df15[_0x22996b(_0x5de5bf._0x55a034)](/(\d+(?:\.\d+)?\s*(?:MB|GB))/i);_0xe8459b['push']({'sourceLink':_0x56caa6,'quality':buildQualityLabel(_0x17df15),'size':_0x20711c?_0x20711c[0x1]:null,'details':_0x17df15});}}_0x5a4756++;}_0x17df15=_0x7b5428;}return console[_0x22996b(0x205)]('[UHDMovies]\x20Episode\x20links\x20found:\x20'+_0xe8459b[_0x22996b(0x1fc)]),_0xe8459b;})['catch'](function(_0xb081f1){var _0x5f03b6=_0x18a895;return console[_0x5f03b6(_0x156934._0x50465e)](_0x5f03b6(_0x156934._0x210b8b)+_0xb081f1['message']),[];});}function getStreams(_0x16a77a,_0x57036e,_0x13a357,_0x145e46){var _0x395595={_0x106c14:0x1ff},_0x59a400={_0x12c89c:0x1fc},_0x1e0db4=_0x1d606f;console['log'](_0x1e0db4(0x226)+_0x57036e+'\x20'+_0x16a77a);var _0x5021db=[];return getTmdbDetails(_0x16a77a,_0x57036e)[_0x1e0db4(0x1e2)](function(_0x45fa44){var _0x144968=_0x1e0db4;if(!_0x45fa44)return[];return console['log']('[UHDMovies]\x20Title:\x20'+_0x45fa44[_0x144968(0x22d)]+'\x20('+_0x45fa44[_0x144968(0x1f7)]+')'),searchByTitle(_0x45fa44[_0x144968(0x22d)],_0x45fa44['year']);})['then'](function(_0x1463ea){var _0x5adcda={_0x2f4bb9:0x1db,_0x2f8a1a:0x20f},_0x8cb34e={_0x27631c:0x1fc,_0x829391:0x223},_0x14d28e=_0x1e0db4;if(!_0x1463ea||_0x1463ea[_0x14d28e(_0x59a400._0x12c89c)]===0x0)return console['log'](_0x14d28e(0x212)),[];var _0x52523b=_0x57036e===_0x14d28e(0x207)||_0x57036e==='tv';function _0x1b025e(_0x245c42){var _0x14d5f4={_0x5f15b7:0x1e7},_0x298de5={_0x4590c6:0x208},_0x528280=_0x14d28e;if(_0x245c42>=_0x1463ea[_0x528280(_0x8cb34e._0x27631c)])return Promise[_0x528280(0x1d9)](_0x5021db);var _0x13ead4=_0x1463ea[_0x245c42];console['log']('[UHDMovies]\x20Processing:\x20'+_0x13ead4['title']);var _0x3ba0a7=_0x52523b&&_0x13a357&&_0x145e46?getTvEpisodeLink(_0x13ead4[_0x528280(0x223)],_0x13a357,_0x145e46):getMovieLinks(_0x13ead4[_0x528280(_0x8cb34e._0x829391)]);return _0x3ba0a7[_0x528280(0x1e2)](function(_0x29f77e){var _0x5df34a={_0x5a271f:0x209,_0x5bf6ab:0x1fd,_0xfa66fb:0x209,_0x5aab47:0x224,_0x932670:0x230,_0x4d710b:0x1e1},_0xef3455=_0x528280,_0x3c23ae=_0x29f77e['map'](function(_0x4493ab){var _0x4963e3={_0x58ad61:0x1e1,_0x3675ca:0x1f2},_0x2b4c7e=_0x39ce,_0x4e68ff=_0x4493ab['sourceLink'];if(!_0x4e68ff)return Promise['resolve']([]);var _0x211522=_0x4e68ff['indexOf']('unblockedgames')!==-0x1?bypassHrefli(_0x4e68ff):Promise[_0x2b4c7e(0x1d9)](_0x4e68ff);return _0x211522['then'](function(_0x2a8413){var _0x5753ef=_0x2b4c7e;if(!_0x2a8413)return[];if(_0x2a8413[_0x5753ef(_0x5df34a._0x5a271f)](_0x5753ef(_0x5df34a._0x5bf6ab))!==-0x1||_0x2a8413[_0x5753ef(_0x5df34a._0xfa66fb)]('driveleech')!==-0x1)return extractDriveseedPage(_0x2a8413);if(_0x2a8413[_0x5753ef(_0x5df34a._0xfa66fb)](_0x5753ef(_0x5df34a._0x5aab47))!==-0x1)return extractVideoSeed(_0x2a8413)[_0x5753ef(0x1e2)](function(_0x4bfd59){var _0x1b8113=_0x5753ef;if(!_0x4bfd59)return[];return[{'name':'UHDMovies','title':'UHDMovies\x20'+(_0x4493ab[_0x1b8113(_0x4963e3._0x58ad61)]||_0x1b8113(_0x4963e3._0x3675ca)),'url':_0x4bfd59,'quality':_0x4493ab['quality']||'Unknown'}];});return[{'name':_0x5753ef(_0x5df34a._0x932670),'title':'UHDMovies\x20'+(_0x4493ab['sourceName']||_0x4493ab[_0x5753ef(_0x5df34a._0x4d710b)]||''),'url':_0x2a8413,'quality':_0x4493ab['quality']||'Unknown'}];});});return Promise[_0xef3455(_0x14d5f4._0x5f15b7)](_0x3c23ae)['then'](function(_0x2abec2){var _0x7d51e6={_0x389d10:0x222},_0x3bcfb6=_0xef3455;return _0x2abec2[_0x3bcfb6(_0x298de5._0x4590c6)](function(_0x347162){var _0xe6f436=_0x3bcfb6;_0x5021db=_0x5021db[_0xe6f436(_0x7d51e6._0x389d10)](_0x347162);}),_0x1b025e(_0x245c42+0x1);});});}return _0x1b025e(0x0)[_0x14d28e(0x1e2)](function(_0x5b0e18){var _0xfc6e79=_0x14d28e;function _0x1eff90(_0x213685){var _0x508cdb=_0x39ce,_0x4aeae=_0x213685[_0x508cdb(_0x5adcda._0x2f4bb9)]?0x1:0x0,_0x3834a6=_0x213685['quality']||'',_0x124664=0x0;if(/^4K/i[_0x508cdb(0x20f)](_0x3834a6))_0x124664=0x4;else{if(/1080p/i[_0x508cdb(0x20f)](_0x3834a6))_0x124664=0x3;else{if(/720p/i['test'](_0x3834a6))_0x124664=0x2;else{if(/480p/i[_0x508cdb(0x20f)](_0x3834a6))_0x124664=0x1;}}}var _0x26d770=0x0;if(/remux/i[_0x508cdb(_0x5adcda._0x2f8a1a)](_0x3834a6))_0x26d770=0x5;else{if(/blu.?ray/i['test'](_0x3834a6))_0x26d770=0x4;else{if(/web.?dl/i[_0x508cdb(0x20f)](_0x3834a6))_0x26d770=0x3;else{if(/webrip/i[_0x508cdb(_0x5adcda._0x2f8a1a)](_0x3834a6))_0x26d770=0x2;else{if(/hdrip|dvdrip|hdtv/i[_0x508cdb(0x20f)](_0x3834a6))_0x26d770=0x1;}}}}return _0x124664*0x64+_0x26d770*0xa+_0x4aeae;}return _0x5b0e18[_0xfc6e79(0x1d3)](function(_0xbdb38b,_0xe32cb5){return _0x1eff90(_0xe32cb5)-_0x1eff90(_0xbdb38b);}),_0x5b0e18;});})['catch'](function(_0x356a15){var _0x30deeb=_0x1e0db4;return console[_0x30deeb(0x1d1)]('[UHDMovies]\x20Error:\x20'+_0x356a15[_0x30deeb(_0x395595._0x106c14)]),[];});}typeof module!=='undefined'&&module[_0x1d606f(0x1eb)]?module[_0x1d606f(0x1eb)]={'getStreams':getStreams}:global[_0x1d606f(0x1f1)]=getStreams;

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
