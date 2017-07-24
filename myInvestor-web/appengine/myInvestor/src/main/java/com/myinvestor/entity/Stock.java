package com.myinvestor.entity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import com.googlecode.objectify.annotation.Cache;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;


@Entity
@Cache
@NoArgsConstructor
@EqualsAndHashCode(of="id")
public class Stock {
	

	@Getter
	@Setter
	@Id 
	private String id;
	
	@Getter
	@Setter
	@Index
	private String exchangeName;
	
	@Getter
	@Setter
	@Index
	private String stockSymbol;
	
	@Getter
	@Setter
	private Double currentPE;
	
	@Getter
	@Setter
	private String currentPrice;
	
	@Getter
	@Setter
	private String extractedTimestamp ;

}
