package com.myinvestor.service;

import org.apache.commons.lang3.StringUtils;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiIssuer;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.appengine.repackaged.com.google.gson.JsonSyntaxException;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.myinvestor.common.EntityHelper;
import com.myinvestor.entity.Message;
import com.myinvestor.entity.Stock;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

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
	private Type stockType = new TypeToken<ArrayList<Stock>>(){}.getType();

	@ApiMethod(name = "stock", httpMethod = ApiMethod.HttpMethod.GET, path = "stock")
	public Message getStock() {
		log.info("Stock GET request");
		return new Message("");
	}

	@ApiMethod(name = "stock", httpMethod = ApiMethod.HttpMethod.POST, path = "stock")
	public void saveStock(Message message) {
		if (!StringUtils.isEmpty(message.getMessage())) {
			final Gson gson = gsonBuilder.create();
			try {
				List<Stock> stocks = gson.fromJson(message.getMessage(), stockType);
				log.info("Number of stocks recevied: " + stocks.size());
				for (Stock stock: stocks) {
					// Set the ID
					stock.setId(stock.getExchangeName() + EntityHelper.ID_FIELD_JOINER + stock.getStockSymbol());
					
					// Save to cloud data store
				}
				
				
			} catch (JsonSyntaxException jsonEx) {
				log.error("[saveStock] Unable to save stocks", jsonEx);
			} catch (Exception ex) {
				log.error("[saveStock] U", ex);
			}
		} else {
			log.error("No stocks received");
		}
	}

	@ApiMethod(name = "mapping", httpMethod = ApiMethod.HttpMethod.GET, path = "mapping")
	public Message getMapping() {
		return new Message("");
	}

	@ApiMethod(name = "mapping", httpMethod = ApiMethod.HttpMethod.POST, path = "mapping")
	public void saveMapping(Message message) {
		log.info("message ---" + message.getMessage());
	}

	@ApiMethod(name = "dividend", httpMethod = ApiMethod.HttpMethod.GET, path = "dividend")
	public Message getDividend() {
		return new Message("");
	}

	@ApiMethod(name = "dividend", httpMethod = ApiMethod.HttpMethod.POST, path = "dividend")
	public void saveDividend(Message message) {
		log.info("message ---" + message.getMessage());
	}

}
