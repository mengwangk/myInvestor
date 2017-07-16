package com.myinvestor.service;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiIssuer;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.myinvestor.entity.Exchange;

/**
 * Investor APIs EndPoints will be exposing.
 *
 */
@Api(name = "investor", version = "v1", namespace = @ApiNamespace(ownerDomain = "investor.myinvestor.com", ownerName = "investor.myinvestor.com", packagePath = ""), issuers = {
		@ApiIssuer(name = "firebase", issuer = "https://securetoken.google.com/myinvestor", jwksUri = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com") })
public final class Investor {

	@ApiMethod(name = "hello", httpMethod = ApiMethod.HttpMethod.GET)
	public Exchange echo(Exchange exchange) {
		Exchange e = new Exchange();
		e.setExchangeName("testing");
		return e;
	}
}
