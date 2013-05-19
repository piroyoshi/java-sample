package com.base;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.util.MappingInfo;

public class URLFilter implements Filter {

	public void init(FilterConfig config) throws ServletException {}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException{

		//リクエストURLの取得
		String url = ((HttpServletRequest)request).getRequestURL().toString();

		// サーブレットへ
		chain.doFilter(request, response);
	}

	public void destroy() {}
}
