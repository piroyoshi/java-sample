package com.base;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;


public class EncodingFilter implements Filter {

	//定数:エンコード指定
	private final static String ENCODE ="UTF-8";


	public void init(FilterConfig config) throws ServletException {}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		request.setCharacterEncoding(ENCODE);
		// サーブレット
		chain.doFilter(request, response);
	}

	public void destroy() {}
}
