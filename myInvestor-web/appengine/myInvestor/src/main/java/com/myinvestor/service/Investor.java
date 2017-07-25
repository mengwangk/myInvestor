package com.myinvestor.service;

import static com.myinvestor.datastore.OfyService.ofy;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

import org.apache.commons.lang3.StringUtils;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiIssuer;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.appengine.repackaged.com.google.gson.JsonSyntaxException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.myinvestor.AppConfig;
import com.myinvestor.entity.DividendSummary;
import com.myinvestor.entity.G2YFinanceMapping;
import com.myinvestor.entity.Message;
import com.myinvestor.entity.Stock;
import com.myinvestor.util.EntityHelper;

import lombok.extern.slf4j.Slf4j;

/**
 * Investor APIs EndPoints will be exposing.
 *
 */
@Slf4j
@Api(name = "investor", version = "v1", namespace = @ApiNamespace(ownerDomain = "investor.myinvestor.com", ownerName = "investor.myinvestor.com", packagePath = ""), issuers = {
		@ApiIssuer(name = "firebase", issuer = "https://securetoken.google.com/myinvestor", jwksUri = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com") })
public final class Investor {

	private GsonBuilder gsonBuilder = new GsonBuilder();

	private Type stockType = new TypeToken<ArrayList<Stock>>() {}.getType();
	private Type mappingType = new TypeToken<ArrayList<G2YFinanceMapping>>() {}.getType();
	private Type dividendSummaryType = new TypeToken<ArrayList<DividendSummary>>() {}.getType();

	@ApiMethod(name = "stock", httpMethod = ApiMethod.HttpMethod.GET, path = "stock/{exchangeName}")
	public Message getStock(@Named("exchangeName") String exchangeName) {
		final List<Stock> stocks = ofy().load().type(Stock.class).filter("exchangeName =", exchangeName).list();
		final Gson gson = gsonBuilder.setDateFormat(AppConfig.UNIVERSAL_DATE_FORMAT).create();
		return new Message(gson.toJson(stocks));
	}

	@ApiMethod(name = "stock", httpMethod = ApiMethod.HttpMethod.POST, path = "stock")
	public void saveStock(Message message) {
		if (!StringUtils.isEmpty(message.getMessage())) {
			final Gson gson = gsonBuilder.setDateFormat(AppConfig.UNIVERSAL_DATE_FORMAT).create();
			try {
				List<Stock> stocks = gson.fromJson(message.getMessage(), stockType);
				log.info("Number of stocks recevied: " + stocks.size());
				for (Stock stock : stocks) {
					// Set the ID
					stock.setId(stock.getExchangeName() + EntityHelper.ID_FIELD_JOINER + stock.getStockSymbol());
				}
				// Save to cloud data store
				ofy().save().entities(stocks).now();
			} catch (JsonSyntaxException jsonEx) {
				log.error("[saveStock] Unable to save stocks", jsonEx);
			} catch (Exception ex) {
				log.error("[saveStock] Unknown error", ex);
			}
		} else {
			log.error("No stocks received");
		}
	}

	@ApiMethod(name = "mapping", httpMethod = ApiMethod.HttpMethod.GET, path = "mapping/{exchangeName}")
	public Message getMapping(@Named("exchangeName") String exchangeName) {
		final List<G2YFinanceMapping> mappings = ofy().load().type(G2YFinanceMapping.class).filter("gExchangeName =", exchangeName).list();
		final Gson gson = gsonBuilder.setDateFormat(AppConfig.UNIVERSAL_DATE_FORMAT).create();
		return new Message(gson.toJson(mappings));
	}

	@ApiMethod(name = "mapping", httpMethod = ApiMethod.HttpMethod.POST, path = "mapping")
	public void saveMapping(Message message) {
		if (!StringUtils.isEmpty(message.getMessage())) {
			final Gson gson = gsonBuilder.setDateFormat(AppConfig.UNIVERSAL_DATE_FORMAT).create();
			try {
				List<G2YFinanceMapping> mappings = gson.fromJson(message.getMessage(), mappingType);
				log.info("Number of mappings recevied: " + mappings.size());
				for (G2YFinanceMapping mapping : mappings) {
					// Set the ID
					mapping.setId(mapping.getGStockSymbol() + EntityHelper.ID_FIELD_JOINER + mapping.getYStockSymbol());
				}
				// Save to cloud data store
				ofy().save().entities(mappings).now();
			} catch (JsonSyntaxException jsonEx) {
				log.error("[saveMapping] Unable to save mappings", jsonEx);
			} catch (Exception ex) {
				log.error("[saveMapping] Unknown error", ex);
			}
		} else {
			log.error("No mappings received");
		}
	}

	@ApiMethod(name = "dividend", httpMethod = ApiMethod.HttpMethod.GET, path = "dividend/{exchangeName}")
	public Message getDividend(@Named("exchangeName") String exchangeName) {
		final List<DividendSummary> dividendSummaries = ofy().load().type(DividendSummary.class).filter("gExchangeName =", exchangeName).list();
		final Gson gson = gsonBuilder.setDateFormat(AppConfig.UNIVERSAL_DATE_FORMAT).create();
		return new Message(gson.toJson(dividendSummaries));
	}

	@ApiMethod(name = "dividend", httpMethod = ApiMethod.HttpMethod.POST, path = "dividend")
	public void saveDividend(Message message) {
		if (!StringUtils.isEmpty(message.getMessage())) {
			final Gson gson = gsonBuilder.setDateFormat(AppConfig.UNIVERSAL_DATE_FORMAT).create();
			try {
				List<DividendSummary> dividendSummaries = gson.fromJson(message.getMessage(), dividendSummaryType);
				log.info("Number of dividend summaries recevied: " + dividendSummaries.size());
				for (DividendSummary dividendSummary : dividendSummaries) {
					// Set the ID
					dividendSummary.setId(dividendSummary.getGExchangeName() + EntityHelper.ID_FIELD_JOINER
							+ dividendSummary.getGStockSymbol() + EntityHelper.ID_FIELD_JOINER
							+ dividendSummary.getDividendYear());
				}
				// Save to cloud data store
				ofy().save().entities(dividendSummaries).now();
			} catch (JsonSyntaxException jsonEx) {
				log.error("[saveDividend] Unable to save mappings", jsonEx);
			} catch (Exception ex) {
				log.error("[saveDividend] Unknown error", ex);
			}
		} else {
			log.error("No dividend summaries received");
		}
	}

}
