package com.util;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/*
 * オブジェクト操作のユーティリティクラス
 */
public class ObjectUtil {

	/**
	 * Stringの空文字チェック
	 */
	public static boolean isEmpty(String val) {
		return val==null || val.equals("");
	}


	/**
	 * ArrayListの空チェック
	 */
	public static boolean isEmpty(ArrayList<?> list) {
		return list==null || list.isEmpty();
	}


	/**
	 * 対象文字列に対する、指定文字の左詰め
	 */
	public static String padLeft(String target, String pad, int len) {
		// 対象文字列がNULL、または空の場合はそのまま返却する
		if (target==null || target.equals("")) {
			return target;
		}

		// 指定された桁数に達するまで、指定文字列を文字列結合する
		StringBuffer sb = new StringBuffer();
		while (sb.length() < (len - target.length())) {
			sb.append(pad);
		}
		sb.append(target);
		// 処理結果の返却
		return sb.toString();
	}


	/**
	 * 値が半角数字であるかをチェックする（文字列指定）
	 */
	public static boolean isNumeric(String val) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher matcher = pattern.matcher(val);
		return matcher.matches();
	}


	/**
	 * 値が半角数字であるかをチェックする（Character指定）
	 */
	public static boolean isNumeric(char val) {
		return isNumeric(String.valueOf(val));
	}


	/**
	 * 年度を取得する
	 */
	public static int getFiscalYear() {
		// 現在の西暦を取得する
		Calendar now = Calendar.getInstance();
		int year = now.get(Calendar.YEAR);
		// 年度数えにするため、1月～3月の場合は前年に合わせる
		if (now.get(Calendar.MONTH) < Calendar.APRIL) {
			year -= 1;
		}
		// 年度を返却する
		return year;
	}

	/**
	 * 日付取得(フォーマットしたもの)
	 * 「2010年06月29日　午後03:20」のように表示
	 */
	public static String getTimestamp() {
		DateFormat df = new SimpleDateFormat("yyyy年MM月dd日' 'a hh:mm", Locale.JAPAN);
		return df.format(new Date());
	}

	/**
	 * フォーマット済日付を取得する
	 * 「2010/06/29 12:34:56.789」のように表示
	 * ※24時間制。「午後1時」は「13時」に変換される
	 */
	public static String parseTimestamp(Date now){
		String parse = "", ap = "";
		int h = 0;
		DateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss.SSS", Locale.JAPAN);
		DateFormat ampm = new SimpleDateFormat("a", Locale.JAPAN);
		parse = df.format(now);
		ap = ampm.format(now);
		if(ap.equals("午後")) {
			h = Integer.valueOf(parse.substring(11, 13));
			h = h+12;
			parse = parse.substring(0,11)+String.valueOf(h)+parse.substring(13);
		}
		return parse;
	}


	/**
	 * 日付をフォーマットする
	 * 引数で与えた文字で区切る
	 */
	public static String dateFormat(Date now , String s) {
		DateFormat df = new SimpleDateFormat("yyyy"+s+"MM"+s+"dd", Locale.JAPAN);
		return df.format(now);
	}

	/**
	 * 日付取得(フォーマッド済み)
	 * 表示形式「yyyy年MM月dd日」
	 */
	public static String getCurrentDate(){
		Date now = new Date();
		String parse = "";
		DateFormat df = new SimpleDateFormat("yyyy年MM月dd日", Locale.JAPAN);
		parse = df.format(now);
		return parse;
	}

	/**
	 * 日付取得(フォーマッド済み)
	 * 引数で与えた文字で区切る
	 */
	public static String getCurrentDate(String s){
		Date now = new Date();
		String parse = "";
		DateFormat df = new SimpleDateFormat("yyyy"+s+"MM"+s+"dd", Locale.JAPAN);
		parse = df.format(now);
		return parse;
	}

	/**
	 * 日付フォーマット
	 */
	public static String simpleDateFormat(Date now, String format ){
		String parse = "";
		DateFormat df = new SimpleDateFormat(format, Locale.JAPAN);
		parse = df.format(now);
		return parse;
	}

	/**
	 * 今月の1日の日付取得(フォーマッド済み)
	 * 引数で与えた文字で区切る
	 */
	public static String getCurrentFirstDate(String s){
		Date now = new Date();
		String parse = "";
		DateFormat df = new SimpleDateFormat("yyyy"+s+"MM"+s+"01", Locale.JAPAN);
		parse = df.format(now);
		return parse;
	}

	/**
	 * yyyy/MM/dd を yyyy/MM の形式で返す
	 *
	 */
	public static String getYearAndMonth(String ymd){

		String ret = ymd.replace("-", "/");
		int endIndex = ret.lastIndexOf("/");
		ret = ret.substring(0, endIndex);
		return ret;
	}

	/**
	 * 指定月の最終日を返す
	 * 指定月は1月なら「1」を指定する
	 */
	public static String getLastDayOfMonth(int month){
		GregorianCalendar gc = new GregorianCalendar();
		if(month>12) {
			month -= 12;
		}
		int feb = 28;
		if(gc.isLeapYear(Calendar.YEAR)) {
			feb = 29;
		}else{
			feb = 28;
		}
		String[] lastDays = {"31", String.valueOf(feb), "31", "30", "31", "30", "31", "31", "30", "31", "30", "31"};
		return lastDays[month-1];
	}
}
