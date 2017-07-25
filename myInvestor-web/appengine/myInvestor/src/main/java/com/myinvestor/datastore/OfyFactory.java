package com.myinvestor.datastore;

import javax.inject.Singleton;

import lombok.extern.slf4j.Slf4j;

import com.google.inject.Inject;
import com.google.inject.Injector;
import com.googlecode.objectify.ObjectifyFactory;
import com.myinvestor.entity.DividendSummary;
import com.myinvestor.entity.G2YFinanceMapping;
import com.myinvestor.entity.Stock;

/**
 * Our version of ObjectifyFactory which integrates with Guice.  You could and convenience methods here too.
 */
@Singleton
@Slf4j
public class OfyFactory extends ObjectifyFactory
{
	private Injector injector;
	
	/**
	 * Register our entity types.
	 */
	@Inject
	public OfyFactory(Injector injector) {
		this.injector = injector;
		
		long time = System.currentTimeMillis();
		
		// Register classes
		this.register(Stock.class);
		this.register(G2YFinanceMapping.class);
		this.register(DividendSummary.class);
		
		long millis = System.currentTimeMillis() - time;
		log.info("Registration took " + millis + " millis");
	}

	@Override
	public Ofy begin() {
		return new Ofy(this);
	}
	
	@Override
	public <T> T construct(Class<T> type) {
		return injector.getInstance(type);
	}

}