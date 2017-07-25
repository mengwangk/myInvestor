package com.myinvestor.entity;

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
public class G2YFinanceMapping {

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
	private String gStockName;
	
	@Getter
	@Setter
	@Index
	private String yExchangeName;
	
	@Getter
	@Setter
	@Index
	private String yStockSymbol;
	
	@Getter
	@Setter
	private String yStockName;
}
