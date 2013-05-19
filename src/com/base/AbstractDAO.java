package com.base;

import java.sql.Connection;
import java.sql.DriverManager;

import com.util.DBInfo;


/*
 * DAO(Data Access Object)スーパークラス
 * データベース処理実装クラスのスーパークラス
 */
public abstract class AbstractDAO {

	// JDBCドライバクラス名
	private String driverClass = null;
	// DB URL
	private String url = null;
	// DB ユーザID
	private String userId = null;
	// DB パスワード
	private String password = null;


	/** エラーコード(整合性制約違反) */
	public final int INTEGRITY_CONSTRAINT_VIOLATION = 23000;
	/** エラーコード(制限違反) */
	public final int RESTRICT_VIOLATION = 23001;
	/** エラーコード(非NULL違反) */
	public final int NOT_NULL_VIOLATION = 23502;
	/** エラーコード(外部キー違反) */
	public final int FOREIGN_KEY_VIOLATION = 23503;
	/** エラーコード(一意性違反) */
	public final int UNIQUE_VIOLATION = 23505;
	/** エラーコード(検査違反) */
	public final int CHECK_VIOLATION = 23514;

	/**
	 * コンストラクタ
	 * JDBCドライバクラス名、DBのURL、ユーザーID、パスワードを
	 * プロパティファイルから取得する
	 */
	public AbstractDAO() throws Exception {
		driverClass = DBInfo.getString("db.driverClass");
		url = DBInfo.getString("db.url");
		userId = DBInfo.getString("db.userId");
		password = DBInfo.getString("db.password");
	}


	/**
	 * DBコネクションを取得する
	 * 引数には、自動コミットモードを指定する
	 * ※必ず取得先でクローズ処理を実行すること
	 * autoCommit 自動コミットモード(true or false)、複数件の更新処理の場合はfalseを指定すること
	 */
	protected Connection getConnection(boolean autoCommit) throws Exception {
		Connection con = null;

		try{
			Class.forName(driverClass);
			con = DriverManager.getConnection(url, userId, password);
			if(!autoCommit){
				con.setAutoCommit(false);
			}
		} catch (Exception e) {
			throw new Exception(e);
		}
		return con;
	}


	/**
	 * DBコネクションを取得する
	 * ※必ず取得先でクローズ処理を実行すること
	 */
	protected Connection getConnection() throws Exception {
		return getConnection(true);
	}
}
