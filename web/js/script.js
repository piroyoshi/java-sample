//******************************************************************************
//
//			JavaScript関数
//
//******************************************************************************
var Event=(function(){
	var listener={};
	var isFunction=function(o){
		return o&&typeof(o)==="function";
	};
	/**
	 * イベントリスナーに登録
	 * @param{E} E にイベントリスナーを登録する
	 * @param{string} type イベントタイプ
	 * @param{function(this:E)} _function 適用される関数
	 * @template E HTMLElementObjectである必要があります
	 */
	listener.add=function(elem,type,_function){};
	/**
	 * イベントリスナーの削除
	 * @param{E} elem E のイベントリスナーを削除する
	 * @param{string} type イベントタイプ
	 * @param{function(this:E)} _function 削除する関数
	 * @template E HTMLElementObjectである必要があります
	 */
	listener.remove=function(elem,type,_function){};
	if((window.attachEvent)){
		listener.add=function(elem,type,_function){
			elem.attachEvent("on"+type,function(){
				_function.call(elem);
			});
		};
		listener.remove=function(elem,type,_function){
			elem.detachEvent("on"+type,function(){
				_function.call(elem);
			});
		};
	}else if((window.addEventListener)){
		listener.add=function(elem,type,_function){
			elem.addEventListener(type,function(){
				_function.call(elem);
			},false);
		};
		listener.remove=function(elem,type,_function){
			elem.removeEventListener(elem,type,function(){
				_function.call(elem);
			},false);
		};
	}else{
		listener.add=function(elem,type,_function){
			elem["on"+type]=function(){
				_function.call(elem);
			};
		};
		listener.remove=function(elem,type,_funciton){
			elem["on"+type]=function(){
				_function.call(elem);
			};
		}
	}
	var C=new function(){
	};
	_extend(C.prototype,{

	});
	_extend(C,listener);
	_extend(C,{
		getKeyCode : function(){
			return this.event().keyCode;
		},
		event : function(){
			return event;
		},
		keyCode : function(){
			return this.getKeyCode();
		},
		elem : function(){
			return this.event().srcElement;
		},
		stop : function(){
			this.event().returnValue=false;
		},
		active : function(){
			return this.elem();
		}
	});
	return C;
}());
/* ファイル読み込みテスト */
window.attachEvent('onload', function() {
//	$AL('[SCRIPT ファイル]');
});

//*****************************************************************************
//	エスケープキー、バックスペースキーを押下時の画面遷移を無効化
//*****************************************************************************
window.document.attachEvent('onkeydown',function(){
	keycode=event.keyCode;
	//棚卸し照会時に、年入力テキストフィールドでエンターを押下時に画面が遷移するのを無効化
	if($N('selectYear')[0]&&keycode==13)return false;
	if(keycode==27){
		return false;
	}else if(keycode==8 && document.activeElement.readOnly!=false){
		return false;
	}
});

/**
 * getElementById へのショートカット
 * @param{string=} id
 * @param{Element=} node
 */
function $(id,node) {
	if (arguments[1]) {
		return node.getElementById(id);
	} else {
		return document.getElementById(id);
	}
}


/**
 * getElementsByName へのショートカット
 * @param{string} name 取得したいDOMノードのname
 * @param{Element=} node 取得したいノードが属する親要素
 */
function $N(name, node) {
	if (arguments[1]) {
		return node.getElementsByName(name);
	} else {
		return document.getElementsByName(name);
	}
}


/**
 * getElementsByTagName へのショートカット
 * @param tagName 取得したいDOMノードのtagName（タグ名）
 * @param node 取得したいノードが属する親ノード
 */
function $TN(tagName, node) {
	if (arguments[1]) {
		return node.getElementsByTagName(tagName);
	} else {
		return document.getElementsByTagName(tagName);
	}
}

/**
 * getElementsByClassName
 * @param cn 取得したいDOMノードのtagName（タグ名）
 * @param node 取得したいノードが属する親ノード
 */
function $CN(cn, node) {
	var doms = arguments[1]? node.childNodes : $TN('*');
	var collection = [];
	for (var i=0; i<doms.length; i++) {
		if (doms[i].className == cn) {
			collection.push(doms[i]);
		}
	}
	return collection;
}


/**
 * 配列ライクなオブジェクトを配列に変換するう
 * @param{*.<{length}>} arrayLike
 */
function $A(arrayLike) {
	var result=[];
	for(var i=0,l=arrayLike.length;i<l;i++){
		result[i]=arrayLike[i];
	}
	return result;
}

/**
 * window.document.createElement へのショートカット
 * @param{string} tagName
 */
function $CE(tagName) {
	return document.createElement(tagName);
}


/**
 * デバッグ用アラート
 * 任意の引数にある値を全て、カンマ区切りで出力する。
 * @param{...*} var_args 出力オブジェクト
 * @return{boolean} 戻り値はfalseとなる
 */
function $AL(var_args) {
	return alert(Array.prototype.slice.call(arguments).join(' , ')||'script test')||false;
}

	//**【SUBMIT FORWARD】*******************//
	//	フォームの実行・画面遷移に関する処理		//
	//**************************************//
//******************************************************************************
//	フォームの送信を行う
//	■引数
//		・param	：	ボタンID（省略不可：ない場合は、「''（空文字）」を設定してください）
//		・form	：	フォームオブジェクト（省略可：デフォルトは「ducument.forms[0]」）
//		・tarGet	：	遷移先ターゲット（省略可）
//	■備考
//		・必ず、<input type="hidden" name="action">タグが必要
//		・遷移先ターゲットは、top・parent・フレーム名を指定する
//	■使用例
//		<input type="button" onclick="doSubmit('')">
//		<input type="button" onclick="doSubmit('[ボタンID]', this.form)">
//		<input type="button"
//					onclick="doSubmit('[ボタンID]', this.form, '_blank')">
//******************************************************************************
function doSubmit(param, form, tarGet) {
	try {
		// フォームオブジェクトの設定
		if (!arguments[1] || !form) {
			form = document.forms[0];
		} else {
			// ターゲット属性の設定
			if (arguments[2]) {
				form.target = tarGet;
			}
		}
		// パラメータの設定
		if (param != '') {
			form.action.value = param;
		}

		// フォームの送信
		form.submit();

	} catch(e) {
window.status = 'エラー通知：doSubmit():' + e;
	}
}


//******************************************************************************
//	画面のリダイレクト
//	■引数
//		・param	：	ボタンID（省略不可：ない場合は、「''（空文字）」を設定してください）
//		・tarGet	：	遷移先ターゲット（省略可）
//	■備考
//		・遷移先ターゲットは、top・parent・フレーム名を指定する
//	■使用例
//		以下に定義された、「pageUnload()」関数を参照
//******************************************************************************
function doRedirect(param, tarGet) {
	try {
		// URLを作成する
		var url = location.href + '?action=' + param;
		// 遷移先ターゲットの指定があれば、指定先へリダイレクト
		if (!arguments[1] && tarGet) {
			tarGet.replace(url);
			return;
		}
		// 指定先パスへ遷移する
		location.replace(url);

	} catch(e) {
window.status = 'URL：' + url + ' ／ エラー通知：doRedirect():' + e;
	}
}


//******************************************************************************
//	ページが遷移する際に、「戻る」の制御を行う
//	■引数
//		・param	：	ボタンID（省略不可：リダイレクトしたい遷移先ボタンIDを指定する）
//		・tarGet	：	遷移先ターゲット（省略可）
//	■備考
//		・ボタンIDの値を判定して、ページの遷移がアプリケーションによるものなのか、
//		　「戻る」ボタンによるものなのかを判定し、遷移先を制御する
//		・遷移先ターゲットは、top・parent・フレーム名を指定する
//	■使用例
//		<body onunload="pageUnload([ボタンID])">
//******************************************************************************
function pageUnload(param, tarGet) {
	try {
		// フォームオブジェクトを取得し、ボタンIDの値を判定する
		var forms = $TN('form');
		for (var i=0; i<forms.length; i++) {
			if (forms[0].action.value != '') {
				return;
			}
		}
		// 遷移先ボタンIDがなければ、指定画面にリダイレクトする
		doRedirect(param, tarGet);

	} catch(e) {
window.status = 'エラー通知：pageUnload():' + e;
	}
}





	//**【INPUT FORM】***********************//
	//	フォームに対する共通イベント処理			//
	//**************************************//
//******************************************************************************
//	初期設定として、フォームのエレメントに各種イベント処理を追加する
//******************************************************************************
window.attachEvent("onload", formInit);
function formInit() {

	try {
		/*
		// フォームオブジェクトの有無を判定
		var formObj = $TN('form')[0];
		if (!formObj) return;

		// 各種処理を初期設定
		for (var i=0; i<formObj.length; i++) {
			var elemObj = formObj.elements[i];
			// ボタン類、hiddenは対象外
			if (elemObj.type=="button" || elemObj.type=="submit"
					|| elemObj.type=="reset" || elemObj.type=="hidden") continue;

			elemObj.attachEvent("onkeydown", function() {
				// カーソルの自動送り
				autoTab(this);
			});
		}
//			defaultFocus(formObj);
		*/
	} catch(e) {
window.status = 'エラー通知：formInit():' + e;
	}

}


//******************************************************************************
//	フォームの入力値をリセットする
//	■ 引数
//		・form	：　フォームオブジェクト（省略可：デフォルトは「document.forms[0]」）
//		・ID		：　メッセージ出力箇所のID（省略可：デフォルトは「message-area」）
//	■ 備考
//		・IDは、フォームオブジェクトが第１引数で渡されている場合にのみ、省略可
//	■ 使用例
//		<input type="button" onlick="doReset()">
//		<input type="button" onlick="doReset(this.form)">
//		<input type="button" onlick="doReset(this.form, [メッセージ出力箇所ID])">
//******************************************************************************
function doReset(form, ID) {
	// ステータスバーの初期化
	window.status = '';
	try {
		// フォームオブジェクトの設定
		if (!arguments[0]) form = document.forms[0];
		// メッセージの出力箇所の設定
		if (!arguments[1]) ID = 'message-area';
		// 作業用変数
		var temp = "";
		// エレメントを判定し、それぞれに応じて初期値に設定する
		for (var i=0; i<form.length; i++) {
			// エレメントオブジェクト、及びそのタイプの取得
			var elem = form.elements[i];
			var elemType = elem.type;

			if (elem.id == 'invalid') continue;

			// テキスト関連の初期化
			if (elemType=="text" || elemType=="textarea" || elemType=="password") {
				elem.value = "";
				elem.style.borderColor = "";
				elem.style.borderStyle = "";
				elem.style.borderWidth = "";
				elem.style.backgroundColor = "";

			// セレクトボックスの初期化
			} else if (elemType == "select-one") {
				if (elem.options.length) {
					elem.options[0].selected = true;
				}

			// セレクトボックス（複数選択）の初期化
			} else if (elemType == "select-multiple") {
				if (elem.length) {
					for (var j=0; j<elem.length; j++) {
						elem.options[j].selected = false;
					}
					elem.options[0].selected = true;
				}
			// チェックボックスの初期化
			} else if (elemType == "checkbox") {
				elem.checked = false;

			// ラジオボタンの初期化
			} else if (elemType == "radio") {
				var n = elem.name;
				if (temp=="" || temp!=n) {
					temp = n;
					var radObj = document.getElementsByName(temp);
					if (radObj.length) {
						for (var j=0; j<radObj.length; j++) {
							radObj[j].checked = false;
						}
						radObj[0].checked = true;
					}
				}
			}
		}
		// メッセージ表示エリアがあれば、初期化
		doClear(form, ID);
		// フォームの最初のエレメントにフォーカス
		defaultFocus(form);
	} catch(e) {
window.status = 'エラー通知：doReset():' + e;
	}
}


//******************************************************************************
//	メッセージをリセットする
//	■ 引数
//		・ID　：　メッセージ出力箇所のID（省略可：デフォルトは「message-area」）
//	■使用例
//		<input type="button" onlick="doClear()">
//		<input type="button" onlick="doClear([メッセージ出力箇所ID])">
//******************************************************************************
function doClear(form, ID) {
	try {
		// フォームオブジェクトの設定
		if (!arguments[0]) form = document.forms[0];
		// メッセージの出力箇所の設定
		if (!arguments[1]) ID = 'message-area';
		// メッセージ表示エリアがあれば、初期化
		if ($(ID)) {
			$(ID).innerHTML = '';
		}
	} catch(e) {
window.status = 'エラー通知：doClear():' + e;
	}
}


//******************************************************************************
//	エンターキーによるカーソルの自動送り
//	■引数
//		・elem　:　エレメントオブジェクト
//	■使用例
//		<input type="button" onkeydown="autoTab()">
//			＊formInit()で、一括指定が可能
//******************************************************************************
function autoTab(elem) {
	// チェックボックス・ラジオボタンは、設定しない
	if (elem.type == "checkbox") return;

	// 「タブ」のキーコードを設定
	if (event.keyCode==13) {
		event.keyCode = 9;
	}
}


//******************************************************************************
//	エンターキーで、チェックボックスを選択／取消する
//	■引数
//		・elem　:　エレメントオブジェクト
//	■使用例
//		<input type="checkbox" onkeydown="doCheck(this)">
//			＊formInit()で、一括指定が可能
//******************************************************************************
function doCheck(elem) {
	// チェックボックス以外は、処理を行わない
	if (elem.type!="checkbox") return;

	// チェックの選択／取消
	if (event.keyCode==13) {
		elem.checked = !(elem.checked);
	}
}


//******************************************************************************
//	フォームの最初の入力エレメントにフォーカスを当てる
//	■引数
//		・form　:　フォームオブジェクト
//	■使用例
//		<body onload="defaultFocus()">
//			＊formInit()で、一括指定が可能
//******************************************************************************
function defaultFocus(form) {
	// 初めに現れるフォーカス可能なオブジェクトにフォーカスを当てる
	for (var i=0; i<form.length; i++) {
		var elemType = form.elements[i].type;
		if (elemType == "text") {
			form.elements[i].focus();
//				form.elements[i].select();
			return;
		}
	}
}


//******************************************************************************
//	サニタイジング
//	■ 引数
//		・elem　:　エレメントオブジェクト
//	■ 備考
//		ページ読み込み時に、テキストフィールドに対して設定される

/* サニタイジング関数 */
function sanitizing(elem) {
	var val = elem.value;
	var sb = '';
	if (!val.length) return;
	for (var i=0; i<val.length; i++) {
		switch(val.charAt(i)) {
			case '<' :
				sb += '&lt;';
				break;
			case '>' :
				sb += '&gt;';
				break;
			case '&' :
				sb += '&amp;';
				break;
			case '"' :
				sb += '&quot';
				break;
			case "'" :
				sb += '&#39;';
				break;
			default :
				sb += val.charAt(i);
		}
	}
	elem.value = sb;
}


//******************************************************************************
//	チェック・サムの自動入力
//	■引数
//		・txtObj		：	出力先テキストオブジェクト
//		・len		：	指定文字数
//		・modulous	：モジュール値（省略可：デフォルト「10」）
//	■使用例
//		<input type="text" onkeypress="autoCheckSum(this, [指定文字数])">
//******************************************************************************
function autoCheckSum(txtObj, len, modulous) {
	// エンターキーの判定
	if (event.keyCode != 13) return;

	// モジュール値の設定
	if (!arguments[2]) {
		modulous = 10;
	}

	// テキストの値を取得し、入力値の判定
	var val = txtObj.value;
	if (val.length!=len || isNan(val)) return;

	// チェック・サムを計算し、テキストに設定する
	var sum = 0;
	for (var i=0; i<val.length; i++) {
		sum += parseInt(val.charAt(i));
	}
	txtObj.value += (sum % modulous);
}


//******************************************************************************
//	オートコンプリートの設定
//	■ 引数
//		・mode	：　オートコンプリートの設定値（true：ON／false：OFF）
//******************************************************************************
window.attachEvent('onload', function() {setAutoComplete(false);});
function setAutoComplete(mode) {
	var inputs = $TN('input');
	for (var i=0; i<inputs.length; i++) {
		if (inputs[i].type == 'text') {
			inputs[i].autocomplete = mode ? 'on' : 'off';
		}
	}
}


//******************************************************************************
//	フォームの入力位置を画面枠内に移動させる
//******************************************************************************
/*	window.attachEvent('onload', setIntoView);
function setIntoView() {
	if (!arguments[0]) {
		var forms = $TN('form');
		forms[0].scrollIntoView = true;
	}
}
*/







	//**【DISPLAY】**************************//
	//	画面の表示制御
	//**************************************//
//******************************************************************************
//	イメージツールバーの設定
//	■ 引数
//		・mode	：　イメージツールバーの設定値（true：表示／false：非表示）
//******************************************************************************
/*	window.attachEvent('onload', function() {setGalleryImage(false);});
function setGalleryImage(mode) {
	var imgs = $TN('img');
	for (var i=0; i<imgs.length; i++) {
		imgs[i].galleryImage = mode;
	}
}
*/

//******************************************************************************
//	ウインドウサイズの設定
//	■ 引数
//		・
//******************************************************************************
//	window.attachEvent('onload', setWinSize);
function setWinSize(aw, ah) {
	window.moveTo(0, 0);
	if (!arguments[0] || !arguments[1]) {
		aw = screen.width;
		ah = screen.height;
	}
	window.resizeTo(aw, ah);
}


//******************************************************************************
//	指定画面をキャプチャー（フォーカス）する
//	■ 引数
//		・
//******************************************************************************
function captureWindow(win) {
	// 指定された画面が開いていれば、その画面をフォーカスする
	if (win!=null && !win.closed) {
		win.focus();
		return true;
	}
	// 指定された画面が閉じていれば、falseを返す
	return false;
}






	//**【EXTENSION】************************//
	//	オブジェクトの拡張（メソッドの定義）		//
	//**************************************//
//		【Stringオブジェクトの拡張】
//*****************************************************************************************
//	空白文字除去メソッドの定義
//	■備考
//		・値の前後の空白文字を除去する
//	■使用例
//		val = val.trim();
//			* 空白を除去したい対象の値
//*****************************************************************************************
String.prototype.trim = function() {
	var val = this;
	// 余分な空白を除去する
	val = val.replace(/^\s+/, "");
	return val.replace(/\s+$/, "");
}


//*****************************************************************************************
//	空白文字除去メソッドの定義（左の空白のみ除去する）
//	■備考
//		・値の左の空白文字を除去する
//	■使用例
//		val = val.ltrim();
//			* 空白を除去したい対象の値
//*****************************************************************************************
String.prototype.ltrim = function() {
	// 値の左端にある余分な空白を除去する
	return this.replace(/^\s+/, "");
}


//*************************************************************************************
//	空白文字除去メソッドの定義（右の空白のみ除去する）
//	■備考
//		・値の右の空白文字を除去する
//	■使用例
//		val = val.rtrim();
//			* 空白を除去したい対象の値
//*************************************************************************************
String.prototype.rtrim = function() {
	// 値の右端にある余分な空白を除去する
	return this.replace(/\s+$/, "");
}


//*************************************************************************************
//	文字詰めメソッドの定義
//	■引数
//		・len	：最大の文字数
//		・pad	：詰める文字（省略可：デフォルト「半角空白」）
//		・mode	：詰める位置（省略可：デフォルト「PAD_LEFT」）
//			PAD_LEFT	：左に詰める
//			PAD_RIGHT	：右に詰める
//	■戻り値
//		・文字詰めの完了した文字列
//	■備考
//		・値の左端・右端のどちらかに指定文字を詰める
//	■使用例
//		val = val.pad();
//			* 文字詰めを行いたい対象の値
//*************************************************************************************
// 文字詰めプロパティ
var PAD_LEFT = 0;
var PAD_RIGHT = 1;

String.prototype.pad = function(len, pad, mode) {
	var val = this;
	// 指定文字数を超える場合は、処理を終える
	if (val.length >= len) return val;

	// 詰める文字の設定
	if (!arguments[2]) pad = " ";
	// 詰める位置の設定
	if (!arguments[3]) mode = PAD_LEFT;

	var sb = "";
	for (var i=0; i<len-val.length; i++) {
		sb += pad;
	}
	if (mode == PAD_LEFT) {
		return sb + val;
	} else {
		return val + sb;
	}
}


//*************************************************************************************
//	文字の左端に文字を詰める
//	■引数
//		・len	：最大の文字数
//		・pad	：詰める文字（省略可：デフォルトは「半角空白文字」）
//	■戻り値
//		・文字詰めの完了した文字列
//	■備考
//		・値の左端に指定文字を詰める
//	■使用例
//		val = val.pad();
//			* 文字詰めを行いたい対象の値
//*************************************************************************************
String.prototype.lpad = function(len, pad) {
	var val = this;
	// 指定文字数を超える場合は、処理を終える
	if (val.length >= len) return val;

	// 詰める文字の設定
	if (!arguments[2]) pad = " ";

	var sb = "";
	for (var i=0; i<len-val.length; i++) {
		sb += pad;
	}
	return sb + val;
}


//****************************************************************************
//	文字の右端に文字を詰める
//	■引数
//		・len	：最大の文字数
//		・pad	：詰める文字（省略可：デフォルトは「半角空白文字」）
//	■戻り値
//		・文字詰めの完了した文字列
//	■備考
//		・値の右端に指定文字を詰める
//	■使用例
//		val = val.pad();
//			* 文字詰めを行いたい対象の値
//*************************************************************************************
String.prototype.rpad = function(len, pad) {
	var val = this;
	// 指定文字数を超える場合は、処理を終える
	if (val.length >= len) return val;

	// 詰める文字の設定
	if (!arguments[2]) pad = " ";

	var sb = "";
	for (var i=0; i<len-val.length; i++) {
		sb += pad;
	}
	return val + sb;
}


//*************************************************************************************
//	日付文字列を日付オブジェクトに変換する
//	■引数
//		・mark	：	区切り文字（省略可：デフォルト「/」）
//	■戻り値
//		・theDate：日付オブジェクト
//	■使用例
//		val = val.parseDate();
//			* 日付変換を行いたい値（形式は、「yyyy/mm/dd」）
//*************************************************************************************
String.prototype.parseDate = function(mark) {
	// 区切り文字の設定
	if (!arguments[1]) mark = "/"

	// 日付文字列から、年・月・日を取得
	var datevalue	= this.split(mark);
	var year		= parseInt(datevalue[0])
	var month		= parseInt(datevalue[1]) - 1;
	var day			= parseInt(datevalue[2]);
	// 日付オブジェクトの取得
	var theDate		= new Date(year, month, day);
	return theDate;
}


//		【Arrayオブジェクトの拡張】
//****************************************************************************
//	指定文字列を含む要素のみ抜き出すメソッドの定義
//	■引数
//		・str　：　指定文字列
//	■戻り値
//		指定文字列を含む要素からなる新たな配列
//	■備考
//		・引数で文字列をしていし、その文字列を含むもののみ抜き出した新しい配列を作成する
//	■使用例
//		val2 = val1.filter();
//			* val1　：　抜き出す目のもとの配列
//			* val2　：　フィルターにかけた新しい配列
//*************************************************************************************
Array.prototype.filter = function(str) {
	var ary = this;
	var newary = [];
	for (var i=0; i<ary.length; i++) {
		if (ary[i].indexOf(str) != -1) {
			newary.push(ary[i]);
		}
	}
	return newary;
}


//****************************************************************************
//	指定した要素が配列内に存在するかを確認する（あればそのindexを返す）
//	■引数
//		・val　：　削除する要素
//	■戻り値
//		指定した要素が削除された新たな配列
//	■使用例
//		array = array.contains(val);
//			* val　：　確認したいしたい要素
//*************************************************************************************
Array.prototype.contains = function(val) {
	for (var i=0; i<this.length; i++) {
		if (this[i] == val) return i;
	}
	return false;
}


//****************************************************************************
//	配列内の要素を削除する
//	■引数
//		・val　：　削除する要素
//	■戻り値
//		指定した要素が削除された新たな配列
//	■使用例
//		array = array.remove();
//			* val　：　削除したい要素
//*************************************************************************************
Array.prototype.remove = function(val) {
	// 指定された要素のindexを取得する
	var index = this.contains(val);
	if (index >= 0) {
		// 要素をずらして、指定された要素を削除する要素
		for (var i=index+1; i<this.length; i++) {
			this[i-1] = this[i];
		}
		this.pop();
		return true;
	}
	return false;
}


//****************************************************************************
//	各要素に対して関数を呼び出す
//	■引数
//		・func　：　施したい処理（関数）
//	■戻り値
//		指定した要素が削除された新たな配列
//	■使用例
//		array.each(func);
//			* array	：　処理を施したい配列
//*************************************************************************************
Array.prototype.each = function(func) {
	for (var i=0; i<this.length; i++) {
		eval(func(this[i]));
	}
}


//****************************************************************************
//	各要素に対して関数を呼び出し、結果を配列で返す
//	■引数
//		・func　：　判定したい処理（関数）
//	■戻り値
//		指定した要素が削除された新たな配列
//	■使用例
//		array.findAll(func);
//			* array	：　処理を施したい配列
//*************************************************************************************
Array.prototype.findAll = function(func) {
	var newArray = [];
	for (var i=0; i<this.length; i++) {
		if(eval(func(this[i]))) {
			newArray.push(this[i]);
		}
	}
	return newArray;
}







//		【Dateオブジェクトの拡張】
//*************************************************************************************
//	曜日を取得する
//	■引数
//		・theDay　：　曜日インデックス
//	■使用例
//		 val = now.getWeekDay(4);
//			* 上記の結果は、「木」
//			* now　：　日付オブジェクトを格納した変数
//*************************************************************************************
Date.prototype.getWeekday = function(theDay) {
	// 曜日インデックスの設定
	if (!arguments[0]) {
		theDay = this.getDay();
	}
	// 曜日
	var week = ["日", "月", "火", "水", "木", "金", "土"];
	return week[theDay];
}


//*************************************************************************************
//	閏年を判定する
//	■引数
//		・theYear	：　年
//	■使用例
//		 val = now.isLeapYear(2008);
//			* 上記の結果、「true」
//			* now　：　日付オブジェクトを格納した変数
//*************************************************************************************
Date.prototype.isLeapYear = function(theYear) {
	// 曜日インデックスの設定
	if (!arguments[0]) {
		theYear = this.getFullYear();
	}
	return (((theYear%4==0) && (theYear%100!=0)) || (theYear%400==0));
}


//*************************************************************************************
//	月の一日の曜日を取得する
//	■引数
//		・theYear	：	年
//		・theMonth	：	月
//	■使用例
//		 val = now.getFirstDay(2009, 1);
//			* 上記の結果は、「１（月曜日）」
//			* now　：　日付オブジェクトを格納した変数
//*************************************************************************************
Date.prototype.getFirstDay = function(theYear, theMonth) {
	// 年・月の設定
	if (!arguments.length) {
		theYear = this.getFullYear();
		theMonth = this.getMonth();
	}
	var theDate = new Date(theYear, theMonth, 1);
	return theDate.getDay();
}


//*************************************************************************************
//	月の日数を取得する
//	■引数
//		・theYear	：	年
//		・theMonth	：	月
//	■使用例
//		 val = now.geteMonthDays(2009, 1);
//			* 上記の結果は、「29（2月の日数）」
//			* now　：　日付オブジェクトを格納した変数
//*************************************************************************************
Date.prototype.geteMonthDays = function(theYear, theMonth) {
	// 年・月の設定
	if (!arguments.length) {
		theYear = this.getFullYear();
		theMonth = this.getMonth();
	}

	// 月ごとの日数を設定
	var days = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"];
	// 閏年の判定
	if (theMonth==1 && ((theYear%4==0) && (theYear%100!=0)) || (theYear%400==0)) {
		days[theMonth] = 29;
	}
	return days[theMonth];
}



//		【DOMオブジェクトの拡張】
//*************************************************************************************
//	 DOMオブジェクトへのメソッド設定
//*************************************************************************************
//*************************************************************************************
//	クラス属性の追加
//	■引数
//		・
//	■使用例
//
//			*
//*************************************************************************************
function addClass(obj, c) {
	removeClass(obj, c);
	c = ' ' + c;
	obj.className += c;
}


//*************************************************************************************
//	クラス属性の削除
//	■引数
//		・
//	■使用例
//
//			*
//*************************************************************************************
function removeClass(obj, c) {
	//c = ' ' + c;5
	obj.className = obj.className.replace(c, '');
	obj.className.trim();
}


//*************************************************************************************
//
//	■引数
//		・
//	■使用例
//
//			*
//*************************************************************************************
function switchClass(obj, p) {
	p = ' ' + p;
	var matcher = new RegExp(p);
	var c = obj.className;
	c = matcher.test(c)? c.replace(p, ''):(c + p);
	obj.className = c;
}





	//**【FORMAT】***************************//
	//	（形式）変換・取得
	//**************************************//
//*************************************************************************************
//	日付オブジェクトを日付文字列に形式変換する
//	■引数
//		・val：形式変換する日付オブジェクト
//	■戻り値
//		・theDate：日付オブジェクト
//*************************************************************************************
function formatDate(datevalue, dateType) {
	// 日付形式の設定
	if (!arguments[1]) {
		dateType = "yyyy/mm/dd";
	}
	// 年・月・日の取得
	var year	= datevalue.getFullYear();
	var month	= datevalue.getMonth() + 1
	var day		= datevalue.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	// 形式を整え、返却する
	var week = ["日", "月", "火", "水", "木", "金", "土"];
	var theDate;
	switch (dateType) {
		case "yyyy/mm/dd［曜］"	:
			theDate = year + "/" + month + "/" + date + "［" + week[month-1] + "］";
			break;
		case "yyyy年mm月dd日（曜）"	:
			theDate = year + "年" + month + "月" + date + "日（" + week[month-1] + "）";
			break;
		case "平成yy年mm月dd日（曜）"	:
			var heisei = year - 1988;
			theDate = "平成" + heisei + "年" + month + "月"
							+ date + "日（" + week[month-1] + "）";
			break;
		default	:
			year + "/" + month + "/" + date;
			break;
	}
	return theDate;
}


//*************************************************************************************
//	当日日付を文字列で取得する
//	■戻り値
//		・today：当日日付の文字列
//*************************************************************************************
function getTodaysDate(dateType) {
	// 日付形式の設定
	if (!arguments[1]) {
		dateType = "yyyy/mm/dd";
	}
	// 年・月・日の取得
	var today	= new Date();
	var year	= today.getFullYear();
	var month	= today.getMonth() + 1;
	var day		= today.getDate();
	if (month < 10) {
		month = "0" + month;
	}
	if (day < 10) {
		day = "0" + day;
	}
	// 形式を整えて、返却する
	var week = ["日", "月", "火", "水", "木", "金", "土"];
	var theDate;
	switch (dateType) {
		case "yyyy/mm/dd［曜］"	:
			theDate = year + "/" + month + "/" + date + "［" + week[month-1] + "］";
			break;
		case "yyyy年mm月dd日（曜）"	:
			theDate = year + "年" + month + "月" + date + "日（" + week[month-1] + "）";
			break;
		case "平成yy年mm月dd日（曜）"	:
			var heisei = year - 1988;
			theDate = "平成" + heisei + "年" + month + "月"
							+ date + "日（" + week[month-1] + "）";
			break;
		default	:
			year + "/" + month + "/" + date;
			break;
	}
	return theDate;
}
/******************************************************************************
String.prototype.isFuture
引数で渡された日付が、現在のシステム上の日付よりもしくは、比較対象のDateオブジェクトよりも 未来日であるか
■引数
	this
	arguments[0] Date 比較対象に

■戻り値
	boolean
*******************************************************************************:*/
_extend(String.prototype,{
	isFuture : function(){

		//比較対象のDateオブジェクト
		var date = null;
		if(arguments[0]) date = arguments[0];
		else date = new Date();

		//比較用日付
		var year = 0;
		var month = 0;
		var day = 0;

		year = +this.split("/")[0];
		month = +this.split("/")[1];
		day = +this.split("/")[2];

		var answer = false;
		if(year > date.getFullYear()){
			answer = true;
		}


		if(!answer && date.getFullYear() == year && (date.getMonth() + 1) < month){
			answer = true;
		}

		if(!answer && date.getFullYear() == year && (date.getMonth() + 1) == month && date.getDate() < day){
			answer = true;
		}


		return answer;

	}
});

//*************************************************************************************
//	数値の形式変換
//	■引数
//		・val	：対象の数値
//		・mode	：詰める位置
//		・scale	：小数第何位目で可を指定する
//	■戻り値
//		・形式変換された数値の文字列
//	■備考
//
//*************************************************************************************
// 数値形式プロパティの定義
var NUMBER = 0;
var CURRENCY = 1;
var CURRENCY_JP = 2;

// 数字のフォーマットを設定する
function numberFormat(val, style) {
	// 変換する形式の設定
	if (!arguments[1]) style = NUMBER;
	style = eval(style);
	// 受け取った数値を文字列に変換する
	val = new String(val);

	var isMinus = false;
	if (val.charAt(0) == '-') {
		val = val.substring(1);
		isMinus = true;
	}

	// 区切りの数を算出する
	var figures = Math.ceil(val.length / 3);
	var num = new Array();

	var n = "";
	var cnt = 0;
	for (var i=val.length; i>=0; i--) {
		n = val.charAt(i) + n;
		if (i==0 || (i!=val.length && cnt%3==0)) {
			num.push(n);
			n = "";
		}
		cnt++;
	}
	num = num.reverse();

	if (style == CURRENCY) {
		return "￥" + num.toString() + "-";
	} else if (style == CURRENCY_JP) {
		return num.toString() + "円";
	} else {
		if (isMinus) {
			return '-' + num.toString();
		} else {
			return num.toString();
		}
	}
}
// objectはstringか
function isString(object){
	return object && typeof(object)==="string";
}
function isFunction(object){
	return object && typeof(object)==="function";
}
// objectに指定したプロパティが含まれるか
function isProperty(object,property){
	return property in object;
}
// objectはElementオブジェクトか
function isElement(object){
	return object && object.nodeType==DOM.NODE_TYPE.ELEMENT;
}
// objectはArrayオブジェクトか
function isArray(object){
	return object instanceof Array;
}
// 拡張する
function _extend(obj,src){
	for(var o in src){
		obj[o]=src[o];
	}
	return obj;
}
function _set(obj,src){
	return _extend(obj,src);
}

// 複数拡張する
function _extends(obj){
	for(var i=1,src;src=arguments[i];i++){
		obj=_extend(obj,src);
	}
	return obj;
}
// break用
var $break={};
// 繰り返し処理
function _iterator(object){
	return isProperty(object,"length") ? Iterator.array : Iterator.hash;
}
// 全ての配列に対して関数を実行する
// 使用例
/*
	var list = [1,2,3,4,5];
	// 配列の中身を出力する
	alert(list);
	// 配列の中身全てをアラートで表示する
	_for(list,function(value){
		alert(value);
	});
*/
/**
 *
 * @param{*} object オブジェクト
 * @param{function(V,K)} _function 各要素に適用される関数。
 *		引数には、値、インデックスを受け取る。
 * @template{V} オブジェクトのvalue
 * @template{K} オブジェクトのkey
 */
function _for(object,_function){
	_iterator(object).each(object,function(value,index){
		_function(value,index);
	});
}
// 全ての配列に対して関数を実行する
// _for と同じ
/**
 *
 * @param{*} object オブジェクト
 * @param{function(V,K)} _function 各要素に適用される関数。
 *		引数には、値、インデックスを受け取る。
 * @template{V} オブジェクトのvalue
 * @template{K}オブジェクトのkey
 */
function _each(object,_function){
	_for(object,_function);
}
// 全ての配列に対して関数を実行し
// 結果がtrueの値を全て返す
// 使用例
/*
	var list = [1,2,3,4,5];
	// 配列の中身を出力する
	alert(list);
	//	list の中身にある2の場合の数の値を取得する
	var result = _findAll(list,function(value){
		return value%2 === 0;
	});
	// 配列の中身を全て表示する
	alert(result);
*/
/**
 *
 * @param{*} object オブジェクト
 * @param{function(V,K):boolean} _function 各要素に適用される関数。
 *		引数には、値、インデックスを受け取る。戻り値は、booleanを返す必要がある
 * @returns{Array.<V>} 配列で返す
 * @template{V} オブジェクトのvalue
 * @template{K} オブジェクトのkey
 */
function _findAll(object,_function){
	return _iterator(object).findAll(object,function(value,index){
		return _function(value,index);
	});
}
// 配列に対して関数を実行し
// trueの値を返す
// 引数 object - 配列もしくはオブジェクト
// 引数 find_function - 検索する条件を指定する
// 引数 _function - trueのときの処理を実行する （デフォルトではvalueを返す）
// 使用例
/*
	var list = [1,2,3,4,5];
	// 配列の中身を出力する
	alert(list);
	// list の中身にある偶数の値を取得する
	var result = _find(list,function(value){
		return value%2 === 0;
	});
	// result を表示する
	alert(result);
*/
/**
 *
 * @param{*} object オブジェクト
 * @param{function(V,K):boolean} find_function 各要素に適用される関数。
 *		引数には、値、インデックスを受け取る。戻り値は、booleanを返す必要がある
 * @returns{V} trueを返した時の値
 * @template V オブジェクトの値
 * @template K オブジェクトのインデックス
 */
function _find(object,find_function/* ,_function */){
	return _iterator(object).find(object,function(value,index){
		return find_function(value,index);
	},arguments[2]||defaultFunction);
}
// 配列の各項目において関数を実行し、
// 実行できた項目全てがtrueを返したときtrueを返す
// 使用例
/*
	var list = [1,2,3,4,5];
	// 配列の中身を出力する
	alert(list);
	// list の中身が全て5以下の値かを判定する
	var result = _and(list,function(value){
		return value<=5;
	});
	// 結果を出力する
	alert(result)
*/
/**
 *
 * @param{*} object
 * @param{function(V,K):boolean} _function
 * @returns{boolean}
 * @template V
 * @tempalte K
 */
function _and(object,_function){
	return _iterator(object).and(object,function(value,index){
		return _function(value,index);
	});
}
// 配列に各項目において関数を実行し、
// いずれかの項目がtrueを返したときtrueを返す
// 使用例
/*
	var list = [1,2,3,4,5];
	// 配列の中身を出力する
	alert(list);
	// list の中身に偶数の値が含まれているか判定する
	var result = _and(list,function(value){
		return value%2 ===0;
	});
	// 結果を出力する
	alert(result)
*/
/**
 *
 * @param{*} object
 * @param{function(V,K):boolean} _function
 * @returns{boolean}
 * @template V
 * @template K
 */
function _or(object,_function){
	return _iterator(object).or(object,function(value,index){
		return _function(value,index);
	});
}
// 配列に各項目において関数を実行し、
// 結果を配列で返す
/*
	var list = [1,2,3,4,5];
	// 配列の中身を出力する
	alert(list);
	// listの中身の値を全て2倍にして、結果を配列で返す
	var result = _map(list,function(value){
		return value*2;
	});
	// 配列の中身を出力する
	alert(result);
*/
/**
 *
 * @param{*} object
 * @param{function(V,K):boolean} _function
 * @returns{Array.<R>}
 * @template V
 * @template K
 * @template R
 */
function _map(object,_function){
	return _iterator(object).map(object,function(value,index){
		return _function(value,index);
	});
}
/**
 * 配列の各項目において関数を実行し
 * 関数にはresultが常に受け渡される
 * 結果をresultに入れて返す
 * @param{*} object
 * @param{R} result
 * @param{function(R,V,K):R} _function
 * @template V
 * @tempalte K
 * @tempalte R
 */
function _inject(object,result,_function){
	return _iterator(object).inject(object,result,function(_result,value,index){
		return _function(result,value,index);
	});
}
/**
 * filterに一致する値以外を全て返す
 * @param{*} object
 * @param{RegExp|string} filter
 * @returns{Array.<V>}
 * @template V
 */
function _filter(object,filter){
	return _iterator(object).filter(object,filter);
}
/**
 * 配列の各項目で指定したプロパティに一致する値を全て返す
 * @param{*} object
 * @param{string} property
 * @returns{Array.<V>}
 * @template V
 */
function _property(object,property){
	return _iterator(object).property(object,property);
}
// 配列の各項目において関数(_function)を実行し、
// 結果がtrueの値に対して 関数(map_function)の実行した結果を配列に格納する
/*
	var list = [1,2,3,4,5];
	// 配列の中身を出力する
	alert(list);
	// listの中身の偶数の値を10倍して
	var result = _findMap(list,function(value){
		// その値は偶数か
		return value%2 === 0;
	},function(value){
		// その値を10倍する
		return value*10;
	});
	// 結果を表示する
	alert(result);
*/
/**
 *
 * @param{*} object
 * @param{function(V,K):boolean} _function
 * @param{function(V,K):Array.<R>} map_function
 * @template V
 * @template K
 * @template R
 */
function _findMap(object,_function,map_function){
	return _iterator(object).findMap(object,function(value,index){
		return !!_function(value,index);
	},function(value,index){
		return map_function(value,index);
	});
}
//使用例
//	var list = [1,2,3,4,5];
//	// 配列の中身を出力する
//	alert(list);
//	// listの中身の偶数の値をalertで表示する
//	var result = _findMap(list,function(value){
//		// その値は偶数か
//		return value%2 === 0;
//	},function(value){
//		alert(value);
//	});
/**
 * 配列の各項目において関数(find_function)を実行し、
 * 結果がtrueの値に対して関数(_function)を実行する
 * @param{*} object
 * @param{function(V,K):boolean} find_function
 * @param{function(V,K)} _function
 */
function _findEach(object,find_function,_function){
	return _iterator(object).findEach(object,function(value,index){
		return find_function(value,index);
	},function(value,index){
		_function(value,index);
	});
}
/**
 *
 * @param{*} object
 * @param{function(V,K):boolean} _function
 * @param{R} result
 * @param{function(R,V,K):R} inject_function
 * @returns{R}
 * @template V
 * @template K
 * @template R
 */
function _findInject(object,_function,result,inject_function){
	return _iterator(object).findInject(object,function(value,index){
		return !!_function(value,index);
	},result,function(_result,value,index){
		return _function(result,value,index);
	});
	return result;
}
/**
 * classNameに一致するElementを全て返す
 * @param{Element} elem
 * @param{string} className
 * @returns{Array.<Element>}
 */
function getElementsByClassName(elem,className){
	return DOM.child.getElementsByClassName(elem,className);
}
/**
 * 指定したスタイルを取得する
 * @param{Element} elem
 * @param{string} style
 * @returns{string}
 */
function getStyle(elem,style){
	return DOM.Methods.Static.getStyle(elem,style);
}
/**
 * クラス名が含まれているか
 * @param{Element} elem
 * @param{string} className
 * @returns{boolean}
 */
function hasClassName(elem,className){
	return DOM.Methods.Static.hasClassName(elem,className);
}
/**
 * クラス名の削除
 * @param{Element} elem
 * @param{string} className
 */
function removeClassName(elem,className){
	DOM.Methods.Static.removeClassName(elem,className);
}
/**
 * クラス名の追加
 * @param{Element} elem
 * @param{string} className
 */
function addClassName(elem,className){
	DOM.Methods.Static.addClassName(elem,className);
}
/**
 * クラス名の置き換え
 * @param{Element} elem
 * @param{string} beforeClassName
 * @param{string} afterClassName
 */
function replaceClassName(elem,beforeClassName,afterClassName){
	removeClassName(elem,beforeClassName);
	addClassName(elem,afterClassName);
}
/**
 * parent以下にある
 * name属性が付いているオブジェクトを全て取得する
 * tableの行の要素を取るとき等に使う
 * resultはnameをkeyにして格納されている
 * @param{string} parent
 * @returns{Object.<string,Element>}
 */
function getFormElements(parent){
	return DOM.child.findInject(parent,function(node){
		return isProperty(node,"name");
	},{},function(result,node){
		result[node.name]=node;
		return result;
	});
}
/**
 * tagNameに一致する最初のparent要素を取得する
 * @param{Element} elem
 * @param{string} tagName
 * @returns{Element}
 */
function getParentElementByTagName(elem,tagName){
	return DOM.parent.getElementByTagName(elem,tagName);
}
/**
 * classNameに一致する最初のparent要素を取得する
 * @param{Element} elem
 * @param{string} className
 */
function getParentElementByClassName(elem,className){
	return DOM.parent.getElementByClassName(elem,className);
}
var Base={}
Base.Iterator={}
Base.DOM={}
Base.DOM.Methods={}
Base.DOM.Methods.Static={
	getElementsByAttributeAndValue : function(node,attribute,value){
		return this.findAll(node,function(elem){
			return isProperty(elem,attribute)&&elem[attribute]==value;
		});
	},
	getElementByAttributeAndValue : function(node,attribute,value){
		return this.find(node,function(elem){
			return isProperty(elem,attribute)&&elem[attribute]==value;
		});
	},
	getElementsByTagName : function(node,tagName){
		return this.getElementsByAttributeAndValue(node,"tagName",tagName.toUpperCase());
	},
	getElementByTagName : function(node,tagName){
		return this.getElementByAttributeAndValue(node,"tagName",tagName.toUpperCase());
	},
	getElementsByName : function(node,name){
		return this.getElementsByAttributeAndValue(node,"name",name);
	},
	getElementByName : function(node,name){
		return this.getElementByAttributeAndValue(node,"name",name);
	},
	getElementsByClassName : function(node,className){
		return this.findAll(node,function(elem){
			return DOM.Methods.Static.hasClassName(elem,className);
		});
	},
	getElementByClassName : function(node,className){
		return this.find(node,function(elem){
			return DOM.Methods.Static.hasClassName(elem,className);
		});
	}
}
Base.Iterator.Static={
	each : function(object,_function){
		try{
			var index=0;
			this._each(object,function(value){
				_function(value,index++);
			});
		}catch(e){
			if(e!=$break){
				throw e;
			}
		}
	},
	findAll : function(object,_function){
		var result=[];
		this.each(object,function(value,index){
			if(_function(value,index)){
				result[result.length]=value;
			}
		});
		return result;
	},
	find : function(object,find_function/* ,_function */){
		var result;
		var _function=arguments[2]||defaultFunction;
		this.each(object,function(value,index){
			if(find_function(value,index)){
				result=_function(value,index);
				//result=value;
				throw $break;
			}
		});
		return result;
	},
	and : function(object,_function){
		var result=true;
		this.each(object,function(value,index){
			result=result&&!!_function(value,index);
			if(!result){
				throw $break;
			}
		});
		return result;
	},
	or : function(object,_function){
		var result=false;
		this.each(object,function(value,index){
			if(result=!!_function(value,index)){
				throw $break;
			}
		});
		return result;
	},
	inject : function(object,result,_function){
		this.each(object,function(value,index){
			result=_function(result,value,index);
		});
		return result;
	},
	map : function(object,_function){
		var result=[];
		this.each(object,function(value,index){
			result[result.length]=_function(value,index);
		});
		return result;
	},
	filter : function(object,filter){
		var result=[];
		if(isString(filter)){
			filter=new RegExp(filter);
		}
		return this.findAll(object,function(value){
			return !filter.test(value);
		});
	},
	property : function(object,property){
		return this.findAll(object,function(value){
			return isProperty(value,property);
		});
	},
	findEach : function(object,_function,each_function){
		this.each(object,function(value,index){
			if(!!_function(value,index)){
				each_function(value,index);
			}
		});
	},
	findMap : function(object,_function,map_function){
		var result=[];
		this.findEach(object,function(value,index){
			return _function(value,index);
		},function(value,index){
			result[result.length]=map_function(value,index);
		});
		return result;
	},
	findInject : function(object,_function,result,inject_function){
		this.findEach(object,function(value,index){
			return _function(value,index);
		},function(value,index){
			result=inject_function(result,value,index);
		});
		return result;
	},
	conpaction : function(object){
		return this.findAll(object,function(value,index){
			return value!=null;
		});
	}
}
Base.Iterator.Prototype={
	each : function(_function){
		try{
			var index=0;
			this._each(function(value){
				_function(value,index++);
			});
		}catch(e){
			if(e!=$break){
				throw e;
			}
		}
	},
	findAll : function(_function){
		var result=[];
		this.each(function(value,index){
			if(_function(value,index)){
				result[result.length]=value;
			}
		});
		return result;
	},
	find : function(_function){
		var result;
		this.each(function(value,index){
			if(_function(value,index)){
				result=value;
				throw $break;
			}
		});
		return result;
	},
	and : function(_function){
		var result=true;
		this.each(function(value,index){
			result=result&&!!_function(value,index);
			if(!result){
				throw $break;
			}
		});
		return result;
	},
	or : function(_function){
		var result=false;
		this.each(function(value,index){
			if(result=!!_function(value,index)){
				throw $break;
			}
		});
		return result;
	},
	inject : function(result,_function){
		this.each(function(value,index){
			result=_function(result,value,index);
		});
		return result;
	},
	map : function(_function){
		var result=[];
		this.each(function(value,index){
			result[result.length]=_function(value,index);
		});
		return result;
	},
	filter : function(filter){
		var result=[];
		if(isString(filter)){
			filter=new RegExp(filter);
		}
		return this.findAll(function(value){
			return !filter.test(value);
		});
	},
	property : function(property){
		return this.findAll(function(value){
			return isProperty(value,property);
		});
	},
	findMap : function(_function,map_function){
		var result=[];
		this.findEach(function(value,index){
			return _function(value,index);
		},function(value,index){
			result[result.length]=map_function(value,index);
		});
		return result;
	},
	findInject : function(_function,result,inject_function){
		this.findEach(function(value,index){
			return _function(value,index);
		},function(value,index){
			result=inject_function(result,value,index);
		});
		return result;
	},
	findEach : function(_function,each_function){
		this.each(function(value,index){
			if(!!_function(value,index)){
				each_function(value,index);
			}
		});
	},
	conpaction : function(object){
		return this.findAll(function(value,index){
			return value!=null;
		});
	}
}
Base._this={}
Base._this.Iterator={}
Base._this.Iterator.Static={
	each : function(object,_function){
		this._each(object,_function);
	}
}
Base._this.Iterator.Prototype={
	each : function(_function){
		this._each(_function);
	}
}
// 繰り返し処理を行うObject
var Iterator={}
Iterator._this=_extends({},Base._this.Iterator.Static,{
	_each : function(object,_function){
		for(var i=0,x,n;(x=object[i])||(i<(n||(n=object.length)));i++){
			_function.call(x,i);
		}
	}
});
Iterator.array=_extends({},Base.Iterator.Static,{
	_each : function(array,_function){
		for(var i=0,x,n;(x=array[i])||(i<(n||(n=array.length)));i++){
			_function(x);
		}
	}
});
Iterator.object=_extends({},Base.Iterator.Static,{
	_each : function(object,_function){
		for(var property in object){
			_function({
				key : property,
				value : object[property]
			});
		}
	}
});
Iterator.hash=_extends({},Base.Iterator.Static,{
	_each : function(hash,_function){
		for(var key in hash){
			_function(hash[key],key);
		}
	},
	each : function(hash,_function){
		try{
			this._each(hash,function(value,key){
				_function(value,key);
			});
		}catch(e){
			if(e!=$break){
				throw e;
			}
		}
	}
});
var DOM={}
DOM.child=_extends({},Base.Iterator.Static,Base.DOM.Methods.Static,{
	_each : function(node,_function){
		Iterator.array._each(node.getElementsByTagName("*"),function(child){
			_function(child);
		});
	}
});
DOM.next=_extends({},Base.Iterator.Static,Base.DOM.Methods.Static,{
	_each : function(node,_function){
		while(node=node.nextSibling){
			_function(node);
		}
	}
});
DOM.prev=_extends({},Base.Iterator.Static,Base.DOM.Methods.Static,{
	_each : function(node,_function){
		while(node=node.previousSibling){
			_function(node);
		}
	}
});
DOM.parent=_extends({},Base.Iterator.Static,Base.DOM.Methods.Static,{
	_each : function(node,_function){
		while(node=node.parentNode){
			_function(node);
		}
	}
});
DOM.Methods={}
DOM.Methods.Static={
	getStyle : function(elem,style){
		style=(style+"").capitalize();
		var value=elem.style[style]||elem.currentStyle[style];
		if(!value){
			return null;
		}
		if((value=="auto"||(value+"").indexOf("px")!==-1)&&(style=="width"||style=="height")&&this.getStyle(elem,"display")!="none"){
			return elem["offset"+style.upper()];
		}
		return value;
	},
	setStyle : function(elme,style,value){
		elem.style[style]=value;
	},
	hasClassName : function(elem,className){
		return (elem.className||"").contain(className);
	},
	addClassName : function(elem,className){
		if(!this.hasClassName(elem,className)){
			elem.className+=" "+className.compact(className);
		}
	},
	removeClassName : function(elem,className){
		elem.className=(' '+elem.className+' ').replace(' '+className,'').compact();
	}
}

// DOMノードタイプ
DOM.NODE_TYPE={
	ELEMENT : 1,
	ATTRIBUTE : 2,
	TEXT : 3
}
DOM.Patterns={
	getClass : function(className){
		return new RegExp("(^|\\s+)"+className+"(\\s+|$)");
	}
}
_extend(String.prototype,{
	evalJSON : function(json){
		return eval("("+json+")");
	},
	// 指定した単語が含まれるか
	contain : function(string){
		return (" "+this+" ").indexOf(" "+string+" ")>-1;
	},
	// ハイフン区切りを大文字区切りに変更する
	capitalize : function(){
		var value=this;
		var split=value.split("-");
		var result="";
		result+=split[0]||"";
		for(var i=1,n=split.length;i<n;i++){
			result+=split[i].upper();
		}
		return result;
	},
	// 最初の文字を大文字にする
	upper : function(){
		return this.charAt(0).toUpperCase()+this.substring(1);
	},
	// 単語の始まりと終わりのスペースを取り除く
	compact : function(){
		return this.replace(/^\s+/,'').replace(/\s+$/,'');
	},
	//サニタイジング
	sanitizing : function(){
		return this.replace("&","&amp;")
					.replace(/\'/,"&#39;")
					.replace(/</gi,"&lt;")
					.replace(/>/gi,"&gt;")
					.replace(/\"/gi,'&quot;');
	},
	// 始まりと終わりの空白文字を取り除く
	strip : function(){
		return this.replace(/^\s+/,"").replace(/\s+$/,"");
	},
	// 全ての空白文字を取り除く
	stripAll : function(){
		return this.replace(/\s+/g,"");
	},
	convert : function(pattern/*,replacement*/){
		return this.replace(pattern,arguments[1]||"");
	},
	//金額表示にする
	moneyTranceform : function(){
		try{
			var value = this;
			var moneyFormat = new Array(0);
			var count = 0;
			for(var i = this.length-1; i >= 0 ; i--){
				if(count % 3 == 0 && count != 0)moneyFormat.push(",");
				moneyFormat.push(value.charAt(i));
				count++;
			}

			value = "";
			for(var i = moneyFormat.length-1;i >= 0;i--){
				value += moneyFormat[i];
			}
			return value;
		}catch(e){alert(e +" moneyTranceform");}
	},
	makeMoneyformatTranceformIntformat:function(){
		try{
		var value = this.split(',');
		var returnValue = "";
		_for(value,function(elem){
			returnValue += elem;
		});

		return returnValue;
		}catch(e){alert(e +" makeMoneyformatTanceformIntformat");}
	}

});
_extends(Array.prototype,Base.Iterator.Prototype,{
	_each : function(_function){
		for(var i=0,x,n;(x=this[i])||(i<(n||(n=this.length)));i++){
			_function(x);
		}
	},
	// 指定した範囲のみ繰り返し処理を行う
	sliceEach : function(_function,start,end){
		start=start||0;
		end=end||this.length;
		this.slice(start,end).each(function(value,index){
			_function(value,index);
		});
	}
});
// $$関数
// 使用例
/*
	var elem=document.body;
	elem=$$(elem);
	elem.html("hello work");
*/
(function(window,undefined){
	var toString=Object.prototype.toString;
	var concat=Array.prototype.concat;
	var push=Array.prototype.push;
	var slice=Array.prototype.slice;
	var splice=Array.prototype.splice;
	function now(){
		return new Date().getTime();
	}
	function isFunction(obj){
		return toString.call(obj)==="[object Function]";
	}
	function isObject(obj){
		return toString.call(obj)==="[object Object]";
	}
	function isArray(obj){
		return toString.call(obj)==="[object Array]";
	}
	var patterns = {
		tag : /(<.*>){1,2}/
	}
	var js=function(e){
		return js.Object.instance(e);
	}
	js.Object=js.prototype={
		length:0,
		size:function(){
			return this.length;
		},
		// 繰り返し処理
		each:function(_function){
			return js.each(this,_function);
		},
		// 新しいインスタンスを作成する
		instance:function(e){
			e=e||document.body;
			if(e.nodeType){
				this[this.length++]=e;
			}else if(isProperty(e,"length")){
				for(var i=0,_e;_e=e[i];i++){
					this[this.length++]=_e;
				}
			}else if(isString(e)){
				if(patterns.tag.test(e)){
					this[this.length++]=_create(e);
				}
			}
			return this;
		}
	}
	js.Object.instance.prototype=js.Object;
	// 拡張する
	js.extend=js.Object.extend=function(src){
		for(var property in src){
			if(this[property]===src[property]){
				continue;
			}
			this[property]=src[property];
		}
		return this;
	}
	js.extend({
		each:function(elems,_function){
			for(var i=0,elem;elem=elems[i];i++){
				_function.call(elem,i);
			}
			return elems;
		},
		attr : function(elems,attr,val){
			if(val!==undefined){
				return this.each(elems,function(){
					this[attr]=val;
				});
			}else if(attr!==undefined){
				return elems[0][attr];
			}
		},
		html : function(elems,html){
			return js.attr(elems,"innerHTML",html);
		},
		text : function(elems,text){
			return js.attr(elems,"innerText",text);
		},
		append : function(elems,elem){
			return js.each(elems,function(){
				this.appendChild(elem);
			});
		}
	});
	js.Object.extend({
		each : function(_function){
			return js.each(this,_function);
		},
		attr : function(attr,val){
			return js.attr(this,attr,val);
		},
		html : function(html){
			return js.html(this,html);
		},
		text : function(text){
			return js.text(this,text);
		},
		append : function(elem){
			return js.append(this,elem);
		}
	});
	window.$$=js;
})(window);
// keyCode定数
window.KEY_CODE={
	BACK_SPACE:8,
	TAB:9,
	ENTER:13,
	SHIFT:16,
	CTRL:17,
	ALT:18,
	PAUSE:19,
	ESC:27,
	MUHENKAN:29,
	SPACE:32,
	PAGE_UP:33,
	PAGE_DOWN:34,
	END:35,
	HOME:36,
	LEFT:37,
	UP:38,
	RIGHT:39,
	DOWN:40,
	INSERT:45,
	DELETE:46,
	F1:112,
	F2:113,
	F3:114,
	F4:115,
	F5:116,
	F6:117,
	F7:118,
	F8:119,
	F9:120,
	F10:121,
	F11:122,
	F12:123,
	NUM_LOCK:144,
	HAN_ZEN:224
}
// キャッシュを行う領域
window.Catch={}
// work_space
window.WorkSpace={}

if(!document.getElementsByClassName){
	document.getElementsByClassName=function(className){
		return DOM.child.getElementsByClassName(document,className);
	}
}
// maxheight属性が付いているオブジェクトに対してスクロールバーの表示／非表示をする
function scrollSet(id){
	try{
		if(id){
			scrollSet.set($(id));
		}else{
			scrollSet.load();
			scrollSet.exe();
		}
	}catch(e){
//			e.stackTrace();
	}
}
scrollSet=_extends(scrollSet,{
	load : function(){
		Catch.scrollSet=Catch.scrollSet||DOM.child.findAll(document.body,function(elem){
			return isProperty(elem,"maxheight");
		});
	},
	exe : function(){
		(Catch.scrollSet||[]).each(function(elem){
			scrollSet.set(elem);
		});
	},
	set : function(elem){
		var height=getStyle(elem,"height");
		var maxHeight=(elem["maxheight"]+"").replace("px","");
		if(height>maxHeight){
			elem.style.overflowY="scroll";
			elem.style.height=maxHeight;
			elem.style.width="0px";
		}else{
			elem.style.overflowY="";
		}
	}
});

_extend(Date,{
	weekList : [
		"月",
		"火",
		"水",
		"木",
		"金",
		"土",
		"日"
	]
});
_extend(Date.prototype,{
	getLastDayOfMonth : function(){
		var wk=new Date(this.getFullYear(),this.getMonth(),1);
		wk.setDate(0);
		return wk.getDate();
	},
	getFirstDateObject : function(){
		return new Date(this.getFullYear(),this,getMonth(),1);
	},
	// 日付のフォーマットを行う
	// 使用例
	/*
		var obj=new Date();
		alert(obj.format(yyyy年mm月dd日 (aaaa) hh時nn分ss秒));
	*/
	// デフォルトはyyyy-mm-dd
	// 形式
	// yyyy	->	年 2011
	// mm	->	月 (01~12)
	// m	->	月 (1~12)
	// dd	->	日 (01-31)
	// d	->	日 (1~31)
	// hh	->	時 (01~24)
	// h	->	時 (1~24)
	// nn	->	分 (01~60)
	// n	->	分 (1~60)
	// ss	->	秒 (01~60)
	// s	->	秒 (1~60)
	// aaaa	->	曜日 (月曜日~日曜日)
	// aaa	->	曜日 (月~日)
	// w	->	曜日 (1~7)
	// t	->	timestamp
	format : function(format){
		format=(format||"yyyy-mm-dd")+"";
		var year=this.getFullYear();
		var month=this.getMonth()+1;
		var date=this.getDate();
		var hours=this.getHours();
		var minutes=this.getMinutes();
		var seconds=this.getSeconds();
		var time=this.getTime();
		var wd=this.getDay();
		if(month<10){
			month="0"+month;
		}
		if(date<10){
			date="0"+date;
		}
		if(hours<10){
			hours="0"+hours;
		}
		if(minutes<10){
			minutes="0"+minutes;
		}
		if(seconds<10){
			seconds="0"+seconds;
		}
		var result="";
		for(var i=0,x,n=format.length;i<n;){
			if(format.substr(i,x=4)==="yyyy"){
				result+=year;
			}else if(format.substr(i,x=2)==="yy"){
				result+=(year+"").substr(2);
			}else if(format.substr(i,x=1)==="y"){
				result+=(year+"").substr(3);
			}else if(format.substr(i,x=2)==="mm"){
				result+=month;
			}else if(format.substr(i,x=1)==="m"){
				result+=eval(month);
			}else if(format.substr(i,x=2)==="dd"){
				result+=date;
			}else if(format.substr(i,x=1)==="d"){
				result+=eval(date);
			}else if(format.substr(i,x=2)==="hh"){
				result+=hours;
			}else if(format.substr(i,x=1)==="h"){
				result+=eval(hours);
			}else if(format.substr(i,x=2)==="nn"){
				result+=minutes;
			}else if(format.substr(i,x=1)==="n"){
				result+=eval(minutes);
			}else if(format.substr(i,x=2)==="ss"){
				result+=seconds;
			}else if(format.substr(i,x=1)==="s"){
				result+=eval(seconds);
			}else if(format.substr(i,x=4)==="aaaa"){
				result+=Date.weekList[wd]+"曜日";
			}else if(format.substr(i,x=3)==="aaa"){
				result+=Date.weekList[wd];
			}else if(format.substr(i,x=1)==="w"){
				result+=wd;
			}else if(format.substr(i,x=1)==="t"){
				result+=time;
			}else{
				result+=format.charAt(i++);
				continue;
			}
			i+=x;
		}
		return result;
	},
	// timeを取得する
	time : function(){
		return this.getTime();
	},
	// 年を取得する
	year : function(){
		return this.getFullYear();
	},
	// 月を取得する 現在の月で返す
	month : function(){
		return this.getMonth()+1;
	},
	// 日を取得する
	date : function(){
		return this.getDate();
	},
	hours : function(){
		return this.getHours();
	},
	minutes : function(){
		return this.getMinnutes();
	},
	seconds : function(){
		return this.getSeconds();
	},
	milliseconds : function(){
		return this.getMilliseconds();
	}
});
// クラスを定義する
// getter/setterは自動生成される
// 対応するgetter/setterが定義されてある場合は
// 定義済みが優先される
// Prototyeのフィールドの値を'_'で始まる場合は
// getter/setterは自動生成されない
// 使用例
/*
	var testClass=Class({
		// コンストラクタの定義
		__constructor : function(){
			return this;
		},
		// static フィールドの定義
		Static : {
			VALUE : 1,
			VALUE2 : 2
		},
		// メソッド及びフィールドの定義
		Prototype : {
			empNo : 0,
			name : null,
			_privateField : 0,
			getEmpNo : function(){
				return this.empNo;
			},
			getName : function(){
				return this.name;
			}
		}
	});
	// インスタンスの生成
	var test=new testClass();
	test.setEmpNo(30);
	test.setName("てすと");
	alert(test.getEmpNo());
	alert(test.getName());
*/
(function(window,undefined){
	function isFunction(object){
		return typeof object==="function";
	}
	function Class(signature){
		signature=signature||{};
		var constructor=signature.__constructor||function(x){ return x };
		function _class(){
			constructor.apply(this,arguments);
		}
		var Static=signature.Static||{};
		var Prototype=signature.Prototype||{};
		_extends(_class,Static);
		var array=[];
		Iterator.hash.each(Prototype,function(value,key){
			key+="";
			if(!isFunction(value)&&key.indexOf("_")!=0){
				var Key=key.upper();
				var getterName="get"+Key;
				var setterName="set"+Key;
				var getter=getterName+":"+"function(){return this."+key+"}";
				var setter=setterName+":"+"function("+key+"){this."+key+"="+key+"}";
				array[array.length++]=getter;
				array[array.length++]=setter;
			}
		});
		Iterator.hash.each(eval("({"+array.join(",")+"})"),function(value,key){
			if(!Prototype[key]){
				Prototype[key]=value;
			}
		});
		_extends(_class.prototype,Prototype);
		_class.prototype.constructor=_class;
		return _class;
	}
	window.Class=Class;
})(window);
// load
function load(fn){
	Event.add(window,'load',fn);
};
// 数値を返す
function _int(value){
	return +value;
}
(function(){
	// 新しいメソッドを追加する
	function addFunction(args,append){
		for(var name in args){
			if(!isProperty(window,name)||!append){
				window[name]=args[name];
			}else{
				alert(name+"は\n"+window[name]+"\nで定義済みです。");
			}
		}
	}
	window.addFunction=addFunction;
})();
/*
 * 行を削除する
*/
function removeTr(elem1){
	var arr;
	if(isProperty(elem1,"length")){
		arr=$A(elem1);
		arr.reverse();
	}else{
		arr=[elem1];
	}
	arr.each(function(elem){
		var s_tr="tr";
		var tr=elem.tagName.toLowerCase()===s_tr ? elem : getParentElementByTagName(elem,s_tr);
		var tbody=getParentElementByTagName(tr,"tbody");
		tbody.removeChild(tr);
	});
}
// 空のファンクション
function emptyFunction(){}
// デフォルトファンクション
function defaultFunction(x){return x}
// 区切り文字
function $w(s/* ,kugiri */){
	var kugiri=arguments[1]||",";
	return s.split(kugiri);
}
// ロードが完了したときに呼び出される関数を定義する
function initialize(_function){
	if(!document.body){
		setTimeout(initialize,10);
	}
}
(function(){
	function getObject(object){
		return object||{}
	}
	// 画面の表示制御を行う為に必要となるVO
	window.ViewControllerVO=Class({
		__constructor : function(contents,attrName){
			this.setContents(contents);
			this.setAttrName(attrName);
			return this;
		},
		Prototype : {
			contents : {},
			attrName : "control",
			base : {},
			constant : {},
			addContents : function(args){
				_extends(this.contents,args);
			},
			addBase : function(args){
				_extends(this.base,args);
			},
			addConstant : function(args){
				_extends(this.constant,args);
			}
		}
	});
	var all=function(){
		return document.all;
	}
	function access(content,elem,self){
		if(isString(content)){
			elem.innerHTML=content;
		}else if(isFunction(content)){
			content.call(self,elem);
		}else{
			return false;
		}
		return true;
	}
	window.ViewController=Class({
		__constructor : function(viewControllerVO){
			this.id=(new Date).time()+"_";
			with(document){
				write("<style>");
				write("#");
				write(this.attrName);
				write(",#constant");
				write("{display:none;}</style>");
			}
			this.cache={};
			this.contents=viewControllerVO.getContents();
			this.memory.constant=viewControllerVO.getConstant();
			this.attrName="control";

			var self=this;
			Iterator.object.each(this.base=viewControllerVO.getBase(),function(object){
				if(!isProperty(self,object.key)&&isFunction(object.value)){
					self[object.key]=object.value;
				}
			});
			return this;
		},
		Static : {
			no : 0,
			getUnique : function(){
				return "unique_"+(++this.no);
			}
		},
		Prototype : {
			init : function(){
				var cache=this.cache;
				cache.parts={};
				var attrName=this.attrName;
				var caseName=this.caseName;
				var self=this;
				var base=this.base;
				Iterator.array.each($TN("div"),function(elem){
					if(isProperty(elem,self.caseName)){
						var parent=elem.parentNode;
						var uid=parent.uid||(parent.uid=ViewController.getUnique());
						elem[self.caseName].stripAll().split("||").each(function(name){
							(cache[uid]||(cache[uid]={}))[name]=elem.innerHTML;
						});
					}else if(isProperty(elem,self.partsName)){
						(cache.parts||(cache.parts={}))[elem[self.partsName]]=elem;
					}
				});
				this.loadConstant();
			},
			loadConstant : function(){
				var constant=($('constant')||{}).innerHTML||"";
				var text=constant.stripAll().replace(/;$/g,"");
				var data=text.split(";").map(function(value){
					var x= value.split("=").map(function(v){
						return "'"+v+"'";
					}).join(":");
					return x;
				}).join(",");
				var text=data;
				if(text!=="''"){
					var obj=eval("({"+text+"})");
					this.memory.constant=_extend(this.constant,obj);
				}
				/*var self=this;
				var constant=$('constant')||{};
				var text=constant.innerHTML||"";
				text=text.strip().convert(/;$/);
				text.split(";").each(function(value){
					value=value.convert("=","\s");
					var values=value.split("\s",2);
					var key=values.shift();
					value=values.shift();
					value=value.convert(/\$\w+/g,function(s){
						return s;
						//return memory[s]||s;
					});
					value=value.convert(/\+/g);
					alert(self.memory.constant[key]);
					//status=self.memory.constant[key]=value;
				});*/
			},

			constant : {},
			contents : {},
			memory : {},
			attrName : "control",
			caseName : "case",
			partsName : "partsName",
			isLoadParts : false,
			loaded : false,
			hide :function(elem){
				elem.style.display="none";
			},
			show : function(elem){
				elem.style.display="block";
			},
			loadParts : function(){
				this.init();
			},
			getHTML : function(name){
				var elem=this.cache.parts[name];
				return elem.innerHTML;
			},
			getElem : function(name){
				return this.parts[name];
			},
			Date : function(){
				return (new Date);
			},
			getPartsHTML : function(partsName){
				return this.getPartsElem(partsName).innreHTML;
			},
			getPartsElem : function(partsName){
				return this.cache.parts[partsName];
			},
			operation : {
			},
			creteria : {
				"" : function(args){
					return args.operator.split("||").or(function(name){ return name===args.state });
				},
				"@" : function(args){
					var operators=args.operator.substr(1).split("==");
					var name=operators.shift();
					var value=operators.shift();
					var elem=$(name);
					return elem.value===value;
				},
				"undefined" : function(args){
				}
			},
			control : function(state){
				var attrName=this.getAttrName();
				var contents=this.getContents();
				var before=contents.before||emptyFunction;
				var after=contents.after||emptyFunction;
				var self=this;
				var root=Iterator.array.map(arguments,function(state){ return state });
				var state=root.join(".");
				root.splice(0,0,"contents");
				var path=root.join(".");
				var cache=this.cache;
				var base=this.base;
				contents=eval(path);
				before.call(this);
				(contents.before||emptyFunction).call(this);
				DOM.child.findEach(document.documentElement,function(elem){
					return isProperty(elem,attrName);
				},function(elem){
					elem[attrName].stripAll().split(",").each(function(name){
						var content;
						name=name.replace(/\$\w+/g,function(value){
							if(!isProperty(self.memory.constant,value)){
								alert(value+"は、定義されていません");
							}
							return self.memory.constant[value];
						});
						if(name.indexOf("?")>0){
							var first=name.substr(0,1);
							var names=name.split(/\?|:/);
							var operator=names.shift();
							var _true=names.shift();
							var _false=names.shift();
							first=first.replace(/\w/,"");
							var operation=self.creteria[first];
							var result=operation({ operator : operator , state : state });
							if(result===true){
								name=_true;
							}else if(result===false){
								name=_false;
							}
							content=contents[name]||self.base[name];
						}else{
							content=contents[name];
						}
						if(isCase(content)){
							content=(cache[elem.uid]||{})[state]||content.arg||" ";
						}
						access(content,elem,self);
					});
				});
				(contents.after||emptyFunction).call(this);
				after.call(this);
				this.loaded=true;
			}
		}
	});
})();
// 新しいイベントを追加する
function addEvent(elem,eventName,_function){
	elem.attachEvent(eventName,function(){
		_function.call(elem);
	});
}
function isCase(object){
	return object&&object.objectName==="$case";
}
function $case(arg){
	this.objectName="$case";
	this.arg=arg;
	return this;
}
(function(){
	// 自動連番
	window.AutoNumber={
		name : "autoNumber",
		init : function(name){
			if(name){
				this.setName(name);
			}
			this.reorganization();
		},
		reorganization : function(){
			Iterator.array.each($N(this.name),function(elem,index){
				elem.innerHTML=index+1;
			});
		},
		execute : function(){
			this.reorganization();
		},
		setName : function(name){
			this.name=name;
		}
	}
})();
function parseJSON(json){
	return eval("("+json+")");
}
/*
 * 指定された関数を実行する
 * 未定義なら何も実行しない
*/
function run(_function){
	return (_function||emptyFunction)();
}


	/*
	 * keyの無効化未完成
	*/

	function keyEvent(){
		var elem	= document.activeElement;
		var e		= event;
		if(e.keyCode == 32){
			return false;
		}
		if(!e.ctrlKey&&!e.shiftKey){
			var filter=Filter[elem.filter];
			if(!!filter&&!filter()){
				return false;
			}
		}
	}
	// keyの無効化をするオブジェクト
	var Filter={
		// 数字
		"number" : function(){
			var result=false;
			var keyCode=event.keyCode;
			var keyName=String.fromCharCode(keyCode);
			return /\d/.test(keyName)||Filter._default();
		},
		// 日付
		"date" : function(){
			var keyCode=event.keyCode;
			var keyName=String.fromCharCode(keyCode);
			var hantei=keyCode==191;
			return /\d/.test(keyName)||hantei||Filter._default();
		},
		_default : function(){
			return event.keyCode<48;
		},
		load : function(){
			document.attachEvent("onkeydown" , keyEvent);
		}
	}
//*************************************************************************************
//	外部ファイルの読み込み
//	■ 使用例
//		* <script>タグの指定方法：
//			<script type="text/javascript" src="○○○.js?load=[ファイル名の指定]"></script>
//*************************************************************************************
	var ScriptFunction = {
		require		:	function(fileName) {
			document.write(
				'<script type="text/javascript" src="' + fileName + '.js"><\/script>'
			);
		},
		load		:	function() {
			$A($TN('script')).findAll(function(s) {
				return (s.src && s.src.match(/script\.js(\?.*)?$/));
			}).each(function(s) {
				var path = s.src.replace(/script\.js(\?.*)?$/, '');
				var files = s.src.match(/\?.*load=([a-zA-Z0-9_,]*)/);
				if (files) {
					files = files[1].split(',');
					files.each(function(f) {
						ScriptFunction.require(path + f);
					});
				}
			});
		}
	};
	// ロードの実行
	ScriptFunction.load();

//**********************************************************************
//	レポートデザインファイルを表示する
//	paramTag:レポートパラメータを保持するタグ
//	name属性にパラメータのKeyを指定し、value属性にパラメータを指定する
//**********************************************************************
	// サブ画面を保持する変数
	var serviceWindow = null;
	function openReportDesign(action, fileName, paramTag) {
		var shorimei = document.forms[0].shorimei.value;
		//BIRTパラメータ
		var format = "pdf"

		// サブ画面が開いている間は、サブ画面をフォーカスする
		if (captureWindow(serviceWindow))return;
		// サブ画面へのパスを作成する
		var path = '/ryoukanri/backflow?action=' + action +
									'&__report=' + fileName +
									'&__format=' + format+
									'&__parameterpage=false'+
									'&shorimei='+ shorimei ;

		if(arguments.length > 2){
			for(var x=2; x<arguments.length;x++){
				path += '&'+arguments[x].name+'='+ arguments[x].value;
			}
		}

		// オプションの作成
		var option =
				'left=200,' +
				'top=100,' +
				'width=750,' +
				'height=500,' +
				'toolbar=no,' +
				'location=no,' +
				'status=yes,' +
				'resizable=no,' +
				'scrollbar=no'
		;
		// サブ画面の表示
		return reportWindow = window.open(path,"reportWindow",option);
	}
/**
 * 非同期で繰り返し処理を行う
 * @param{Array} array
 * @param{function(*,number)} proccess arrayの各要素に適用させる関数
 * @param{function(Array)=} [callback=Function] 全ての処理が完了した際、arrayに適用される関数
 */
	function proccessArray(array, proccess, callback) {
		var i=0;
		var clone=[];
		while(clone[i]=array[i++]);
		i=0;
		clone.length&&(clone.length--);
		if(!clone.length){
			return;
		}
		setTimeout(function() {
			proccess(clone.shift(),i++);
			if(clone.length > 0) {
				setTimeout(arguments.callee, 13);
			} else {
				(callback||function(){})(array);
			}
		}, 25);
	}

/**
 * デバッグオブジェクト
 * @namespace dt
 */
var dt = (function () {
	var start = 0;
	return {
		/**
		 * 処理の開始時刻
		 */
		s:function () {
			start = +new Date;
		} ,
		/**
		 * 処理の開始から現在までの時間をミリ秒単位で返す
		 * @param{function(number)} [fn=Function] 処理が終了した際に呼ばれる関す 引数には処理時間が入る
		 */
		e:function (fn) {
			fn || (fn = function () {
				status = this;
			});
			var time = +new Date - start;
			fn.call(time);
		}
	}
}());

