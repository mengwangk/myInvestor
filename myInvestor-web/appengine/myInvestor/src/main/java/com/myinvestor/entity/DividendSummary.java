package com.myinvestor.entity;

import java.util.Date;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Cache
@NoArgsConstructor
@EqualsAndHashCode(of="id")
public class DividendSummary {

	@Getter
	@Setter
	@Id 
	private String id;
	
	@Getter
	@Setter
	@Index
	private String gExchangeName;
	
	@Getter
	@Setter
	@Index
	private String gStockSymbol;
	
	@Getter
	@Setter
	private Integer dividendYear;
	
	@Getter
	@Setter
	private Double dividend;
	
	@Getter
	@Setter
	private Double currentPrice;
	
	@Getter
	@Setter
	private Date priceDate;
	
	@Getter
	@Setter
	private Double dividendYield;
	
}
