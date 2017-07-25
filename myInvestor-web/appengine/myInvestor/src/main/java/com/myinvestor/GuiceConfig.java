package com.myinvestor;

import java.net.MalformedURLException;
import java.util.Map;

import javax.inject.Singleton;
import javax.servlet.ServletContextEvent;

import org.apache.commons.configuration2.ex.ConfigurationException;

import com.google.api.control.ServiceManagementConfigFilter;
import com.google.api.control.extensions.appengine.GoogleAppEngineControlFilter;
import com.google.api.server.spi.EndpointsServlet;
import com.google.appengine.api.appidentity.AppIdentityServiceFactory;
import com.google.common.collect.Maps;
import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.matcher.Matchers;
import com.google.inject.servlet.GuiceServletContextListener;
import com.google.inject.servlet.ServletModule;
import com.googlecode.objectify.ObjectifyFilter;
import com.myinvestor.datastore.OfyService;
import com.myinvestor.util.txn.Transact;
import com.myinvestor.util.txn.TransactInterceptor;

import lombok.extern.slf4j.Slf4j;

/**
 * Guice servlet configuration.
 * 
 */
@Slf4j
public class GuiceConfig extends GuiceServletContextListener {

	static class MyInvestorServletModule extends ServletModule {

		@Override
		protected void configureServlets() {
			filter("/*").through(ObjectifyFilter.class);

			try {
				// Initialize application configuration
				initConfig();
				Map<String, String> params = Maps.newHashMap();
				params.put("services", "com.myinvestor.service.Investor");
				serve(AppConfig.getEndPointsUrlPattern()).with(EndpointsServlet.class, params);

				// EndPoints filter - https://stackoverflow.com/questions/9021672/how-to-map-a-filter-to-a-servlet-using-guice-servlet
				Map<String, String> endPointsParams = Maps.newHashMap();
				endPointsParams.put("endpoints.projectId", AppConfig.getAppEngineProjectId());
				endPointsParams.put("endpoints.serviceName", "investor-api.endpoints." + AppConfig.getAppEngineProjectId() + ".cloud.goog");
				filter(AppConfig.getEndPointsUrlPattern()).through(GoogleAppEngineControlFilter.class, endPointsParams);
				filter(AppConfig.getEndPointsUrlPattern()).through(ServiceManagementConfigFilter.class);
				
			} catch (ConfigurationException cex) {
				log.error("[configureServlets] Unable to set up application correctory", cex);
			} catch (MalformedURLException mex) {
				log.error("[configureServlets] Unable to load configuration file", mex);
			} 
		}
		
		/**
		 * Initialize application configuration.
		 * 
		 * @throws MalformedURLException
		 * @throws ConfigurationException
		 */
		private void initConfig() throws MalformedURLException, ConfigurationException {
			AppConfig.configure(getServletContext());
		}
	}

	public static class MyInvestorModule extends AbstractModule {

		@Override
		protected void configure() {
			requestStaticInjection(OfyService.class);

			// Lets us use @Transact
			bindInterceptor(Matchers.any(), Matchers.annotatedWith(Transact.class), new TransactInterceptor());

			// External things that don't have Guice annotations
			bind(ObjectifyFilter.class).in(Singleton.class);
			bind(EndpointsServlet.class).in(Singleton.class);
			bind(GoogleAppEngineControlFilter.class).in(Singleton.class);
			bind(ServiceManagementConfigFilter.class).in(Singleton.class);
		}
	}

	/**
	 * Logs the time required to initialize Guice.
	 */
	@Override
	public void contextInitialized(ServletContextEvent sce) {
		long time = System.currentTimeMillis();

		super.contextInitialized(sce);

		// Initialize app
		initApp(sce);

		long millis = System.currentTimeMillis() - time;
		log.info("Guice initialization took " + millis + " millis");
	}

	@Override
	protected Injector getInjector() {
		return Guice.createInjector(new MyInvestorServletModule(), new MyInvestorModule());
	}

	private void initApp(ServletContextEvent sce) {
		final String sca = AppIdentityServiceFactory.getAppIdentityService().getServiceAccountName();
		log.info("Service account name " + sca);
	}
}