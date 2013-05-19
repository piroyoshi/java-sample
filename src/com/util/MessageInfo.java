package com.util;

import java.util.ResourceBundle;


/*
 * メッセージ・プロパティファイルアクセスクラス
 */
public class MessageInfo {

	/* プロパティファイル名称 */
	private final static String bundle = "com.properties.message";
	/* リソースバンドルオブジェクト */
	private static ResourceBundle rd = null;

	/* リソースバンドルオブジェクトとプロパティファイルを結びつける */
	static {
		rd = ResourceBundle.getBundle(bundle);
	}


	/*
	 * プロパティファイルから、キーを指定して値を取得する
	 */
	public static String getString(String key) throws Exception {
		if(key == null || key.length() == 0) {
			throw new Exception("key is null or empty.");
		}
		String value = rd.getString(key);
		if(value ==null || value.length() == 0){
			throw new Exception("value[key:]"+ key + "] is empty.");
		}
		return value;
	}
}
