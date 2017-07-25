package com.myinvestor.util;

import java.net.MalformedURLException;
import java.net.URL;

import javax.servlet.ServletContext;

import org.apache.commons.configuration2.XMLConfiguration;
import org.apache.commons.configuration2.builder.fluent.Configurations;
import org.apache.commons.configuration2.ex.ConfigurationException;

/**
 * Application configuration helper.
 * 
 */
public final class AppConfig {

	// https://stackoverflow.com/questions/2797162/getresourceasstream-is-always-returning-null

	private static final String CONFIG_FILE_NAME = "/WEB-INF/config.xml";
	private static XMLConfiguration config;

	private AppConfig() {

	}

	public static String getAppEngineProjectId() {
		return config.getString("appengine.project-id");
	}
	
	public static String getEndPointsUrlPattern() {
		return config.getString("appengine.endpoints-url-pattern");
	}

	/**
	 * This must be called in the servlet initializer.
	 * 
	 * @param context Servlet context
	 * @throws MalformedURLException URL exception.
	 * @throws ConfigurationException Configuration exception.
	 */
	public static void configure(final ServletContext context) throws MalformedURLException, ConfigurationException {
		final URL url = context.getResource(CONFIG_FILE_NAME);
		Configurations configs = new Configurations();
		config = configs.xml(url);
	}
}
