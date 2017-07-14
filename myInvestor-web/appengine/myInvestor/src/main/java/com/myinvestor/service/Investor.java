package com.myinvestor.service;


import com.google.api.server.spi.auth.EspAuthenticator;
import com.google.api.server.spi.auth.common.User;
import com.google.api.server.spi.config.AnnotationBoolean;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiIssuer;
import com.google.api.server.spi.config.ApiIssuerAudience;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.ApiNamespace;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.config.Nullable;
import com.google.api.server.spi.response.UnauthorizedException;
import com.myinvestor.entity.Email;
import com.myinvestor.entity.Message;

/**
 * Investor APIs EndPoints will be exposing.
 *
 */
@Api(
	    name = "investor",
	    version = "v1",
	    namespace =
	      @ApiNamespace(
	        ownerDomain = "investor.myinvestor.com",
	        ownerName = "investor.myinvestor.com",
	        packagePath = ""
	      ),
	    issuers = {
	      @ApiIssuer(
	        name = "firebase",
	        issuer = "https://securetoken.google.com/myinvestor-stg",
	        jwksUri = "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")
	    }
    )
public class Investor {

}
