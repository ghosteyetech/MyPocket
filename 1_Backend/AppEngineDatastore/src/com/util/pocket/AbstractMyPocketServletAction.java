package com.util.pocket;

import java.io.IOException;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract class AbstractMyPocketServletAction extends HttpServlet {
	
	protected void sendErrorMessage(HttpServletRequest request, HttpServletResponse response,int code) throws IOException {
		String message;
		switch (code) {
			case 400:
				message = "Bad request";
				break;
			case 500:
				message = "Internal Server Error";
				break;
			case 501:
				message = "Method not implemented";
				break;
			default:
				message = "Unknown Error";
				break;
		}
		
		response.setStatus(code);
		response.getWriter().write(message);
	}
}
