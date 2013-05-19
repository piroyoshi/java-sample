package com.base;

@SuppressWarnings("serial")
public class AdminException extends Exception{

	// コンストラクタ
	public AdminException(Throwable e) {
		super(e);
	}

	// デフォルトコンストラクタ
	public AdminException() {
		super();
	}
}
