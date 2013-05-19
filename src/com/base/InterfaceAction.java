package com.base;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public interface InterfaceAction {

	// execute(...)メソッドの戻り値(正常)
	public final static String SUCCESS = "success";
	// execute(...)メソッドの戻り値(正常)
	public final static String FAILURE = "failure";
	// リクエストオブジェクトへの、アプリケーションメッセージ(情報・エラー)コレクション格納名称
	public final static String APP_MESSAGES = "app_message";

	// ビジネスロジック実行メソッド定義
	public String execute(HttpServletRequest request,HttpServletResponse response);
}
