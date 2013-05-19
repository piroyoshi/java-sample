package com.action.scn001;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.base.InterfaceAction;

public class LoginAction implements InterfaceAction {

	public String execute(HttpServletRequest request,
			HttpServletResponse response) {

		// セッション獲得
		HttpSession session = request.getSession(true);
		// サーブレットパス
		String servletPath = request.getServletPath();

		// リクエストから値を取得
		String userId = request.getParameter("userId");
		String password = request.getParameter("password");

		return SUCCESS;
	}
}
