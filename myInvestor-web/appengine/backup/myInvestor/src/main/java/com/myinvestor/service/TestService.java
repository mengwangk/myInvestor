package com.myinvestor.service;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import lombok.extern.slf4j.Slf4j;

@Path("/test")
@Slf4j
public class TestService {

	@GET
	@Path("/hello")
	@Produces(MediaType.APPLICATION_JSON)
	public String hello() {
		log.debug("hello service invoked.");
		return "hello";
	}
}
