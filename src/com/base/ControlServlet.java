package com.base;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.util.MappingInfo;



/*
 * ユーザーからの全てのリクエストを受け付けるクラス
 */
@SuppressWarnings("serial")
public class ControlServlet extends HttpServlet {

	// 画面/ボタン(リンク)IDを格納するリクエストパラメータの名前
	private String actionParamName = null;

	// 初期化パラメータを取得する
	public void init(ServletConfig config) throws ServletException {
		// アクション名(画面ID/ボタンID)を取得する
		actionParamName = config.getInitParameter("ACTION_PARAM_NAME");
	}

	/*
	 * リクエストを受け付ける
	 */
	protected void service(HttpServletRequest request, HttpServletResponse response)
	throws ServletException, IOException {

		// リクエストディスパッチャー
		RequestDispatcher rd = null;
		try {
			// 画面/ボタン(リンク)IDのリクエストパラメータを取得する
			String action = request.getParameter(actionParamName);

			// サーブレットパスを取得し、リクエストにセットする
			String servletPath = request.getServletPath();
			request.setAttribute("servletPath", servletPath);

			// 値が存在しなければログイン画面に誘導する
			if (action == null || action.length() == 0) {
				// 継続セッションがあれば無効化する
				invalidateSession(request);
				// ログイン画面に遷移する
				rd=loginForward(request);
				rd.forward(request, response);
				return;
			}

			// パラメータから生成するモデルクラス名を取得する
			String clazz = MappingInfo.getString(action);
			// クラス名からクラスをロードする
			Class cls = Class.forName(clazz);
			// ロードしたクラスのインスタンスを生成する。
			Object obj = cls.newInstance();


			// 生成したインスタンスをIFlowerBean型にキャストする
			InterfaceAction bean = (InterfaceAction)obj;

			// ビジネスロジックを実行する
			// (beanの型はIFlowerBeanインターフェースであるが、
			// 実際のインスタンスは各モデルクラスのもの)
			String status = bean.execute(request,response);
			// 不要なメモリを開放する
			System.gc();
			// ロジックの結果から、遷移すべきJSPのパスを取得する
			String foward = MappingInfo.getString(action + "." + status);
			// 取得したパスからディスパッチオブジェクトを生成する
			rd = request.getRequestDispatcher(foward);
			response.setHeader("targer", "_blank");
			// JSPへディスパッチする
			rd.forward(request, response);

		} catch (Exception e) {
			e.printStackTrace();
			// 継続セッションがあれば無効化する
			invalidateSession(request);
			// システムエラー画面に遷移する
			try {
				rd = request.getRequestDispatcher(MappingInfo.getString("system.error.page"));
			} catch (Exception ex) {}
			rd.forward(request, response);
		}
	}


	/*
	 * セッションを無効化する
	 */
	private void invalidateSession(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session != null) {
			session.invalidate();
		}
	}


	/*
	 * ログイン画面に遷移する
	 */
	private RequestDispatcher loginForward(HttpServletRequest request) {
		RequestDispatcher rd = null;
		// ログイン画面に遷移する
		try {
			// ログイン画面へのパスを取得する
			rd = request.getRequestDispatcher(MappingInfo.getString("default.page"));
		} catch (Exception e) {
e.printStackTrace();
		}
		return rd;
	}
}

