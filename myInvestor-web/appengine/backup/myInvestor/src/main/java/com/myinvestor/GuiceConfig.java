package com.myinvestor;

import java.util.Map;

import javax.inject.Singleton;
import javax.servlet.ServletContextEvent;

import com.google.appengine.api.appidentity.AppIdentityServiceFactory;
import com.google.appengine.tools.appstats.AppstatsFilter;
import com.google.appengine.tools.appstats.AppstatsServlet;
import com.google.common.collect.Maps;
import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import com.google.inject.matcher.Matchers;
import com.google.inject.servlet.GuiceServletContextListener;
import com.google.inject.servlet.ServletModule;
import com.googlecode.objectify.ObjectifyFilter;
import com.myinvestor.datastore.OfyService;
import com.myinvestor.service.TestService;
import com.myinvestor.util.ObjectMapperProvider;
import com.myinvestor.util.txn.Transact;
import com.myinvestor.util.txn.TransactInterceptor;
import com.sun.jersey.guice.spi.container.servlet.GuiceContainer;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public class GuiceConfig extends GuiceServletContextListener {

	static class MyInvestorServletModule extends ServletModule {

		@Override
		protected void configureServlets() {
			filter("/*").through(ObjectifyFilter.class);
			Map<String, String> params = Maps.newHashMap();
			params.put("com.sun.jersey.config.property.packages", "com.myinvestor.service");
			serve("/service/*").with(GuiceContainer.class, params);
		}
	}

	public static class MyInvestorModule extends AbstractModule {

		@Override
		protected void configure() {
			requestStaticInjection(OfyService.class);

			// Lets us use @Transact
			bindInterceptor(Matchers.any(), Matchers.annotatedWith(Transact.class), new TransactInterceptor());

			// Use jackson for jaxrs
			bind(ObjectMapperProvider.class);

			// External things that don't have Guice annotations
			bind(ObjectifyFilter.class).in(Singleton.class);

			bind(TestService.class);
			
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