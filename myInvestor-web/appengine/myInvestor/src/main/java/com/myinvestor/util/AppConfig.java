package com.myinvestor.util;

import java.net.URL;

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

	public AppConfig() {

	}

	public XMLConfiguration getConfig() throws ConfigurationException {
		Configurations configs = new Configurations();
		final URL url = getClass().getResource(CONFIG_FILE_NAME);
		return configs.xml(url);
	}

	public String getAppEngineId() throws ConfigurationException {
		return getConfig().getString("appengine.project-id");
	}
}
